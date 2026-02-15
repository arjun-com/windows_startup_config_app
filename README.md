# Windows Startup Configuration App

<div align="center">

![Electron](https://img.shields.io/badge/Electron-22.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows)

**A modern Electron + React desktop application for managing Windows startup sequences.**

Configure which applications, scripts, and URLs launch when you log into Windows, with visual ordering, custom delays, and system tray integration.

[Features](#-features) • [Installation](#-installation--setup) • [Usage](#-usage-guide) • [Contributing](CONTRIBUTING.md) • [License](#-license)

</div>

---

## ✨ Features

### Core Functionality
- ✅ **Visual Configuration**: Intuitive UI for managing startup items
- ✅ **Multiple Item Types**: Support for executables (.exe), scripts (PowerShell, Batch, Python), and URLs
- ✅ **Sequential Execution**: Launch items in order with configurable delays
- ✅ **Enable/Disable Items**: Toggle items on/off without deleting them
- ✅ **Reordering**: Move items up/down to change execution order
- ✅ **Edit Items**: Modify existing items without recreating them

### Advanced Features
- ✅ **Windows Startup Integration**: Automatically run your sequence at Windows login
- ✅ **System Tray**: Minimize to tray and run in the background
- ✅ **Manual Execution**: Trigger your startup sequence on demand
- ✅ **Progress Tracking**: Real-time execution progress with visual feedback
- ✅ **Toast Notifications**: Clean, modern notifications for all actions
- ✅ **Configuration Persistence**: All settings saved automatically to JSON

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Windows OS

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the React App**
   ```bash
   npx webpack
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

   For development with auto-open DevTools:
   ```bash
   npm start -- --dev
   ```

## 📖 Usage Guide

### Adding Startup Items

1. Click the **"Add Item"** button
2. Choose the item type:
   - **Executable**: Launch .exe files
   - **Script**: Run PowerShell (.ps1), Batch (.bat/.cmd), or Python (.py) scripts
   - **URL**: Open websites in default browser
3. Fill in the required fields:
   - **Name**: Display name for the item
   - **Path/URL**: File path or web address
   - **Arguments**: Optional command-line arguments (for executables/scripts)
   - **Delay**: Time to wait (in milliseconds) before launching the next item
4. Click **"Add Item"** to save

### Managing Items

- **Edit**: Click the ✎ icon to modify an existing item
- **Delete**: Click the ✕ icon to remove an item (with confirmation)
- **Enable/Disable**: Use the checkbox to toggle items without deleting
- **Reorder**: Use ▲ and ▼ buttons to change execution order

### Running Your Sequence

**Manual Execution:**
- Click the **"Run Sequence"** button in the app
- Or right-click the system tray icon → **"Run Startup Sequence"**

**Automatic Execution:**
1. Check the **"Run at Windows startup"** checkbox
2. The app will register with Windows startup
3. Your sequence will execute automatically 3 seconds after login

### System Tray

- Click the **X** button to minimize to tray (app keeps running)
- Click the tray icon to show/hide the window
- Right-click the tray icon for quick actions:
  - Run Startup Sequence
  - Show/Hide Window
  - Quit

## 📂 Project Structure

```
windows_startup_config_app/
├── main/                          # Electron main process
│   ├── main.js                    # App entry point
│   ├── configManager.js           # Configuration file I/O
│   ├── executionEngine.js         # Sequential item launcher
│   ├── startupManager.js          # Windows startup integration
│   ├── trayManager.js             # System tray functionality
│   ├── notificationManager.js     # Desktop notifications
│   └── ipcHandlers.js             # IPC communication setup
├── renderer/                      # React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddItemModal.js    # Add new items
│   │   │   ├── EditItemModal.js   # Edit existing items
│   │   │   ├── StartupItem.js     # Individual item display
│   │   │   └── Toast.js           # Notification component
│   │   ├── styles/
│   │   │   ├── Modal.css
│   │   │   ├── StartupItem.css
│   │   │   └── Toast.css
│   │   ├── App.js                 # Root React component
│   │   └── index.js               # React entry point
│   ├── dist/                      # Webpack build output
│   └── public/
│       ├── index.html
│       └── icons/                 # App and tray icons
├── preload/
│   └── preload.js                 # Security bridge (contextBridge)
├── package.json
├── webpack.config.js
└── README.md
```

## ⚙️ Configuration

Configuration is stored at:
```
%APPDATA%\windows-startup-config-app\startup-config.json
```

**Configuration Format:**
```json
{
  "version": "1.0.0",
  "autoRunOnStartup": true,
  "items": [
    {
      "id": "unique-id",
      "type": "executable|script|url",
      "name": "Display Name",
      "path": "C:\\Path\\To\\File.exe",
      "url": "https://example.com",
      "args": "command line arguments",
      "scriptType": "powershell|batch|python",
      "delay": 2000,
      "enabled": true,
      "order": 0
    }
  ]
}
```

## 💻 Development

### Available Scripts

- `npm start` - Build and run the app
- `npm run dev` - Watch mode for development (webpack + electron)
- `npm run build` - Build for production with electron-builder

### Building for Distribution

```bash
npm run build
```

This will create a Windows installer in the `dist/` directory.

## 🎨 Icons

Custom icons can be added to enhance the visual experience:

- **Tray Icon**: `renderer/public/icons/tray-icon.png` (16x16 or 32x32 PNG)
- **App Icon**: `renderer/public/icons/app-icon.ico` (Multi-resolution .ico file)

See `renderer/public/icons/README.md` for detailed icon specifications.

## 🔧 Troubleshooting

### App doesn't start at Windows login
- Verify the "Run at Windows startup" checkbox is enabled
- Check Windows Task Manager → Startup tab for "WindowsStartupConfigApp"

### Items don't execute
- Ensure items are enabled (checkbox is checked)
- Verify file paths are correct
- Check that scripts have correct execution permissions
- For PowerShell scripts, ensure execution policy allows script running

### Tray icon not visible
- The tray icon file may be missing (see Icons section)
- The app will still function; right-click the taskbar notification area to find it

## 🔒 Security

- **Context Isolation**: Renderer process is isolated from Node.js
- **No Node Integration**: Renderer cannot directly access Node.js APIs
- **PreloadScript**: Secure bridge using Electron's contextBridge
- **Input Validation**: All user inputs are validated before execution

## 🛠️ Technologies

- **Electron 22.0.0** - Desktop application framework
- **React 19.2.4** - UI framework
- **Webpack 5** - Module bundler
- **Babel 7** - JavaScript transpiler

## 📋 Implementation Status

### ✅ All Features Completed!

1. ✅ **Project Setup** - npm, webpack, babel configuration
2. ✅ **Electron Foundation** - Main process, window management, security
3. ✅ **Configuration Management** - JSON persistence with validation
4. ✅ **React UI Foundation** - Complete component hierarchy
5. ✅ **IPC Communication** - Secure bidirectional messaging
6. ✅ **UI Components** - AddItemModal, EditItemModal, StartupItem, Toast
7. ✅ **Execution Engine** - Sequential launcher for exe/scripts/URLs
8. ✅ **Windows Startup Integration** - Registry-based auto-run
9. ✅ **System Tray** - Minimize to tray, context menu
10. ✅ **Error Handling & Notifications** - Toast notifications, desktop alerts
11. ✅ **Polish Features** - Edit functionality, icons documentation

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- How to set up the development environment
- Code style guidelines
- How to submit pull requests
- Areas where we need help

### Quick Start for Contributors
```bash
git clone https://github.com/YOUR_USERNAME/windows-startup-config-app.git
cd windows-startup-config-app
npm install
npm start
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Bug Reports**: [Open an issue](../../issues/new?template=bug_report.md)
- **Feature Requests**: [Open an issue](../../issues/new?template=feature_request.md)
- **Questions**: Check [existing issues](../../issues) or open a new one
- **Pull Requests**: See [Contributing Guide](CONTRIBUTING.md)

## 📜 Version History

### v1.0.0 (Current)
- Initial release
- Full startup item management (add, edit, delete, reorder)
- Windows startup integration
- System tray support with minimize-to-tray
- Toast notifications for all actions
- Real-time execution progress tracking
- Support for executables, scripts (PowerShell/Batch/Python), and URLs
- Configuration persistence

---

**Made with ❤️ using Electron and React**
