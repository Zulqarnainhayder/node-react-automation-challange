import './Textarea.css';

const Textarea = ({ 
  label,
  error,
  required = false,
  className = '',
  rows = 3,
  ...props 
}) => {
  const textareaClass = `textarea ${error ? 'textarea-error' : ''} ${className}`.trim();

  return (
    <div className="textarea-group">
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={textareaClass}
        {...props}
      />
      {error && <span className="textarea-error-text">{error}</span>}
    </div>
  );
};

export default Textarea;
