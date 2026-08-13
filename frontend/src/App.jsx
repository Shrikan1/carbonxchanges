
import { useEffect, useState } from 'react';


import { createBrowserRouter, RouterProvider, } from 'react-router-dom';

import Home from './pages/shared/Home';
import AuthPage from './pages/auth/AuthPage';
import VerifyEmail from './pages/auth/VerifyEmail';
import About from './pages/shared/About';
import Contact from './pages/shared/Contact';
import Article from './pages/shared/Article';
import Gallery from './pages/shared/Gallery';
import Posts from './pages/shared/Posts';


import { useAuthStore } from './store/useAuthStore';
import * as authApi from './api/endpoint/Authapi';
import BecomeMemberModal from './components/Becomemembermodal';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },

  {
    path: '/about',
    element: <About />,
  },

  {
    path: '/contact',
    element: <Contact />,
  },

  {
    path: '/posts',
    element: <Posts />,
  },

  {
    path: '/article',
    element: <Article />,
  },

  {
    path: '/gallery',
    element: <Gallery />,
  },

  {
    path: '/signup',
    element: <AuthPage />,
  },

  {
    path: '/login',
    element: <AuthPage />,
  },

  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },





  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          404 — Page Not Found
        </h1>
      </div>
    ),
  },
]);


function App() {

  const { setSession, finishInitializing, isInitializing, } = useAuthStore();



  useEffect(() => {

    async function restoreSession() {

      try {

        const { data } = await authApi.refreshToken();

        const { data: profileData } =
          await authApi.getProfile();

        setSession(
          profileData.user,
          data.token
        );

      } catch {

        finishInitializing();

      }

    }

    restoreSession();

  }, [setSession, finishInitializing]);





     if (isInitializing) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c]">
        <span
          className="logo-retro block whitespace-nowrap select-none text-2xl animate-pulse"
          style={{
            WebkitTextFillColor: 'transparent',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            letterSpacing: '0.05em',
          }}
        >
          CarbonXplanet
        </span>

      </div>
    );

  }



  


  return (
    <div className="min-h-screen w-full">

      <RouterProvider router={router} />
       <BecomeMemberModal />
    </div>
  );
}


export default App;