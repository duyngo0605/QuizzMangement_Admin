import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Login from "../pages/Login";
import ProtectedRoute from "../components/Protectedroute"

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <ProtectedRoute><Header /></ProtectedRoute>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
