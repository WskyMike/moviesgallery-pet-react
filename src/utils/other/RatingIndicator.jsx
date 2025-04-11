/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const RatingIndicator = ({ rating, size = 80 }) => {
  // Переводим рейтинг в проценты
  const percentage =
    rating > 1 && rating <= 10 ? Math.round(rating * 10) : rating;

  // Расчеты отображения
  const padding = size * 0.1; // Добавляем отступ, чтобы избежать обрезк
  const svgSize = size + padding * 2; // Увеличиваем размер SVG
  const radius = size / 2; // Радиус круга
  const strokeWidth = size / 10; // Толщина обода
  const innerRadius = radius - strokeWidth / 2; // Внутренний радиус (для расчета окружности)
  const circumference = 2 * Math.PI * innerRadius; // Длина окружности
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Расчет длины дуги, которая будет отображать прогресс
  const center = svgSize / 2; // Центр SVG с учетом отступа

  // Расчет цвета в зависимости от рейтинга
  const getColor = () => {
    if (percentage >= 70) return '#20c997';
    if (percentage >= 50) return '#ffc107';
    if (percentage >= 30) return '#fd7e14';
    return '#dc3545';
  };

  // Получаем цвет для незаполненной части
  const getDimColor = () => {
    const color = getColor();
    return color + '40'; // Регулировка прозрачности
  };

  const [offset, setOffset] = useState(circumference);

  // Анимация заполнения
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(strokeDashoffset);
    }, 100);

    return () => clearTimeout(timer);
  }, [strokeDashoffset]);

  return (
    <div className="position-relative d-inline-flex justify-content-center align-items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{ transform: 'rotate(-90deg)' }}>
        {/* Круглый фон */}
        <circle cx={center} cy={center} r={radius * 1.05} fill="#081c22" />

        {/* Незаполненная часть (приглушенный цвет) */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="transparent"
          stroke={getDimColor()}
          strokeWidth={strokeWidth}
        />

        {/* Заполненная часть (яркий цвет) */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Текст процента в центре */}
      <div
        className="position-absolute text-white fw-bold d-flex align-items-center justify-content-center"
        style={{
          width: '100%',
          height: '100%',
          fontSize: `${size / 3}px`,
        }}>
        <span
          className="d-flex align-items-center"
          style={{ fontFamily: 'Stem', fontWeight: '500' }}>
          {percentage}
          <span
            style={{
              fontSize: `${size / 7}px`,
              marginTop: '-1em',
            }}>
            %
          </span>
        </span>
      </div>
    </div>
  );
};

export default RatingIndicator;
