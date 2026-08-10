import React from 'react'
import Home from './pages/shared/Home';
import AuthPage from './pages/shared/AuthPage';
import VerifyEmail from './pages/shared/VerifyEmail';
import About from './pages/shared/About';
import Contact from './pages/shared/Contact';
import Article from './pages/shared/Article';
import Gallery from './pages/shared/Gallery';
import Posts from './pages/shared/Posts';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/posts",
    element: <Posts />
  },
  {
    path: "/article",
    element: <Article />
  },
  {
    path: "/gallery",
    element: <Gallery />
  },
  {
    path: "/signup",
    element: <AuthPage />
  },
  {
    path: "/login",
    element: <AuthPage />
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />
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