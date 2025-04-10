// RouteTracker.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UAParser } from 'ua-parser-js';

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const userAgent = navigator.userAgent || null;

    // Ручной рассчет типа устройства
    const screenWidth = window.screen.width;

    let manualDeviceType = 'ПК';

    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      manualDeviceType = 'Смартфон';
    } else if (screenWidth >= 768 && screenWidth <= 1024) {
      manualDeviceType = 'Планшет';
    }

    // Определение типа устройства
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Получаем данные браузера
    const browser = result.browser;
    const browserInfo = browser.name
      ? `${browser.name} ${browser.major || ''}${
          browser.type ? ` (${browser.type})` : ''
        }`.trim()
      : browser.type
        ? `Неизвестный браузер (${browser.type})`
        : '';

    // Получаем данные устройства
    const device = result.device; // { vendor, model, type }
    let deviceInfo = 'Неизвестно';
    if (device && (device.vendor || device.model || device.type)) {
      deviceInfo = `${device.vendor || ''} ${device.model || ''} ${
        device.type || ''
      }`.trim();
    }

    // Получаем данные операционной системы
    const os = result.os;
    const osInfo = os.name
      ? `${os.name} ${os.version || ''}`.trim()
      : 'Неизвестно';

    // Формируем данные для отправки
    const postData = {
      url: window.location.href,
      referrer: document.referrer || null,
      userAgent,
      screenResolution: window.screen
        ? `${window.screen.width}x${window.screen.height}`
        : 'Неизвестно',
      browser: browserInfo,
      device: deviceInfo !== 'Неизвестно' ? deviceInfo : manualDeviceType,
      os: osInfo,
    };

    // Отправка POST-запроса для логирования при каждом изменении маршрута
    fetch('https://moviegallery.tw1.ru/back/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      // .then((data) => console.log("✅ Лог с фронтенда отправлен:", data))
      .catch((err) =>
        console.error('❌ Ошибка отправки лога с фронтенда:', err)
      );
  }, [location]);

  return null;
};

export default RouteTracker;
