import { doc, getDoc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const toggleBookmark = async ({
  userId,
  movieId,
  isBookmarked,
  setIsBookmarked,
  triggerToast,
  preventPropagation = false,
  event = null,
}) => {
  if (preventPropagation && event) event.stopPropagation();

  const docRef = doc(db, "users", userId, "bookmarks", String(movieId));

  try {
    if (isBookmarked) {
      await deleteDoc(docRef);
      setIsBookmarked(false);
      triggerToast(
        "Удалили фильм",
        "info-subtle",
        "info-emphasis",
        "top-center"
      );
    } else {
      await setDoc(docRef, { movieId, timestamp: Timestamp.now() });
      setIsBookmarked(true);
      triggerToast(
        "Сохранили фильм",
        "info-subtle",
        "info-emphasis",
        "top-center"
      );
    }
  } catch (error) {
    console.error("Error updating bookmark:", error);
    triggerToast(
      `Ошибка добавления или удаления фильма (${error.message})`,
      "danger-subtle",
      "black",
      "top-center"
    );
  }
};

// Универсальная функция для проверки наличия фильма в закладках
export const checkBookmarkStatus = async ({
  userId,
  movieId,
  setIsBookmarked,
  triggerToast,
}) => {
  try {
    const docRef = doc(db, "users", userId, "bookmarks", String(movieId));
    const docSnap = await getDoc(docRef);
    setIsBookmarked(docSnap.exists());
  } catch (error) {
    console.error("Error fetching bookmark status:", error);
    triggerToast(
      `Ошибка проверки статуса закладки(${error.message})`,
      "danger-subtle",
      "danger-emphasis",
      "top-center"
    );
  }
};
