import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ModifierProfil = () => {
  const navigate = useNavigate()
  const userActuel = JSON.parse(localStorage.getItem('user') || '{}')

  const [prenom, setPrenom] = useState(userActuel.prenom || '')
  const [nom, setNom] = useState(userActuel.nom || '')
  const [email, setEmail] = useState(userActuel.email || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Vous devez etre connecte')
      navigate('/')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prenom, nom, email }),
      })
      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(result.user))
        toast.success('Profil mis a jour avec succes')
        navigate(`/accueil/profil/${result.user._id}`)
      } else {
        toast.error(result.message || 'Erreur lors de la mise a jour')
      }
    } catch (error) {
      toast.error('Serveur inaccessible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-normal text-gray-900 mb-6">Modifier le profil</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Prenom</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-mauve-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-mauve-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-mauve-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-mauve-700 hover:bg-mauve-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors mt-2"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}

export default ModifierProfil