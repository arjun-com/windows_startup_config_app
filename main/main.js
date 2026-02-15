const { app, BrowserWindow } = require('electron');
const path = require('path');
const ConfigManager = require('./configManager');
const ExecutionEngine = require('./executionEngine');
const StartupManager = require('./startupManager');
const TrayManager = require('./trayManager');
const NotificationManager = require('./notificationManager');
const { setupIpcHandlers } = require('./ipcHandlers');

let mainWindow = null;
let configManager = null;
let executionEngine = null;
let startupManager = null;
let trayManager = null;
let notificationManager = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../renderer/public/icons/app-icon.ico')
  });

  // Load the React app
  mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  createWindow();

  // Initialize managers after window is created
  configManager = new ConfigManager();
  notificationManager = new NotificationManager();
  executionEngine = new ExecutionEngine(mainWindow, notificationManager);
  startupManager = new StartupManager();
  trayManager = new TrayManager(mainWindow, executionEngine, configManager);

  // Create system tray
  trayManager.createTray();

  // Setup IPC handlers
  setupIpcHandlers(configManager, executionEngine, startupManager, trayManager);

  // Handle --startup flag: auto-execute sequence if app started at Windows login
  if (process.argv.includes('--startup')) {
    console.log('App started with --startup flag - auto-executing sequence');
    try {
      const config = await configManager.loadConfig();
      if (config.autoRunOnStartup && config.items.length > 0) {
        // Wait a bit for system to stabilize after login
        setTimeout(async () => {
          await executionEngine.executeSequence(config.items);
        }, 3000); // 3 second delay after login
      }
    } catch (error) {
      console.error('Failed to auto-execute startup sequence:', error);
    }
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Don't quit when all windows are closed (run in system tray)
app.on('window-all-closed', () => {
  // Keep app running in system tray
  // Users can quit via tray menu
});

// Handle app quit
app.on('before-quit', () => {
  app.isQuitting = true;
  if (trayManager) {
    trayManager.destroy();
  }
});
