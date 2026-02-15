const { spawn } = require('child_process');
const { shell } = require('electron');
const path = require('path');

class ExecutionEngine {
  constructor(mainWindow, notificationManager = null) {
    this.mainWindow = mainWindow;
    this.notificationManager = notificationManager;
    this.isExecuting = false;
    this.shouldCancel = false;
  }

  /**
   * Execute a sequence of startup items
   * @param {Array} items - Array of startup items
   */
  async executeSequence(items) {
    if (this.isExecuting) {
      console.log('Execution already in progress');
      return { success: false, error: 'Already executing' };
    }

    this.isExecuting = true;
    this.shouldCancel = false;

    try {
      // Filter enabled items and sort by order
      const enabledItems = items
        .filter(item => item.enabled)
        .sort((a, b) => a.order - b.order);

      if (enabledItems.length === 0) {
        this.sendProgress('No enabled items to execute');
        this.isExecuting = false;
        return { success: true, message: 'No items to execute' };
      }

      console.log(`Executing ${enabledItems.length} items...`);
      this.sendProgress(`Starting execution of ${enabledItems.length} items...`);

      for (let i = 0; i < enabledItems.length; i++) {
        if (this.shouldCancel) {
          this.sendError('Execution cancelled by user');
          break;
        }

        const item = enabledItems[i];
        console.log(`Executing item ${i + 1}/${enabledItems.length}: ${item.name}`);

        this.sendProgress({
          current: i + 1,
          total: enabledItems.length,
          itemName: item.name,
          itemType: item.type
        });

        try {
          await this.executeItem(item);
          console.log(`Successfully executed: ${item.name}`);
        } catch (error) {
          console.error(`Error executing ${item.name}:`, error.message);
          const errorMsg = `Failed to execute "${item.name}": ${error.message}`;
          this.sendError(errorMsg);

          // Show error notification
          if (this.notificationManager) {
            this.notificationManager.error('Execution Error', errorMsg);
          }
          // Continue with next item even if one fails
        }

        // Apply delay before next item
        if (i < enabledItems.length - 1 && item.delay > 0) {
          console.log(`Waiting ${item.delay}ms before next item...`);
          await this.delay(item.delay);
        }
      }

      this.sendComplete({
        success: true,
        executedCount: enabledItems.length
      });

      // Show success notification
      if (this.notificationManager) {
        this.notificationManager.success(
          'Execution Complete',
          `Successfully launched ${enabledItems.length} item${enabledItems.length !== 1 ? 's' : ''}`
        );
      }

      return { success: true, executedCount: enabledItems.length };
    } catch (error) {
      console.error('Execution sequence error:', error);
      this.sendError(`Execution failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      this.isExecuting = false;
      this.shouldCancel = false;
    }
  }

  /**
   * Execute a single item based on its type
   * @param {Object} item - Startup item
   */
  async executeItem(item) {
    switch (item.type) {
      case 'executable':
        return this.launchExecutable(item);
      case 'script':
        return this.launchScript(item);
      case 'url':
        return this.openUrl(item);
      default:
        throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  /**
   * Launch an executable file
   * @param {Object} item - Item with path and args
   */
  launchExecutable(item) {
    return new Promise((resolve, reject) => {
      if (!item.path) {
        reject(new Error('No path specified'));
        return;
      }

      try {
        const args = item.args ? item.args.trim().split(/\s+/) : [];

        const child = spawn(item.path, args, {
          detached: true,
          stdio: 'ignore',
          shell: false
        });

        // Detach the child process so it continues running independently
        child.unref();

        // Resolve immediately after spawning (don't wait for process to exit)
        resolve();
      } catch (error) {
        reject(new Error(`Failed to launch executable: ${error.message}`));
      }
    });
  }

  /**
   * Launch a script file
   * @param {Object} item - Item with path, scriptType, and args
   */
  launchScript(item) {
    return new Promise((resolve, reject) => {
      if (!item.path) {
        reject(new Error('No script path specified'));
        return;
      }

      try {
        let command;
        let args;

        // Determine command based on script type
        switch (item.scriptType) {
          case 'powershell':
            command = 'powershell.exe';
            args = ['-ExecutionPolicy', 'Bypass', '-File', item.path];
            break;

          case 'batch':
            command = 'cmd.exe';
            args = ['/c', item.path];
            break;

          case 'python':
            command = 'python';
            args = [item.path];
            break;

          default:
            // Try to detect from file extension
            const ext = path.extname(item.path).toLowerCase();
            if (ext === '.ps1') {
              command = 'powershell.exe';
              args = ['-ExecutionPolicy', 'Bypass', '-File', item.path];
            } else if (ext === '.bat' || ext === '.cmd') {
              command = 'cmd.exe';
              args = ['/c', item.path];
            } else if (ext === '.py') {
              command = 'python';
              args = [item.path];
            } else {
              reject(new Error(`Unknown script type: ${item.scriptType}`));
              return;
            }
        }

        // Add additional arguments if provided
        if (item.args) {
          args.push(...item.args.trim().split(/\s+/));
        }

        const child = spawn(command, args, {
          detached: true,
          stdio: 'ignore',
          shell: false
        });

        child.unref();
        resolve();
      } catch (error) {
        reject(new Error(`Failed to launch script: ${error.message}`));
      }
    });
  }

  /**
   * Open a URL in the default browser
   * @param {Object} item - Item with url
   */
  async openUrl(item) {
    if (!item.url) {
      throw new Error('No URL specified');
    }

    try {
      await shell.openExternal(item.url);
    } catch (error) {
      throw new Error(`Failed to open URL: ${error.message}`);
    }
  }

  /**
   * Delay execution for specified milliseconds
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cancel the current execution sequence
   */
  cancelExecution() {
    if (this.isExecuting) {
      console.log('Cancelling execution...');
      this.shouldCancel = true;
    }
  }

  /**
   * Send progress update to renderer
   */
  sendProgress(data) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('execution-progress', data);
    }
  }

  /**
   * Send completion notification to renderer
   */
  sendComplete(data) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('execution-complete', data);
    }
  }

  /**
   * Send error notification to renderer
   */
  sendError(error) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('execution-error',
        typeof error === 'string' ? error : error.message
      );
    }
  }
}

module.exports = ExecutionEngine;
