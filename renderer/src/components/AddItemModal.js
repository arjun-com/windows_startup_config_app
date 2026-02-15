import React, { useState } from 'react';
import '../styles/Modal.css';

function AddItemModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    type: 'executable',
    name: '',
    path: '',
    url: '',
    args: '',
    scriptType: 'powershell',
    delay: 1000,
    enabled: true
  });

  const handleTypeChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBrowse = async () => {
    if (!window.electronAPI) return;

    try {
      const filePath = await window.electronAPI.openFileDialog({
        filters: getFileFilters()
      });

      if (filePath) {
        setFormData({ ...formData, path: filePath });

        // Auto-fill name from filename if empty
        if (!formData.name) {
          const fileName = filePath.split('\\').pop().split('/').pop();
          const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
          setFormData({ ...formData, path: filePath, name: nameWithoutExt });
        }
      }
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  };

  const getFileFilters = () => {
    if (formData.type === 'executable') {
      return [
        { name: 'Executables', extensions: ['exe'] },
        { name: 'All Files', extensions: ['*'] }
      ];
    } else if (formData.type === 'script') {
      return [
        { name: 'Scripts', extensions: ['ps1', 'bat', 'cmd', 'py'] },
        { name: 'All Files', extensions: ['*'] }
      ];
    }
    return [{ name: 'All Files', extensions: ['*'] }];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    if (formData.type === 'url' && !formData.url.trim()) {
      alert('Please enter a URL');
      return;
    }

    if ((formData.type === 'executable' || formData.type === 'script') && !formData.path.trim()) {
      alert('Please select a file');
      return;
    }

    // Create item object
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: formData.type,
      name: formData.name.trim(),
      path: formData.path.trim(),
      url: formData.url.trim(),
      args: formData.args.trim(),
      scriptType: formData.scriptType,
      delay: parseInt(formData.delay) || 0,
      enabled: formData.enabled,
      order: 0 // Will be set by parent
    };

    onAdd(newItem);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      type: 'executable',
      name: '',
      path: '',
      url: '',
      args: '',
      scriptType: 'powershell',
      delay: 1000,
      enabled: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Startup Item</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleTypeChange}>
              <option value="executable">Executable (.exe)</option>
              <option value="script">Script (PowerShell/Batch/Python)</option>
              <option value="url">URL/Website</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Display name for this item"
              required
            />
          </div>

          {formData.type === 'url' ? (
            <div className="form-group">
              <label>URL *</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                required
              />
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>File Path *</label>
                <div className="file-input-group">
                  <input
                    type="text"
                    name="path"
                    value={formData.path}
                    onChange={handleInputChange}
                    placeholder="C:\Path\To\File.exe"
                    required
                  />
                  <button type="button" className="btn btn-secondary" onClick={handleBrowse}>
                    Browse
                  </button>
                </div>
              </div>

              {formData.type === 'script' && (
                <div className="form-group">
                  <label>Script Type</label>
                  <select name="scriptType" value={formData.scriptType} onChange={handleInputChange}>
                    <option value="powershell">PowerShell (.ps1)</option>
                    <option value="batch">Batch (.bat, .cmd)</option>
                    <option value="python">Python (.py)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Arguments (Optional)</label>
                <input
                  type="text"
                  name="args"
                  value={formData.args}
                  onChange={handleInputChange}
                  placeholder="Additional command line arguments"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Delay After Launch (ms)</label>
            <input
              type="number"
              name="delay"
              value={formData.delay}
              onChange={handleInputChange}
              min="0"
              step="100"
            />
            <small>Time to wait before launching the next item</small>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
