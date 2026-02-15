import React from 'react';
import '../styles/StartupItem.css';

function StartupItem({ item, onMoveUp, onMoveDown, onEdit, onDelete, onToggle, isFirst, isLast }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'executable':
        return '⚙️';
      case 'script':
        return '📜';
      case 'url':
        return '🌐';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'executable':
        return 'Executable';
      case 'script':
        return `Script (${item.scriptType || 'unknown'})`;
      case 'url':
        return 'URL';
      default:
        return type;
    }
  };

  const getPathDisplay = () => {
    if (item.type === 'url') {
      return item.url;
    }
    // Show just filename for path
    const path = item.path || '';
    const filename = path.split('\\').pop().split('/').pop();
    return filename || path;
  };

  return (
    <div className={`startup-item ${!item.enabled ? 'disabled' : ''}`}>
      <div className="item-checkbox">
        <input
          type="checkbox"
          checked={item.enabled}
          onChange={() => onToggle(item.id)}
          title={item.enabled ? 'Disable this item' : 'Enable this item'}
        />
      </div>

      <div className="item-icon">{getTypeIcon(item.type)}</div>

      <div className="item-details">
        <div className="item-name">{item.name}</div>
        <div className="item-meta">
          <span className="item-type">{getTypeLabel(item.type)}</span>
          <span className="item-separator">•</span>
          <span className="item-path" title={item.type === 'url' ? item.url : item.path}>
            {getPathDisplay()}
          </span>
          {item.delay > 0 && (
            <>
              <span className="item-separator">•</span>
              <span className="item-delay">⏱️ {item.delay}ms</span>
            </>
          )}
        </div>
      </div>

      <div className="item-actions">
        <button
          className="btn-icon"
          onClick={() => onMoveUp(item.id)}
          disabled={isFirst}
          title="Move up"
        >
          ▲
        </button>
        <button
          className="btn-icon"
          onClick={() => onMoveDown(item.id)}
          disabled={isLast}
          title="Move down"
        >
          ▼
        </button>
        <button
          className="btn-icon"
          onClick={() => onEdit(item.id)}
          title="Edit"
        >
          ✎
        </button>
        <button
          className="btn-icon btn-icon-danger"
          onClick={() => onDelete(item.id)}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default StartupItem;
