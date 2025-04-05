// Компонент для ленивой загрузки карточек фильмов.
import { useState, useRef, useEffect } from 'react';
import MovieCard from './Moviecard';

function LazyMovieCard(props) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // Отключаем наблюдение после первого срабатывания
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

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <MovieCard {...props} isLoading={false} />
      ) : (
        <MovieCard {...props} isLoading={true} />
      )}
    </div>
  );
}

export default LazyMovieCard;
