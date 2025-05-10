import { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FastAverageColor } from 'fast-average-color';

const BackdropColorExtractor = ({ backdropUrl, children, className }) => {
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const imageRef = useRef(null);
  const facRef = useRef(new FastAverageColor());
  const backgroundPosition = (70 * windowWidth) / 100 - 170 - 340; // позиция фонового изображения

  // Отслеживаем ширину окна для динамической адаптации градиента
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    const facInstance = facRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      facInstance.destroy();
    };
  }, []);

  // Расчет позиции изображения в процентах на основе формулы смещения
  const calculateImagePosition = () => {
    // Преобразуем в проценты для градиента (относительно ширины экрана)
    const percentage = (backgroundPosition / windowWidth) * 100;

    // Ограничиваем значение между 20% и 60% для безопасности
    return Math.max(20, Math.min(60, percentage));
  };

  // Функция для создания градиента на основе RGB значений с адаптивными позициями
  const createGradient = (r, g, b) => {
    const solidPosition = calculateImagePosition();
    const fadeStartPosition = solidPosition + 38;
    const midFadePosition = solidPosition + 48;

    return `linear-gradient(
      90deg,
      rgba(${r}, ${g}, ${b}, 1) ${solidPosition}%,
      rgba(${r}, ${g}, ${b}, 0.85) ${fadeStartPosition}%,
      rgba(${r}, ${g}, ${b}, 0.8) ${midFadePosition}%,
      rgba(${r}, ${g}, ${b}, 0.75) 100%
    )`;
  };

  // Создаем градиент по умолчанию
  const defaultGradient = useMemo(() => {
    const defaultColor = { r: 13, g: 21, b: 43 };
    // const defaultColor = { r: 83, g: 82, b: 89 };
    return createGradient(defaultColor.r, defaultColor.g, defaultColor.b);
  }, [windowWidth]);

  // Обработчик загрузки изображения
  const handleImageLoad = () => {
    if (imageRef.current) {
      try {
        // Используем синхронный метод getColor для уже загруженного изображения
        const color = facRef.current.getColor(imageRef.current);
        const [r, g, b] = color.value;

        // Создаем затемненный градиент
        const darkenFactor = 0.3;
        const darkR = Math.floor(r * darkenFactor);
        const darkG = Math.floor(g * darkenFactor);
        const darkB = Math.floor(b * darkenFactor);

        setBackgroundColor(createGradient(darkR, darkG, darkB));
      } catch (e) {
        console.error('Ошибка при получении цвета:', e);
        setBackgroundColor(defaultGradient);
      }
    }
  };

  // Обработчик ошибки загрузки
  const handleImageError = () => {
    console.error('Ошибка загрузки изображения');
    setBackgroundColor(defaultGradient);
  };

  // Стили для позиционирования изображения как background
  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: `translateX(${backgroundPosition}px)`,
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
    zIndex: -2,
  };

  // Контейнер стиль
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem 0',
    margin: 0,
  };

  // Стиль градиента-оверлея
  const overlayStyle = {
    background: backgroundColor || defaultGradient,
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  };

  return (
    <div className={className} style={containerStyle}>
      {backdropUrl && (
        <img
          ref={imageRef}
          src={backdropUrl}
          alt=""
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      )}
      <div className="backdrop-overlay" style={overlayStyle}></div>
      <div className="backdrop-content">{children}</div>
    </div>
  );
};

BackdropColorExtractor.propTypes = {
  backdropUrl: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default BackdropColorExtractor;
