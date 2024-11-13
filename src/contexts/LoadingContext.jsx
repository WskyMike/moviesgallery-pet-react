/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

// Обновляем состояние в MovieDetails !!!
export const LoadingProvider = ({ children }) => {
  const [movieDetailsLoading, setMovieDetailsLoading] = useState(true);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [mainPageLoading, setMainPageLoading] = useState(true);

  return (
    <LoadingContext.Provider
      value={{
        movieDetailsLoading,
        setMovieDetailsLoading,
        bookmarksLoading,
        setBookmarksLoading,
        mainPageLoading,
        setMainPageLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
