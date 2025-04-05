/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import RecommendationsCard from './RecommendationsCard';

const placeholderUrl = '/placeholder-card.webp';

function LazyRecommendationsCard({ movie, isLoading }) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholderUrl);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Отключаем наблюдение после срабатывания
          }
        });
      },
      { threshold: 0, rootMargin: '0px', triggerOnce: true }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !isLoading) {
      setImageSrc(movie.backdrop || placeholderUrl);
    }
  }, [isVisible, isLoading, movie.backdrop]);

  const handleImageError = () => {
    setImageSrc(placeholderUrl);
  };

  return (
    <div ref={containerRef}>
      <RecommendationsCard
        movie={{ ...movie, backdrop: imageSrc }}
        isLoading={isLoading}
        onImageError={handleImageError}
      />
    </div>
  );
}

export default LazyRecommendationsCard;
