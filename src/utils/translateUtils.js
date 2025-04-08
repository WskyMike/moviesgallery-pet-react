const translationCache = new Map();

const PRIMARY_MODEL = 'google/gemini-2.0-flash-001'; // Основная модель
const FALLBACK_MODEL = 'deepseek/deepseek-chat'; // Резервная модель

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function translateText(
  text,
  sourceLang = 'en',
  targetLang = 'ru'
) {
  if (!text || text.trim() === '') return '';

  // Создаем ключ для кэша и проверяем его
  const cacheKey = `${text}:${sourceLang}:${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // Промпт для чистого перевода
  const PROMPT = `
    Переведи следующий текст на русский. Адаптируй как описание (overview) к фильму. Верни только перевод, без дополнительных пояснений и комментариев:
    "${text}"
  `;

  async function fetchTranslation(modelName) {
    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: 'user', content: PROMPT }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка OpenRouter API: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      }

      console.error('❌ Ошибка: Пустой ответ от модели.');
      return null;
    } catch (error) {
      console.error(`❌ Ошибка при использовании модели ${modelName}:`, error);
      return null;
    }
  }
  // Получаем перевод с основной модели
  let translatedText = await Promise.race([
    fetchTranslation(PRIMARY_MODEL),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 10000)
    ),
  ]);

  // Если неудачно, пробуем резервную модель
  if (!translatedText) {
    translatedText = await Promise.race([
      fetchTranslation(FALLBACK_MODEL),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000)
      ),
    ]);
  }

  // Если перевод удался, сохраняем в кэш
  if (translatedText) {
    translationCache.set(cacheKey, translatedText);
    return translatedText;
  }

  // Возвращаем оригинальный текст, если перевод не удался
  return text;
}
