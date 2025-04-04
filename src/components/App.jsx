// import { useState } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';
import NaviBar from './NaviBar/Navibar';
import MediaDetailsPage from './MediaDetailsPage/MediaDetailsPage';
import MovieList from './MovieList/MovieList';
import MainPage from './MainPage/MainPage';
import Footer from './Footer/Footer';
import PrivateRoute from './PrivateRoute/PrivateRoute';
const Bookmarks = lazy(() => import('./Bookmarks/Bookmarks'));
const Seasons = lazy(() => import('./Seasons/Seasons'));
const SearchResults = lazy(() => import('./SearchResults/SearchResults'));

import { LoadingProvider } from '../contexts/LoadingContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastProvider';
import { SearchProvider } from '../contexts/SearchContext';

import RouteTracker from '../utils/RouteTracker';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LoadingProvider>
          <SearchProvider>
            <div className="app-container">
              <NaviBar />
              <RouteTracker />
              <div className="content">
                <Suspense
                  fallback={
                    <div
                      className="spinner-border text-primary m-5"
                      role="status">
                      <span className="visually-hidden">Загрузка...</span>
                    </div>
                  }>
                  <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route
                      path="/movie/:id"
                      element={<MediaDetailsPage type="movie" />}
                    />
                    <Route
                      path="/tv/:id"
                      element={<MediaDetailsPage type="tv" />}
                    />
                    <Route path="/tv/:id/seasons" element={<Seasons />} />
                    <Route path="/list/:category" element={<MovieList />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route
                      path="/my"
                      element={
                        <PrivateRoute>
                          <Bookmarks />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </SearchProvider>
        </LoadingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
