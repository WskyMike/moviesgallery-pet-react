/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchTrigger, setSearchTrigger] = useState(false);

  const triggerSearch = () => setSearchTrigger((prev) => !prev);

  return (
    <SearchContext.Provider value={{ searchTrigger, triggerSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
