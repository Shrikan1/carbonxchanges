import React from 'react'
import Home from './pages/shared/Home';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/shared/Login.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  }

])

const App = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <RouterProvider router={router} />
      
    </div>
  )
}

export default App