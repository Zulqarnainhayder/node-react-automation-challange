import './Card.css';

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  shadow = true,
  ...props 
}) => {
  const cardClass = `card card-padding-${padding} ${shadow ? 'card-shadow' : ''} ${className}`.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;
