const { Notification } = require('electron');

class NotificationManager {
  constructor() {
    this.isSupported = Notification.isSupported();
  }

  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @param {string} options.title - Notification title
   * @param {string} options.body - Notification body
   * @param {string} options.type - Notification type (success, error, info, warning)
   */
  show({ title, body, type = 'info' }) {
    if (!this.isSupported) {
      console.log(`[${type.toUpperCase()}] ${title}: ${body}`);
      return;
    }

    const notification = new Notification({
      title: title,
      body: body,
      icon: this.getIconForType(type),
      silent: false
    });

    notification.show();
  }

  /**
   * Show a success notification
   */
  success(title, body) {
    this.show({ title, body, type: 'success' });
  }

  /**
   * Show an error notification
   */
  error(title, body) {
    this.show({ title, body, type: 'error' });
  }

  /**
   * Show an info notification
   */
  info(title, body) {
    this.show({ title, body, type: 'info' });
  }

  /**
   * Show a warning notification
   */
  warning(title, body) {
    this.show({ title, body, type: 'warning' });
  }

  /**
   * Get icon path based on notification type
   * @private
   */
  getIconForType(type) {
    // Could return different icons based on type
    // For now, return undefined to use system default
    return undefined;
  }
}

module.exports = NotificationManager;
