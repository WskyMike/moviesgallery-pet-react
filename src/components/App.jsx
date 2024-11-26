// import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NaviBar from "./NaviBar/Navibar";
import MovieDetails from "./MovieDetails/MovieDetails";
import TvDetails from "./TvDetails/TvDetails";
import MovieList from "./MovieList/MovieList";
import MainPage from "./MainPage/MainPage";
import Footer from "./Footer/Footer";
import Bookmarks from "./Bookmarks/Bookmarks";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

import { LoadingProvider } from "../contexts/LoadingContext";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LoadingProvider>
          <div className="app-container">
            <NaviBar />
            <div className="content">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/tv/:id" element={<TvDetails />} />
                <Route path="/list/:category" element={<MovieList />} />
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
            </div>
            <Footer />
          </div>
        </LoadingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
