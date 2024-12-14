import React from 'react';

interface StorySectionProps {
  title: string;
  descriptions: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  storySection?: React.ReactNode;
  contentChildren?: React.ReactNode;
  flipImage?: boolean;
}

export const StorySection: React.FC<StorySectionProps> = ({
  title,
  descriptions,
  imageSrc,
  imageAlt,
  imageCaption,
  storySection,
  contentChildren,
  flipImage
}) => {
  return (
    <div className='story-grid'>
      {flipImage && (
        <div className='story-image'>
          <img src={imageSrc} alt={imageAlt} className='featured-image' />
          <p className='image-caption'>{imageCaption}</p>
        </div>
      )}
      <div className='story-content'>
        <h2>{title}</h2>
        {descriptions.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {contentChildren}
      </div>

      {!flipImage && (
        <div className='story-image'>
          <img src={imageSrc} alt={imageAlt} className='featured-image' />
          <p className='image-caption'>{imageCaption}</p>
        </div>
      )}

      {storySection && <div className='story-section'>{storySection}</div>}
    </div>
  );
};
