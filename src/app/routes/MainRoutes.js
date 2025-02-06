import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import Login from "../pages/Login";
import ProtectedRoute from "../components/Protectedroute";
import User from "../pages/User";
import Topic from "../pages/Topic";
import TopicDetail from '../pages/Topic/partials/TopicDetail/TopicDetail';
import Rankings from "../pages/Rankings";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <ProtectedRoute><Header /></ProtectedRoute>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/topic" element={<ProtectedRoute><Topic /></ProtectedRoute>} />
        <Route path="/topic/:id" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><Rankings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
