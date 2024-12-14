interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className
}) => {
  return <div className={`card-container ${className || ''}`}>{children}</div>;
};
