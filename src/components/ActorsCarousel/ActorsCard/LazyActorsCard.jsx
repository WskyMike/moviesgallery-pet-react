/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import ActorsCard from './ActorsCard';

const placeholderUrl = '/placeholder-card.webp';

function LazyActorsCard({ actor }) {
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
    if (isVisible) {
      setImageSrc(actor.profile_path || placeholderUrl);
    }
  }, [isVisible, actor.profile_path]);

  return (
    <div ref={containerRef} className="h-100">
      <ActorsCard actor={{ ...actor, profile_path: imageSrc }} />
    </div>
  );
}

export default LazyActorsCard;
