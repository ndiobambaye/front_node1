import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProfilUtilisateur = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profil, setProfil] = useState(null)
  const [questions, setQuestions] = useState([])
  const [reponses, setReponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState('questions')

  const userConnecte = JSON.parse(localStorage.getItem('user') || 'null')
  const estMonProfil = userConnecte && (userConnecte.id === id || userConnecte._id === id)
 


  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/utilisateurs/${id}`)
        const result = await response.json()
        if (response.ok) {
          setProfil(result.user)
          setQuestions(result.questions || [])
          setReponses(result.reponses || [])
        } else {
          toast.error(result.message || 'Utilisateur introuvable')
        }
      } catch (error) {
        toast.error('Serveur inaccessible.')
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [id])

  const initiales = (prenom, nom) =>
    `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Chargement du profil...
      </div>
    )
  }

  if (!profil) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Utilisateur introuvable.
      </div>
    )
  }

  // Resume des contributions (US014)
  const totalVotesQuestions = questions.reduce((s, q) => s + (q.votes || 0), 0)
  const totalVotesReponses  = reponses.reduce((s, r) => s + (r.votes || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-800 mb-4">
        ← Retour
      </button>

      {/* En-tete profil */}
      <div className="flex gap-5 items-start mb-6 flex-wrap">
        <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {initiales(profil.prenom, profil.nom)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-xl font-bold text-gray-900 m-0">
            {profil.prenom} {profil.nom}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{profil.email}</p>
          {profil.bio && <p className="text-sm text-gray-700 mt-2">{profil.bio}</p>}

          {/* Stats resume (US014) */}
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{profil.reputation || 0}</div>
              <div className="text-xs text-gray-500">Reputation</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{questions.length}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{reponses.length}</div>
              <div className="text-xs text-gray-500">Reponses</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{totalVotesQuestions + totalVotesReponses}</div>
              <div className="text-xs text-gray-500">Votes recus</div>
            </div>
          </div>
        </div>

        {estMonProfil && (
          <button
            onClick={() => navigate('/accueil/profil/modifier')}
            className="text-sm border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            Modifier le profil
          </button>
        )}
      </div>

      {/* Onglets */}
      <div className="flex gap-0 border-b border-gray-200 mb-4">
        <button
          onClick={() => setOnglet('questions')}
          className={`text-sm px-4 py-2 border-b-2 -mb-px transition-colors ${
            onglet === 'questions' ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500'
          }`}
        >
          Questions ({questions.length})
        </button>
        <button
          onClick={() => setOnglet('reponses')}
          className={`text-sm px-4 py-2 border-b-2 -mb-px transition-colors ${
            onglet === 'reponses' ? 'border-primary-500 text-primary-600 font-medium' : 'border-transparent text-gray-500'
          }`}
        >
          Reponses ({reponses.length})
        </button>
      </div>

      {/* Contenu onglet */}
      {onglet === 'questions' && (
        questions.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune question posee.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {questions.map(q => (
              <Link
                key={q._id}
                to={`/accueil/question/${q._id}`}
                className="flex gap-3 border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors"
              >
                <div className="text-sm text-gray-700 min-w-[50px] text-right">
                  <strong>{q.votes || 0}</strong> votes
                </div>
                <div className="flex-1">
                  <div className="text-sm text-primary-600">{q.titre}</div>
                  <div className="flex gap-1.5 mt-1.5">
                    {(q.tags || []).map(t => (
                      <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-accent-50 text-accent-600 border border-accent-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {onglet === 'reponses' && (
        reponses.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune reponse postee.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reponses.map(r => (
              <Link
                key={r._id}
                to={`/accueil/question/${r.question?._id}`}
                className="flex gap-3 border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors"
              >
                <div className="text-sm text-gray-700 min-w-[50px] text-right">
                  <strong>{r.votes || 0}</strong> votes
                </div>
                <div className="flex-1">
                  <div className="text-sm text-primary-600">{r.question?.titre || 'Question supprimee'}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    {(r.contenu || '').slice(0, 120)}{r.contenu?.length > 120 ? '...' : ''}
                  </p>
                  {r.meilleure && (
                    <span className="inline-block text-xs text-emerald-700 font-semibold mt-1">✓ Meilleure reponse</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default ProfilUtilisateur
