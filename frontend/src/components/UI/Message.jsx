import './Message.css';

const Message = ({ 
  type = 'info', 
  children, 
  onClose,
  className = '',
  ...props 
}) => {
  const messageClass = `message message-${type} ${className}`.trim();

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={messageClass} {...props}>
      <span className="message-icon">{getIcon()}</span>
      <div className="message-content">{children}</div>
      {onClose && (
        <button className="message-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Message;
