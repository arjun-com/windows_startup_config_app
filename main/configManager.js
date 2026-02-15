const { app } = require('electron');
const fs = require('fs').promises;
const path = require('path');

class ConfigManager {
  constructor() {
    this.configDir = app.getPath('userData');
    this.configPath = path.join(this.configDir, 'startup-config.json');
    this.defaultConfig = {
      version: '1.0.0',
      autoRunOnStartup: false,
      items: []
    };
  }

  /**
   * Load configuration from disk
   * Creates default config if none exists
   */
  async loadConfig() {
    try {
      // Ensure config directory exists
      await fs.mkdir(this.configDir, { recursive: true });

      // Check if config file exists
      try {
        await fs.access(this.configPath);
      } catch (error) {
        // File doesn't exist, create default
        console.log('Config file not found, creating default...');
        await this.saveConfig(this.defaultConfig);
        return { ...this.defaultConfig };
      }

      // Read and parse config file
      const data = await fs.readFile(this.configPath, 'utf8');
      const config = JSON.parse(data);

      // Validate and merge with defaults
      const validatedConfig = this.validateConfig(config);
      return validatedConfig;
    } catch (error) {
      console.error('Error loading config:', error);
      // Return default config on error
      return { ...this.defaultConfig };
    }
  }

  /**
   * Save configuration to disk
   */
  async saveConfig(config) {
    try {
      // Ensure config directory exists
      await fs.mkdir(this.configDir, { recursive: true });

      // Validate config before saving
      const validatedConfig = this.validateConfig(config);

      // Write to file with pretty formatting
      await fs.writeFile(
        this.configPath,
        JSON.stringify(validatedConfig, null, 2),
        'utf8'
      );

      console.log('Config saved successfully to:', this.configPath);
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  /**
   * Validate and sanitize configuration object
   */
  validateConfig(config) {
    // Ensure required fields exist
    const validated = {
      version: config.version || this.defaultConfig.version,
      autoRunOnStartup: Boolean(config.autoRunOnStartup),
      items: Array.isArray(config.items) ? config.items : []
    };

    // Validate each item
    validated.items = validated.items.map((item, index) => {
      return {
        id: item.id || `item-${Date.now()}-${index}`,
        type: this.validateItemType(item.type),
        name: String(item.name || 'Unnamed Item'),
        path: item.path ? String(item.path) : '',
        url: item.url ? String(item.url) : '',
        args: item.args ? String(item.args) : '',
        scriptType: item.scriptType ? String(item.scriptType) : '',
        delay: this.validateDelay(item.delay),
        enabled: item.enabled !== undefined ? Boolean(item.enabled) : true,
        order: Number.isInteger(item.order) ? item.order : index
      };
    });

    // Sort items by order
    validated.items.sort((a, b) => a.order - b.order);

    return validated;
  }

  /**
   * Validate item type
   */
  validateItemType(type) {
    const validTypes = ['executable', 'script', 'url'];
    return validTypes.includes(type) ? type : 'executable';
  }

  /**
   * Validate delay value (must be non-negative number)
   */
  validateDelay(delay) {
    const parsed = Number(delay);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  /**
   * Get config file path
   */
  getConfigPath() {
    return this.configPath;
  }

  /**
   * Reset configuration to defaults
   */
  async resetConfig() {
    await this.saveConfig(this.defaultConfig);
    return { ...this.defaultConfig };
  }
}

module.exports = ConfigManager;
