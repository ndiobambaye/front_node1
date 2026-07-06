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
      <h1 className="font-heading text-2xl font-semibold text-ink-900 mb-2">Utilisateurs</h1>
      <p className="text-sm text-ink-400 mb-6">
        {utilisateurs.length} utilisateur{utilisateurs.length !== 1 ? 's' : ''} inscrit{utilisateurs.length !== 1 ? 's' : ''}
      </p>

      {utilisateurs.length === 0 ? (
        <p className="text-sm text-ink-400">Aucun utilisateur pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {utilisateurs.map(u => (
            <Link
              key={u._id}
              to={`/accueil/profil/${u._id}`}
              className="bg-white border border-ink-200 rounded-xl shadow-card p-4 hover:shadow-card-hover hover:border-mauve-200 transition-all flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-mauve-700 text-paper text-sm font-bold flex items-center justify-center mb-2">
                {u.prenom?.[0]}{u.nom?.[0]}
              </div>
              <p className="text-sm font-semibold text-ink-900">{u.prenom} {u.nom}</p>
              <p className="text-xs text-ink-400">{u.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Utilisateurs