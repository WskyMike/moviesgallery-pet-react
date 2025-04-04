/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { lazy, Suspense } from 'react';
const LazyAuthModal = lazy(() => import('./AuthModal'));

// Компонент-обертка для ленивой загрузки AuthModal
// Используется Suspense для отображения индикатора загрузки
// пока AuthModal загружается
// isOpen - состояние модального окна
// onLoaded - функция, вызываемая после загрузки AuthModal
function AuthModalLoader({ isOpen, onLoaded, ...props }) {
  // Функция для получения экземпляра аутентификации
  const getAuth = async () => {
    const { getAuthInstance } = await import('../../utils/firebase');
    return await getAuthInstance(); // возвращаем результат!
  };

  return (
    <Suspense
      fallback={
        <span className="visually-hidden">Ожидайте, идёт загрузка...</span>
      }>
      <LazyAuthModal {...props} onLoad={onLoaded} getAuth={getAuth} />
    </Suspense>
  );
}

export default AuthModalLoader;
