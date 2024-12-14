interface CardProps {
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  content?: string | React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  imageUrl,
  imageAlt,
  content,
  ctaText,
  ctaHref,
  className
}) => {
  return (
    <article className={`card ${className || ''}`}>
      {imageUrl && (
        <figure className='card-image'>
          <img src={imageUrl} alt={imageAlt || ''} />
        </figure>
      )}
      <div className='card-content'>
        {title && <h3 className='card-title'>{title}</h3>}
        {content && <div>{content}</div>}
        {ctaText && ctaHref && (
          <a href={ctaHref} className='cta-button'>
            {ctaText}
          </a>
        )}
      </div>
    </article>
  );
};
