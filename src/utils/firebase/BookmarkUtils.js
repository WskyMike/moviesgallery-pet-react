export const toggleBookmark = async ({
  userId,
  itemId,
  mediaType,
  isBookmarked,
  setIsBookmarked,
  triggerToast,
  preventPropagation = false,
  event = null,
}) => {
  if (preventPropagation && event) event.stopPropagation();

  const docKey = `${mediaType}_${itemId}`;

  try {
    const { getFirestoreInstance } = await import('./firebase'); // динамический импорт экземпляра Firestore
    const db = await getFirestoreInstance();
    // Динамический импорт Firestore функций
    const { doc, setDoc, deleteDoc, Timestamp } = await import(
      'firebase/firestore'
    );
    const docRef = doc(db, 'users', userId, 'bookmarks', docKey);

    if (isBookmarked) {
      await deleteDoc(docRef);
      setIsBookmarked(false);
      triggerToast(`Удалили ${mediaType === 'movie' ? 'фильм' : 'сериал'}`);
    } else {
      await setDoc(docRef, { itemId, mediaType, timestamp: Timestamp.now() });
      setIsBookmarked(true);
      triggerToast(`Сохранили ${mediaType === 'movie' ? 'фильм' : 'сериал'}`);
    }
  } catch (error) {
    console.error('Error updating bookmark:', error);
    triggerToast(
      `Ошибка добавления или удаления фильма (${error.message})`,
      'danger-subtle',
      'black',
      'top-center'
    );
  }
};

export const checkBookmarkStatus = async ({
  userId,
  itemId,
  mediaType,
  setIsBookmarked,
  triggerToast,
}) => {
  const docKey = `${mediaType}_${itemId}`;

  try {
    const { getFirestoreInstance } = await import('./firebase'); // динамический импорт экземпляра Firestore
    const db = await getFirestoreInstance();
    // Динамически импортируем функции Firestore
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'users', userId, 'bookmarks', docKey);

    const docSnap = await getDoc(docRef);
    setIsBookmarked(docSnap.exists());
  } catch (error) {
    console.error('Error fetching bookmark status:', error);
    triggerToast(
      `Ошибка проверки статуса закладки (${error.message})`,
      'danger-subtle',
      'danger-emphasis',
      'top-center'
    );
  }
};
