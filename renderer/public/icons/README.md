# Application Icons

This directory should contain the application icons. The app currently expects the following icon files:

## Required Icons

### 1. Tray Icon (tray-icon.png)
- **File**: `tray-icon.png`
- **Format**: PNG
- **Size**: 16x16 pixels (or 32x32 for high-DPI displays)
- **Purpose**: Displayed in the Windows system tray
- **Design**: Simple, recognizable icon that works well at small sizes
- **Note**: The app has a fallback if this file is missing, but won't display a visible icon

### 2. Application Icon (app-icon.ico)
- **File**: `app-icon.ico`
- **Format**: ICO (Windows icon format)
- **Sizes**: Multi-resolution (16x16, 32x32, 48x48, 256x256)
- **Purpose**: Used as the window icon and taskbar icon
- **Note**: The app will run without this, but won't have a custom icon

## How to Create Icons

### Using Online Tools:
1. **ICO Converter**: Use websites like [ConvertICO](https://convertico.com/) or [ICO Convert](https://icoconvert.com/)
2. Design your icon or use an existing image
3. Convert to .ico format with multiple resolutions
4. Place the .ico file in this directory

### Using Design Software:
1. **GIMP** (Free): File → Export As → .ico
2. **Photoshop**: Use ICO plugin
3. **Inkscape** (Free): Export as PNG, then convert to ICO

### Quick PNG Icon:
For the tray icon, create a simple 16x16 or 32x32 PNG file with:
- Transparent background
- Simple, bold design
- High contrast for visibility

## Icon Design Tips

- **Keep it simple**: Icons need to be recognizable at small sizes
- **Use bold shapes**: Thin lines don't work well at 16x16
- **High contrast**: Ensure the icon stands out against light and dark backgrounds
- **Theme**: Consider using a gear/cog icon to represent system/startup configuration

## Current Status

✗ tray-icon.png - Not present (app uses empty fallback)
✗ app-icon.ico - Not present (app uses default Electron icon)

The application will work without these icons, but adding them will improve the user experience.
