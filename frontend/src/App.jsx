import React from 'react'
import Home from './pages/shared/Home';
import AuthPage from './pages/shared/AuthPage';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/signup",
    element: <AuthPage />
  },
  {
    path: "/login",
    element: <AuthPage />
  }
])

const App = () => {
  return (
    <div className="min-h-screen w-full">
      <RouterProvider router={router} />
    </div>
  )
}

export default App