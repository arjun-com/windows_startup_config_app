import React, { useState, useEffect } from 'react';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import StartupItem from './components/StartupItem';
import Toast from './components/Toast';

function App() {
  const [config, setConfig] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [executionProgress, setExecutionProgress] = useState(null);
  const [startupEnabled, setStartupEnabled] = useState(false);
  const [toast, setToast] = useState(null);

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration();
    loadStartupStatus();
    setupEventListeners();
    return () => {
      // Cleanup listeners
      if (window.electronAPI) {
        window.electronAPI.removeExecutionProgressListener();
        window.electronAPI.removeExecutionCompleteListener();
        window.electronAPI.removeExecutionErrorListener();
      }
    };
  }, []);

  const loadStartupStatus = async () => {
    try {
      if (window.electronAPI) {
        const enabled = await window.electronAPI.isStartupEnabled();
        setStartupEnabled(enabled);
      }
    } catch (error) {
      console.error('Failed to load startup status:', error);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const loadConfiguration = async () => {
    try {
      if (window.electronAPI) {
        const loadedConfig = await window.electronAPI.loadConfig();
        setConfig(loadedConfig);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      showToast('Failed to load configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async (newConfig) => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.saveConfig(newConfig);
        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      showToast('Failed to save configuration', 'error');
    }
  };

  const setupEventListeners = () => {
    if (window.electronAPI) {
      window.electronAPI.onExecutionProgress((data) => {
        console.log('Execution progress:', data);
        setExecutionProgress(data);
      });

      window.electronAPI.onExecutionComplete((data) => {
        setIsExecuting(false);
        setExecutionProgress(null);
        console.log('Execution complete:', data);
        showToast(`Successfully executed ${data.executedCount} item${data.executedCount !== 1 ? 's' : ''}!`, 'success');
      });

      window.electronAPI.onExecutionError((error) => {
        setIsExecuting(false);
        setExecutionProgress(null);
        console.error('Execution error:', error);
        showToast(`Execution error: ${error}`, 'error');
      });
    }
  };

  const handleRunSequence = async () => {
    try {
      setIsExecuting(true);
      if (window.electronAPI) {
        await window.electronAPI.executeSequence();
      }
    } catch (error) {
      console.error('Failed to execute sequence:', error);
      showToast('Failed to start execution', 'error');
      setIsExecuting(false);
    }
  };

  const handleAddItem = (newItem) => {
    const updatedItems = [...config.items, { ...newItem, order: config.items.length }];
    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleDeleteItem = (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const updatedItems = config.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index }));

    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleToggleItem = (itemId) => {
    const updatedItems = config.items.map(item =>
      item.id === itemId ? { ...item, enabled: !item.enabled } : item
    );
    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleMoveUp = (itemId) => {
    const index = config.items.findIndex(item => item.id === itemId);
    if (index <= 0) return;

    const updatedItems = [...config.items];
    [updatedItems[index - 1], updatedItems[index]] = [updatedItems[index], updatedItems[index - 1]];

    // Update order property
    updatedItems.forEach((item, idx) => {
      item.order = idx;
    });

    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleMoveDown = (itemId) => {
    const index = config.items.findIndex(item => item.id === itemId);
    if (index >= config.items.length - 1) return;

    const updatedItems = [...config.items];
    [updatedItems[index], updatedItems[index + 1]] = [updatedItems[index + 1], updatedItems[index]];

    // Update order property
    updatedItems.forEach((item, idx) => {
      item.order = idx;
    });

    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleEditItem = (itemId) => {
    const item = config.items.find(item => item.id === itemId);
    if (item) {
      setEditingItem(item);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = (updatedItem) => {
    const updatedItems = config.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    const updatedConfig = { ...config, items: updatedItems };
    saveConfiguration(updatedConfig);
  };

  const handleToggleStartup = async () => {
    try {
      if (window.electronAPI) {
        if (startupEnabled) {
          await window.electronAPI.disableStartup();
          setStartupEnabled(false);
          showToast('Disabled Windows startup', 'success');
        } else {
          await window.electronAPI.enableStartup();
          setStartupEnabled(true);
          showToast('Enabled Windows startup', 'success');
        }
      }
    } catch (error) {
      console.error('Failed to toggle startup:', error);
      showToast('Failed to update Windows startup setting', 'error');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Windows Startup Configuration</h1>
        <p className="subtitle">Configure your startup sequence</p>
      </header>

      <main className="app-main">
        <div className="control-panel">
          <button
            className="btn btn-primary"
            onClick={handleRunSequence}
            disabled={isExecuting || config.items.length === 0}
          >
            {isExecuting ? 'Running...' : 'Run Sequence'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddModal(true)}
            disabled={isExecuting}
          >
            Add Item
          </button>
          <label className="startup-toggle">
            <input
              type="checkbox"
              checked={startupEnabled}
              onChange={handleToggleStartup}
              disabled={isExecuting}
            />
            <span>Run at Windows startup</span>
          </label>
          <div className="item-count">
            {config.items.length} item{config.items.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isExecuting && executionProgress && (
          <div className="execution-progress">
            <div className="progress-text">
              Executing {executionProgress.current} of {executionProgress.total}: {executionProgress.itemName}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(executionProgress.current / executionProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="startup-list">
          {config.items.length === 0 ? (
            <div className="empty-state">
              <p>No startup items configured</p>
              <p className="empty-hint">Click "Add Item" to get started</p>
            </div>
          ) : (
            <div className="items-container">
              {config.items.map((item, index) => (
                <StartupItem
                  key={item.id}
                  item={item}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onToggle={handleToggleItem}
                  isFirst={index === 0}
                  isLast={index === config.items.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        item={editingItem}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
