/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';

const placeholderUrl = '/placeholder-card.webp';

function LazyLoadWrapper({
  component: WrappedComponent, // Компонент для рендера (MovieCard, ActorsCard, RecommendationsCard)
  data, // Данные для компонента (movie, actor и др.)
  imageField, // Поле с URL изображения ('poster', 'profile_path', 'backdrop')
  dataPropName = 'movie', // Имя пропса для передачи данных в WrappedComponent
  isLoading: externalLoading = false, // Внешнее состояние загрузки (если есть)
  onImageError, // Обработчик ошибки загрузки изображения (опционально)
  ...rest // Остальные пропсы для передачи в WrappedComponent
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(imageField ? placeholderUrl : null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
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
    if (isVisible && !externalLoading && imageField) {
      setImageSrc(data[imageField] || placeholderUrl);
    }
  }, [isVisible, externalLoading, imageField, data]);

  const handleImageError = () => {
    if (imageField && onImageError) {
      onImageError();
    } else if (imageField) {
      setImageSrc(placeholderUrl);
    }
  };

  // Если управляем изображением
  const updatedData = imageField ? { ...data, [imageField]: imageSrc } : data;

  return (
    <div ref={containerRef} className="h-100">
      <WrappedComponent
        {...rest}
        {...{ [dataPropName]: updatedData }} // динамическое имя пропса
        isLoading={imageField ? externalLoading : !isVisible || externalLoading}
        onImageError={imageField ? handleImageError : undefined}
      />
    </div>
  );
}

export default LazyLoadWrapper;
