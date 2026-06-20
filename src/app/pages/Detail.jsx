import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Detail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [reponses, setReponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [nouvelleReponse, setNouvelleReponse] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${id}`)
        const result = await response.json()
        if (response.ok) {
          setQuestion(result.question)
          setReponses(result.reponses || [])
        } else {
          toast.error(result.message || 'Question introuvable')
        }
      } catch (error) {
        toast.error('Serveur inaccessible.')
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [id])

  const envoyerReponse = async (e) => {
    e.preventDefault()
    if (!nouvelleReponse.trim()) {
      toast.error('La reponse ne peut pas etre vide')
      return
    }
    if (!token) {
      toast.error('Vous devez etre connecte pour repondre')
      navigate('/')
      return
    }

    setEnvoi(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/${id}/reponses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu: nouvelleReponse }),
      })
      const result = await response.json()
      if (response.ok) {
        toast.success('Reponse publiee !')
        setReponses([...reponses, result.reponse])
        setNouvelleReponse('')
      } else {
        toast.error(result.message || 'Erreur lors de la publication')
      }
    } catch (error) {
      toast.error('Serveur inaccessible.')
    } finally {
      setEnvoi(false)
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-8">Chargement...</div>
  if (!question) return <div className="max-w-3xl mx-auto px-4 py-8">Question introuvable.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/accueil')}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-normal text-gray-900 mb-2">{question.titre}</h1>

      <div className="text-sm text-gray-500 mb-4">
        Pose par {question.auteur?.prenom} {question.auteur?.nom} ·{' '}
        {new Date(question.createdAt).toLocaleDateString('fr-FR')}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {question.tags?.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-sky-50 text-sky-800 border border-sky-100">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-800 whitespace-pre-wrap mb-8 leading-relaxed">
        {question.contenu}
      </p>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {reponses.length} reponse{reponses.length !== 1 ? 's' : ''}
      </h2>

      <div className="flex flex-col gap-4 mb-8">
        {reponses.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune reponse pour le moment. Soyez le premier a repondre !</p>
        ) : (
          reponses.map(rep => (
            <div key={rep._id} className="border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap mb-2">{rep.contenu}</p>
              <div className="text-xs text-gray-500">
                {rep.auteur?.prenom} {rep.auteur?.nom} ·{' '}
                {new Date(rep.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))
        )}
      </div>

      {token ? (
        <form onSubmit={envoyerReponse} className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900">Votre reponse</label>
          <textarea
            value={nouvelleReponse}
            onChange={(e) => setNouvelleReponse(e.target.value)}
            placeholder="Ecrivez votre reponse ici..."
            className="w-full min-h-[120px] border border-gray-300 rounded p-3 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={envoi}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded transition-colors self-start"
          >
            {envoi ? 'Publication...' : 'Publier la reponse'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">
          <Link to="/" className="text-blue-500 hover:underline">Connectez-vous</Link> pour repondre.
        </p>
      )}
    </div>
  )
}

export default Detail