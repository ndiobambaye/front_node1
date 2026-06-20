import React from 'react'
import Connexion from './app/pages/Connexion'
import Inscription from './app/pages/Inscription'
import UserLayout from './app/layout/UserLayout'
import Accueil from './app/pages/Accueil'
import PoserQuestion from './app/pages/PoserQuestion'
import ProfilUtilisateur from './app/pages/ProfilUtilisateur'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const App = () => {

  const router = createBrowserRouter([

    // route de la connexion
    { path: '/', element: <Connexion/> },
    // route de l'inscription
    { path: '/inscription', element: <Inscription /> },
    // route de l'accueil
    {
      path: '/accueil',
      element: <UserLayout />,
      children: [
        { path: '/accueil', element: <Accueil /> },
        { path: '/accueil/poser', element: <PoserQuestion /> },
        { path: '/accueil/profil/:id', element: <ProfilUtilisateur /> },
        // { path: '/accueil/question/:id', element: <DetailQuestion /> },
        // { path: '/accueil/tags', element: <Tags /> },
        // { path: '/accueil/utilisateurs', element: <Utilisateurs /> },
      ]
    }

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
