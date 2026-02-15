# Contributing to Windows Startup Configuration App

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm
- Git
- Windows OS (for testing)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/windows-startup-config-app.git
   cd windows-startup-config-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build and Run**
   ```bash
   npm start
   ```

4. **Development Mode**
   ```bash
   npm run dev
   ```

## Development Workflow

### Project Structure

- `main/` - Electron main process (Node.js backend)
- `renderer/src/` - React UI components
- `preload/` - Secure IPC bridge
- `renderer/public/` - Static assets

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Keep changes focused and atomic
   - Test your changes thoroughly

3. **Test Your Changes**
   ```bash
   npm start
   ```
   - Test all affected features
   - Ensure no regressions
   - Test on clean Windows install if possible

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   **Commit Message Format:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks (not class components)
- Use meaningful variable names
- Add comments for complex logic
- Use async/await for asynchronous operations

### File Organization
- One component per file
- CSS files alongside components
- Use descriptive file names

### Example Code Style
```javascript
// Good
const handleExecuteSequence = async () => {
  try {
    const config = await loadConfig();
    await executeItems(config.items);
  } catch (error) {
    showToast('Execution failed', 'error');
  }
};

// Avoid
const a = async () => {
  try {
    let b = await c();
    d(b.e);
  } catch (f) {
    alert('error');
  }
};
```

## Types of Contributions

### Bug Reports
- Use the GitHub issue tracker
- Include steps to reproduce
- Include expected vs actual behavior
- Include system information (Windows version, Node version)

### Feature Requests
- Open an issue first to discuss
- Explain the use case
- Consider implementation complexity

### Code Contributions
- Bug fixes are always welcome
- New features should be discussed first
- UI improvements are appreciated
- Performance optimizations are valued

## Areas for Contribution

### High Priority
- [ ] Drag-and-drop reordering
- [ ] Import/export configurations
- [ ] Multiple startup profiles
- [ ] Better error messages
- [ ] Unit tests

### Medium Priority
- [ ] Custom icons and themes
- [ ] Execution history logging
- [ ] Conditional execution rules
- [ ] Wait for process completion option
- [ ] Environment variable substitution

### Low Priority
- [ ] macOS/Linux support
- [ ] Cloud sync for configurations
- [ ] Keyboard shortcuts
- [ ] Advanced scheduling

## Security Guidelines

### Important Security Rules
- Never disable `contextIsolation`
- Never enable `nodeIntegration` in renderer
- Always validate user inputs
- Use IPC for all main/renderer communication
- Don't execute arbitrary user code
- Sanitize file paths before execution

### Reporting Security Issues
If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email the maintainers privately
3. Include detailed reproduction steps
4. Allow time for a fix before disclosure

## Testing

### Manual Testing Checklist
- [ ] Add new startup item (exe, script, URL)
- [ ] Edit existing item
- [ ] Delete item
- [ ] Reorder items
- [ ] Enable/disable items
- [ ] Execute sequence
- [ ] Windows startup registration
- [ ] System tray functionality
- [ ] All notifications work

### Future Automated Testing
We plan to add:
- Unit tests with Jest
- Integration tests with Spectron
- E2E tests

## Documentation

### When to Update Docs
- New features added → Update README.md
- API changes → Update relevant files
- New dependencies → Update package.json and README
- Breaking changes → Update CHANGELOG.md (when we add one)

### Documentation Standards
- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep README.md up to date

## Pull Request Process

1. **Before Submitting**
   - Ensure your code builds without errors
   - Test all affected functionality
   - Update documentation if needed
   - Rebase on latest main branch

2. **PR Description Should Include**
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (for UI changes)

3. **Review Process**
   - Maintainers will review within 1-2 weeks
   - Address review comments
   - Make requested changes
   - Be patient and respectful

4. **After Merge**
   - Delete your feature branch
   - Celebrate your contribution! 🎉

## Questions?

- Open an issue for general questions
- Check existing issues and PRs first
- Be respectful and patient

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Windows Startup Configuration App! 🙏
