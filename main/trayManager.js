const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

class TrayManager {
  constructor(mainWindow, executionEngine, configManager) {
    this.mainWindow = mainWindow;
    this.executionEngine = executionEngine;
    this.configManager = configManager;
    this.tray = null;
  }

  /**
   * Create and setup the system tray icon and menu
   */
  createTray() {
    // Try to load the tray icon, fallback to a simple icon if not found
    let trayIconPath;
    try {
      trayIconPath = path.join(__dirname, '../renderer/public/icons/tray-icon.png');
      this.tray = new Tray(trayIconPath);
    } catch (error) {
      console.log('Tray icon not found, using default');
      // Create a simple 16x16 image as fallback
      const image = nativeImage.createEmpty();
      this.tray = new Tray(image);
    }

    this.tray.setToolTip('Windows Startup Config');
    this.updateMenu();

    // Click on tray icon shows/hides window
    this.tray.on('click', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isVisible()) {
          this.mainWindow.hide();
        } else {
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      }
    });

    console.log('System tray created');
  }

  /**
   * Update the tray context menu
   */
  updateMenu() {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Run Startup Sequence',
        click: async () => {
          try {
            const config = await this.configManager.loadConfig();
            if (config.items.length > 0) {
              await this.executionEngine.executeSequence(config.items);
            }
          } catch (error) {
            console.error('Failed to execute sequence from tray:', error);
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Show Window',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.show();
            this.mainWindow.focus();
          }
        }
      },
      {
        label: 'Hide Window',
        click: () => {
          if (this.mainWindow) {
            this.mainWindow.hide();
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        click: () => {
          // Force quit the app
          require('electron').app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  /**
   * Destroy the tray icon
   */
  destroy() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }

  /**
   * Get the tray instance
   */
  getTray() {
    return this.tray;
  }
}

module.exports = TrayManager;
