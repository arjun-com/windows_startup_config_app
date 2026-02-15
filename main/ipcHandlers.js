const { ipcMain, dialog } = require('electron');

/**
 * Setup all IPC handlers for communication between main and renderer processes
 */
function setupIpcHandlers(configManager, executionEngine, startupManager, trayManager) {
  // Configuration Management
  ipcMain.handle('load-config', async () => {
    try {
      const config = await configManager.loadConfig();
      return config;
    } catch (error) {
      console.error('IPC load-config error:', error);
      throw error;
    }
  });

  ipcMain.handle('save-config', async (event, config) => {
    try {
      await configManager.saveConfig(config);
      return { success: true };
    } catch (error) {
      console.error('IPC save-config error:', error);
      throw error;
    }
  });

  // Execution Control
  ipcMain.handle('execute-sequence', async () => {
    try {
      const config = await configManager.loadConfig();
      if (executionEngine) {
        await executionEngine.executeSequence(config.items);
      }
      return { success: true };
    } catch (error) {
      console.error('IPC execute-sequence error:', error);
      throw error;
    }
  });

  ipcMain.handle('cancel-execution', async () => {
    try {
      if (executionEngine) {
        executionEngine.cancelExecution();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC cancel-execution error:', error);
      throw error;
    }
  });

  // File Dialog
  ipcMain.handle('open-file-dialog', async (event, options = {}) => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: options.filters || [
          { name: 'All Files', extensions: ['*'] },
          { name: 'Executables', extensions: ['exe'] },
          { name: 'Scripts', extensions: ['ps1', 'bat', 'cmd', 'py'] }
        ],
        ...options
      });

      if (result.canceled) {
        return null;
      }

      return result.filePaths[0];
    } catch (error) {
      console.error('IPC open-file-dialog error:', error);
      throw error;
    }
  });

  // Windows Startup Integration
  ipcMain.handle('enable-startup', async () => {
    try {
      if (startupManager) {
        await startupManager.enableStartup();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC enable-startup error:', error);
      throw error;
    }
  });

  ipcMain.handle('disable-startup', async () => {
    try {
      if (startupManager) {
        await startupManager.disableStartup();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC disable-startup error:', error);
      throw error;
    }
  });

  ipcMain.handle('is-startup-enabled', async () => {
    try {
      if (startupManager) {
        const enabled = startupManager.isStartupEnabled();
        return enabled;
      }
      return false;
    } catch (error) {
      console.error('IPC is-startup-enabled error:', error);
      return false;
    }
  });

  // Window Management
  ipcMain.handle('show-window', async (event) => {
    try {
      const window = require('electron').BrowserWindow.fromWebContents(event.sender);
      if (window) {
        window.show();
        window.focus();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC show-window error:', error);
      throw error;
    }
  });

  ipcMain.handle('hide-window', async (event) => {
    try {
      const window = require('electron').BrowserWindow.fromWebContents(event.sender);
      if (window) {
        window.hide();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC hide-window error:', error);
      throw error;
    }
  });

  ipcMain.handle('minimize-to-tray', async (event) => {
    try {
      const window = require('electron').BrowserWindow.fromWebContents(event.sender);
      if (window) {
        window.hide();
      }
      return { success: true };
    } catch (error) {
      console.error('IPC minimize-to-tray error:', error);
      throw error;
    }
  });

  console.log('IPC handlers setup complete');
}

module.exports = { setupIpcHandlers };
