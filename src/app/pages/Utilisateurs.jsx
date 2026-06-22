import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/utilisateurs`)
        const result = await response.json()
        if (response.ok) {
          setUtilisateurs(result.utilisateurs || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-2">Utilisateurs</h1>
      <p className="text-sm text-gray-500 mb-6">
        {utilisateurs.length} utilisateur{utilisateurs.length !== 1 ? 's' : ''} inscrit{utilisateurs.length !== 1 ? 's' : ''}
      </p>

      {utilisateurs.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun utilisateur pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {utilisateurs.map(u => (
            <Link
              key={u._id}
              to={`/accueil/profil/${u._id}`}
              className="border border-gray-200 rounded p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded bg-yellow-400 text-gray-900 text-sm font-bold flex items-center justify-center mb-2">
                {u.prenom?.[0]}{u.nom?.[0]}
              </div>
              <p className="text-sm font-semibold text-gray-900">{u.prenom} {u.nom}</p>
              <p className="text-xs text-gray-500">{u.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Utilisateurs