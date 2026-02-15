const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Configuration management
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),

  // Execution
  executeSequence: () => ipcRenderer.invoke('execute-sequence'),
  cancelExecution: () => ipcRenderer.invoke('cancel-execution'),

  // File operations
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),

  // Windows startup integration
  enableStartup: () => ipcRenderer.invoke('enable-startup'),
  disableStartup: () => ipcRenderer.invoke('disable-startup'),
  isStartupEnabled: () => ipcRenderer.invoke('is-startup-enabled'),

  // Window management
  showWindow: () => ipcRenderer.invoke('show-window'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),

  // Event listeners (from main to renderer)
  onExecutionProgress: (callback) => {
    ipcRenderer.on('execution-progress', (event, data) => callback(data));
  },
  onExecutionComplete: (callback) => {
    ipcRenderer.on('execution-complete', (event, data) => callback(data));
  },
  onExecutionError: (callback) => {
    ipcRenderer.on('execution-error', (event, data) => callback(data));
  },
  onConfigLoaded: (callback) => {
    ipcRenderer.on('config-loaded', (event, data) => callback(data));
  },

  // Remove listeners
  removeExecutionProgressListener: () => {
    ipcRenderer.removeAllListeners('execution-progress');
  },
  removeExecutionCompleteListener: () => {
    ipcRenderer.removeAllListeners('execution-complete');
  },
  removeExecutionErrorListener: () => {
    ipcRenderer.removeAllListeners('execution-error');
  }
});
