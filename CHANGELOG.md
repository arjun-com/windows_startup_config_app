# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-15

### Added
- Initial release of Windows Startup Configuration App
- Visual configuration UI for managing startup items
- Support for multiple item types:
  - Executable files (.exe)
  - Scripts (PowerShell, Batch, Python)
  - URLs (opened in default browser)
- Add, edit, and delete startup items
- Enable/disable items without deletion
- Reorder items with up/down buttons
- Sequential execution engine with configurable delays
- Real-time execution progress tracking
- Windows startup integration (auto-run at login)
- System tray support with minimize-to-tray
- Toast notifications for user feedback
- Desktop notifications (Windows native)
- Configuration persistence (JSON-based)
- File browser dialog for selecting executables/scripts
- Comprehensive error handling
- Security features (context isolation, IPC bridge)

### Core Features
- **Main Process Components**:
  - ConfigManager - Configuration file I/O
  - ExecutionEngine - Sequential item launcher
  - StartupManager - Windows registry integration
  - TrayManager - System tray functionality
  - NotificationManager - Desktop notifications
  - IPC Handlers - Secure communication

- **Renderer Components**:
  - AddItemModal - Create new startup items
  - EditItemModal - Modify existing items
  - StartupItem - Individual item display
  - Toast - In-app notifications
  - Progress tracking UI

### Documentation
- Comprehensive README with usage guide
- Contributing guidelines
- MIT License
- GitHub issue templates (bug report, feature request)
- Pull request template
- Icon specifications and documentation

### Technical
- Electron 22.0.0
- React 19.2.4
- Webpack 5 bundling
- Babel 7 transpilation
- Context isolation enabled
- No node integration in renderer (secure)

---

## [Unreleased]

### Planned Features
- Drag-and-drop reordering
- Import/export configurations
- Multiple startup profiles
- Execution history logging
- Conditional execution rules
- Wait for process completion option
- Environment variable substitution
- Unit tests
- Integration tests

---

[1.0.0]: https://github.com/YOUR_USERNAME/windows-startup-config-app/releases/tag/v1.0.0
