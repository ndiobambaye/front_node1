import React from 'react'
import Connexion from './app/pages/Connexion'
import Inscription from './app/pages/Inscription'
import UserLayout from './app/layout/UserLayout'
import Accueil from './app/pages/Accueil'
import PoserQuestion from './app/pages/PoserQuestion'
import ProfilUtilisateur from './app/pages/ProfilUtilisateur'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Detail from './app/pages/Detail'
import ModifierProfil from './app/pages/ModifierProfil'


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
        { path: '/accueil/profil/modifier', element: <ModifierProfil /> },
        { path: '/accueil/profil/:id', element: <ProfilUtilisateur /> },
        { path: '/accueil/question/:id', element: <Detail /> },
        { path: '/accueil/tags', element: <Tags /> },
        ]
    }

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
