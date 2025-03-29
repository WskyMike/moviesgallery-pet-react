import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import process from 'process';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import ipRangeCheck from 'ip-range-check';

dotenv.config();
const router = express.Router();

// Задаём путь к файлу логов (создадим папку logs, если её нет)
const logsDir = path.join(process.cwd(), 'logs');
const logFilePath = path.join(logsDir, 'tracker.log');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware для проверки секретного query-параметра
const checkSecret = (req, res, next) => {
  const secret = process.env.STATS_SECRET;
  if (req.query.secret !== secret) {
    return res.status(403).send('🔒 Доступ запрещен');
  }
  next();
};

/**
 * Эндпоинт для логирования с добавлением геоданных.
 */
router.post('/log', async (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const clientIp = rawIp ? rawIp.split(',')[0].replace(/^::ffff:/, '') : 'n/a';
  // const ipList = rawIp ? rawIp.split(',').map(ip => ip.trim().replace(/^::ffff:/, '')) : ["n/a"]; // Все IP в виде массива
  // const ipString = ipList.join(" → "); // Выводим все IP через разделитель стрелка
  // console.log(`🔗 IP-адреса: ${ipString}`);

  // Если IP входит в диапазон 46.32.64.0/19, пропускаем логирование
  if (ipRangeCheck(clientIp, '46.32.64.0/19')) {
    console.log(
      `❎ IP ${clientIp} входит в диапазон 46.32.64.0/19 – логирование пропущено.`
    );
    return res.json({ status: 'ok', skipped: true });
  }

  let geoData = {};

  try {
    // Запрос геоданных с ip-api.com
    const response = await axios.get(
      `http://ip-api.com/json/${clientIp}?fields=continent,country,city,regionName,isp,org,mobile&lang=ru`
    );
    geoData = response.data;
  } catch (error) {
    console.error('❌ Ошибка получения геоданных:', error.message);
  }

  // Формируем единый лог с базовой информацией и геоданными
  const logEntry = {
    timestamp: moment().tz('Europe/Moscow').format('DD.MM.2025 HH:mm:ss'), // Временная метка в московской зоне
    ip: clientIp, // IP-адрес клиента, который сделал запрос
    url: req.body.url || '', // Текущий URL, полученный с фронтенда
    referrer: req.body.referrer || '', // Предыдущий URL, полученный с фронтенда
    userAgent: req.get('User-Agent') || 'n/a', // Информация о браузере и операционной системе клиента
    continent: geoData.continent || 'n/a', // Континент, определенный по IP-адресу клиента (если доступно)
    country: geoData.country || 'n/a', // Страна, определенная по IP-адресу клиента (если доступно)
    city: geoData.city || 'n/a', // Город, определенный по IP-адресу клиента (если доступно)
    regionName: geoData.regionName || 'n/a', // Регион, определенный по IP-адресу клиента (если доступно)
    isp: geoData.isp || 'n/a', // Интернет-провайдер клиента (если доступно)
    org: geoData.org || 'n/a', // Организация, которой принадлежит IP-адрес (если доступно)
    device: req.body.device || 'n/a', // Устройство пользователя (ПК, смартфон, планшет)
    browser: req.body.browser || 'n/a', //
    screen: req.body.screenResolution || 'n/a', // Разрешение экрана пользователя
    os: req.body.os || 'n/a', // Операционная система пользователя
  };

  // Записываем лог в файл (каждая запись в формате JSON и перевод строки)
  fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) {
      console.error('❌ Ошибка записи лога:', err);
    } else {
      console.log('✅ Лог посещения записан.');
    }
  });

  res.json({ status: 'ok' });
});

/**
 * Эндпоинт для очистки логов
 */
router.post('/clear', checkSecret, (req, res) => {
  fs.writeFile(logFilePath, '', (err) => {
    if (err) {
      console.error('❌ Ошибка очистки логов:', err);
      return res
        .status(500)
        .json({ status: 'error', message: 'Ошибка очистки логов' });
    }
    console.log('✅ Логи посещения очищены.');
    res.json({ status: 'ok' });
  });
});

/**
 * Пример тестового маршрута
 */
router.get('/test', (req, res) => {
  res.send('Это тестовый маршрут');
});

/**
 * Эндпоинт для отображения статистики в виде HTML-страницы.
 */
router.get('/stats', checkSecret, (req, res) => {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Ошибка чтения файла логов:', err);
      return res.send('Ошибка чтения логов');
    }

    // Разбиваем данные по строкам, фильтруем пустые строки
    const lines = data.split('\n').filter((line) => line.trim() !== '');
    // Парсим каждую строку как JSON
    let fileLogs = lines
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter((entry) => entry !== null);

    // Выводим последние записи первыми
    fileLogs = fileLogs.reverse();

    let html = `
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <title>Статистика посещений</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 0.8rem; margin: 20px;}
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 20px;
            }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
            th { background-color: #f4f4f4; }
            a { text-decoration: none; color: blue; }
            .url-cell {
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .url-title {
              max-width: 150px;
              overflow: hidden;
            }
            .ip-address {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .font-small {
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">Статистика посещений</h1>
            <button id="clearBtn" style="padding: 8px 16px; font-size: 0.8rem; cursor: pointer; background-color: bisque; border: none; border-radius: 5px;">Очистить статистику</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Время</th>
                <th>IP & Geo</th>
                <th class="url-title">Предыдущий URL</th>
                <th class="url-title">Текущий URL</th>
                <th>User Agent</th>
                <th>Browser</th>
                <th>Устройство (Разрешение)</th>
                <th>ОС</th>
              </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < fileLogs.length; i++) {
      const log = fileLogs[i];
      const [date, time] = log.timestamp.split(' ');
      html += `
        <tr>
          <td>${fileLogs.length - i}</td>
          <td>${date} <strong>${time}</strong></td>
          <td>
            <div class="ip-address">${log.ip}</div>
            <div class="font-small">${log.continent || ''} ${log.country || ''} ${log.regionName || ''} ${log.city || ''} ${log.isp || ''}</div>
          </td>
          <td class="url-cell">
            <a href="${log.referrer}" target="_blank" title="${log.referrer}">${log.referrer}</a>
          </td>
          <td class="url-cell">
            <a href="${log.url}" target="_blank" title="${log.url}">${log.url}</a>
          </td>
          <td class="font-small">${log.userAgent}</td>
          <td>${log.browser}</td>
          <td>${log.device} (${log.screen})</td>
          <td>${log.os}</td>
        </tr>
    `;
    }

    html += `
            </tbody>
          </table>
          <script>
            const secret = "${process.env.STATS_SECRET}";
            document.getElementById('clearBtn').addEventListener('click', function() {
              if (confirm('Вы действительно хотите очистить статистику?')) {
                fetch('/back/clear?secret=' + secret, { method: 'POST' })
                  .then(response => response.json())
                  .then(data => {
                    if (data.status === 'ok') {
                      window.location.reload();
                    } else {
                      alert('Ошибка очистки статистики');
                    }
                  })
                  .catch(err => {
                    alert('Ошибка: ' + err.message);
                  });
              }
            });
          </script>
        </body>
      </html>
    `;

    res.send(html);
  });
});

// Запуск серверa
export default router;
