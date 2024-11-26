import { doc, getDoc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

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
  const docRef = doc(db, "users", userId, "bookmarks", docKey);

  try {
    if (isBookmarked) {
      await deleteDoc(docRef);
      setIsBookmarked(false);
      triggerToast(
        `Удалили ${mediaType === "movie" ? "фильм" : "сериал"}`,
        "info-subtle",
        "info-emphasis",
        "top-center"
      );
    } else {
      await setDoc(docRef, { itemId, mediaType, timestamp: Timestamp.now() });
      setIsBookmarked(true);
      triggerToast(
        `Сохранили ${mediaType === "movie" ? "фильм" : "сериал"}`,
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
  itemId,
  mediaType,
  setIsBookmarked,
  triggerToast,
}) => {
  const docKey = `${mediaType}_${itemId}`;
  const docRef = doc(db, "users", userId, "bookmarks", docKey);

  try {
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
