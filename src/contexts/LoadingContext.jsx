/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

// Обновляем состояние в MovieDetails !!!
export const LoadingProvider = ({ children }) => {
  const [movieDetailsLoading, setMovieDetailsLoading] = useState(false);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ movieDetailsLoading, setMovieDetailsLoading, bookmarksLoading, setBookmarksLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};