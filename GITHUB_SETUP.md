# GitHub Setup Guide

This guide will help you push this project to GitHub.

## Prerequisites

- Git installed on your system
- A GitHub account
- Repository created on GitHub (or will create during setup)

## Quick Start

### 1. Initialize Git Repository

Open terminal in the project directory and run:

```bash
cd c:\Users\azgam\Documents\code\windows_startup_config_app
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: Windows Startup Configuration App v1.0.0

- Full startup item management (add, edit, delete, reorder)
- Windows startup integration
- System tray support
- Toast notifications
- Real-time execution progress
- Support for executables, scripts, and URLs"
```

### 4. Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to https://github.com/new
2. Repository name: `windows-startup-config-app`
3. Description: `Windows startup sequence manager with visual configuration`
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Option B: Via GitHub CLI (gh)**
```bash
gh repo create windows-startup-config-app --public --source=. --remote=origin --push
```

### 5. Connect to GitHub (if using Option A)

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/windows-startup-config-app.git
git branch -M main
git push -u origin main
```

### 6. Update Repository URLs

After creating the repository, update the following files with your actual GitHub username:

**package.json:**
```json
"repository": {
  "type": "git",
  "url": "https://github.com/YOUR_USERNAME/windows-startup-config-app.git"
},
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/windows-startup-config-app/issues"
},
"homepage": "https://github.com/YOUR_USERNAME/windows-startup-config-app#readme"
```

**CHANGELOG.md:**
```markdown
[1.0.0]: https://github.com/YOUR_USERNAME/windows-startup-config-app/releases/tag/v1.0.0
```

Then commit the changes:
```bash
git add package.json CHANGELOG.md
git commit -m "Update repository URLs"
git push
```

## Repository Settings

### Topics/Tags (Recommended)

Add these topics to your GitHub repository to improve discoverability:
- `electron`
- `react`
- `windows`
- `startup-manager`
- `desktop-app`
- `system-tray`
- `automation`
- `electron-app`
- `react-app`

To add topics: Go to your repository → About → Settings (gear icon) → Add topics

### Branch Protection (Recommended)

For collaborative projects:
1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Include administrators

### Enable Features

1. Go to repository Settings → General
2. Enable:
   - ✓ Issues
   - ✓ Wiki (optional)
   - ✓ Projects (optional)
   - ✓ Discussions (optional)

## Creating a Release

### 1. Tag the Release

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
git push origin v1.0.0
```

### 2. Create Release on GitHub

1. Go to repository → Releases → Create a new release
2. Tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG.md
5. Attach built installers (if you've run `npm run build`)
6. Click "Publish release"

## Optional Enhancements

### Add Screenshots

1. Create a `screenshots/` directory
2. Add screenshots of the app in use
3. Update README.md with images:
   ```markdown
   ## Screenshots

   ![Main Interface](screenshots/main-interface.png)
   ![Add Item Modal](screenshots/add-item.png)
   ```

### Add Shields/Badges

Already added in README.md! You can add more at https://shields.io/

### Setup GitHub Pages (Optional)

For project documentation:
1. Go to repository Settings → Pages
2. Source: `main` branch, `/docs` folder
3. Create `/docs` folder with documentation

### Add GitHub Actions

Already configured in `.github/workflows/build.yml`!
- Automatically builds on push/PR
- Tests multiple Node versions
- Creates build artifacts

## Collaboration Features

### Issue Templates

Already configured in `.github/ISSUE_TEMPLATE/`:
- Bug reports
- Feature requests

### Pull Request Template

Already configured in `.github/PULL_REQUEST_TEMPLATE.md`

### Contributing Guide

Already created in `CONTRIBUTING.md`

## After Publishing

1. **Star your own repo** (for visibility)
2. **Share the project**:
   - Twitter/X
   - Reddit (r/electron, r/reactjs)
   - Dev.to
   - Hacker News
3. **Add to awesome lists**:
   - awesome-electron
   - awesome-react

## Maintenance

### Regular Updates

```bash
# Pull latest changes
git pull origin main

# Make changes
# ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### Versioning

Follow Semantic Versioning (semver):
- MAJOR version: Breaking changes
- MINOR version: New features (backwards compatible)
- PATCH version: Bug fixes

## Troubleshooting

### Git Not Tracking Files

Check `.gitignore` - make sure you're not accidentally ignoring important files.

### Large Files

If you have large files (> 100MB), use Git LFS:
```bash
git lfs install
git lfs track "*.exe"
git lfs track "*.msi"
```

### Authentication Issues

Use Personal Access Token instead of password:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

Or setup SSH:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add to GitHub: Settings → SSH and GPG keys
```

## Quick Commands Reference

```bash
# Check status
git status

# View changes
git diff

# Add specific files
git add path/to/file

# Commit with message
git commit -m "Your message"

# Push to remote
git push

# Pull from remote
git pull

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# View remotes
git remote -v
```

## Success! 🎉

Your project is now on GitHub and ready for the world to see!

**Next Steps:**
1. Add screenshots to README
2. Create first release
3. Share your project
4. Accept contributions

---

**Note**: Remember to replace `YOUR_USERNAME` with your actual GitHub username in all files!
