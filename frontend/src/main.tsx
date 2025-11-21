import { createRoot } from 'react-dom/client'
import './index.css'

import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import store from './app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from './layout/MainLayout'
import { AuthProvider, UploadProvider } from './contexts'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/client';
import {
  ForgotPassword, ResetPassword, VerifySignup, VerifyLogin, LandingPage, Contact,
  About, PrivacyPolicy, TermsOfService, PhotoEditorPage, HistoryPage, Login, Profile, Test, GoogleCallback,
}
  from './pages';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: '/try',
        element: <PhotoEditorPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/terms',
        element: <TermsOfService />,
      }
    ],
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/callback',
    element: <GoogleCallback />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/verify-signup',
    element: <VerifySignup />,
  },
  {
    path: '/verify-login',
    element: <VerifyLogin />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>

      <UploadProvider>
        <RouterProvider router={router} />
      </UploadProvider>

      <Toaster position="top-center" />
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)