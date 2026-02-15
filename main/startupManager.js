const { app } = require('electron');
const path = require('path');

class StartupManager {
  constructor() {
    this.appName = 'WindowsStartupConfigApp';
    this.isWindows = process.platform === 'win32';
  }

  /**
   * Enable app to run on Windows startup
   * @returns {Promise<boolean>} Success status
   */
  async enableStartup() {
    if (!this.isWindows) {
      console.log('Startup registration is only supported on Windows');
      return false;
    }

    try {
      const exePath = app.getPath('exe');
      const startupPath = path.join(exePath, '--startup');

      // Set app to run on login with --startup flag
      app.setLoginItemSettings({
        openAtLogin: true,
        path: exePath,
        args: ['--startup']
      });

      console.log('Successfully enabled startup');
      return true;
    } catch (error) {
      console.error('Failed to enable startup:', error);
      throw error;
    }
  }

  /**
   * Disable app from running on Windows startup
   * @returns {Promise<boolean>} Success status
   */
  async disableStartup() {
    if (!this.isWindows) {
      console.log('Startup registration is only supported on Windows');
      return false;
    }

    try {
      // Remove app from login items
      app.setLoginItemSettings({
        openAtLogin: false
      });

      console.log('Successfully disabled startup');
      return true;
    } catch (error) {
      console.error('Failed to disable startup:', error);
      throw error;
    }
  }

  /**
   * Check if app is registered for startup
   * @returns {boolean} Current startup status
   */
  isStartupEnabled() {
    if (!this.isWindows) {
      return false;
    }

    const settings = app.getLoginItemSettings();
    return settings.openAtLogin;
  }

  /**
   * Toggle startup registration
   * @returns {Promise<boolean>} New startup status
   */
  async toggleStartup() {
    const currentStatus = this.isStartupEnabled();

    if (currentStatus) {
      await this.disableStartup();
      return false;
    } else {
      await this.enableStartup();
      return true;
    }
  }
}

module.exports = StartupManager;
