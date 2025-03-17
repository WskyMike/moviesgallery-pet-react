// RouteTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import platform from "platform";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Определение типа устройства
    const userAgent = navigator.userAgent || "Неизвестно";
    const screenWidth = window.screen.width;

    let deviceType = "ПК"; // По умолчанию считаем устройство ПК

    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = "Смартфон";
    } else if (screenWidth >= 768 && screenWidth <= 1024) {
      deviceType = "Планшет";
    }

    // Отправка POST-запроса для логирования при каждом изменении маршрута
    fetch("https://moviegallery.tw1.ru/back/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: window.location.href, // Текущий URL
        referrer: document.referrer || null, // Предыдущий URL
        userAgent,
        screenResolution: window.screen
          ? `${window.screen.width}x${window.screen.height}`
          : "Неизвестно", // Разрешение экрана пользователя
        os: platform.os ? platform.os.toString() : "Неизвестно", // Операционная система пользователя
        deviceType, // Тип устройства
      }),
    })
      .then((response) => response.json())
      //   .then((data) => console.log("✅ Лог с фронтенда отправлен:", data))
      .catch((err) =>
        console.error("❌ Ошибка отправки лога с фронтенда:", err)
      );
  }, [location]);

  return null;
};

export default RouteTracker;
