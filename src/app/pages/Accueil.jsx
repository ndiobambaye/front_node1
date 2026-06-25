import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function formatDate(iso) {
  const d = new Date(iso)
  const maintenant = new Date()
  const diffH = (maintenant - d) / 3600000
  if (diffH < 24) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

const Accueil = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tri, setTri] = useState('recent')
  const [tagActif, setTagActif] = useState(searchParams.get('tag') || null)
  const [recherche, setRecherche] = useState(searchParams.get('search') || '')

  const token = localStorage.getItem('token')

  useEffect(() => {
    const charger = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions`)
        const result = await response.json()
        if (response.ok) {
          setQuestions(result.questions || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [])

  useEffect(() => {
    const s = searchParams.get('search')
    if (s) setRecherche(s)
    const t = searchParams.get('tag')
    if (t) setTagActif(t)
  }, [searchParams])

  const tousLesTags = useMemo(() => {
    const set = new Set()
    questions.forEach(q => (q.tags || []).forEach(t => set.add(t)))
    return Array.from(set)
  }, [questions])

  const questionsAffichees = useMemo(() => {
    let liste = [...questions]

    if (tagActif) liste = liste.filter(q => (q.tags || []).includes(tagActif))

    if (recherche.trim()) {
      const s = recherche.toLowerCase()
      liste = liste.filter(q =>
        q.titre.toLowerCase().includes(s) ||
        q.contenu.toLowerCase().includes(s) ||
        (q.tags || []).some(t => t.includes(s))
      )
    }

    if (tri === 'votes') liste.sort((a, b) => (b.votes || 0) - (a.votes || 0))
    else if (tri === 'recent') liste.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (tri === 'non-resolues') liste = liste.filter(q => (q.nbReponses || 0) === 0)

    return liste
  }, [questions, tagActif, recherche, tri])

  const choisirTag = (tag) => {
    if (tagActif === tag) {
      setTagActif(null)
      searchParams.delete('tag')
    } else {
      setTagActif(tag)
      searchParams.set('tag', tag)
    }
    setSearchParams(searchParams)
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10 text-gray-500">Chargement...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 flex-col md:flex-row">

      {/* Sidebar gauche */}
      <aside className="w-full md:w-40 flex-shrink-0">
        <nav className="flex flex-row md:flex-col gap-1">
          <div className="text-sm font-semibold text-gray-900 bg-indigo-50 px-3 py-2 rounded-lg border-l-[3px] border-indigo-500">
            Questions
          </div>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 min-w-0">

        <div className="flex justify-between items-start gap-3 mb-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 truncate">
              Toutes les questions
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {questionsAffichees.length} question{questionsAffichees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => token ? navigate('/accueil/poser') : navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm flex-shrink-0"
          >
            Poser une question
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4 flex-wrap">
          {[
            { key: 'recent', label: 'Recentes' },
            { key: 'votes', label: 'Votes' },
            { key: 'non-resolues', label: 'Non resolues' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setTri(opt.key)}
              className={`text-sm px-3.5 py-2 rounded-lg border transition-colors ${
                tri === opt.key
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}

          {(tagActif || recherche) && (
            <button
              onClick={() => { setTagActif(null); setRecherche(''); setSearchParams({}) }}
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {questionsAffichees.length === 0 ? (
          <div className="text-center py-16 px-4 text-gray-500">
            <p className="text-base font-semibold mb-1.5 text-gray-700">Aucune question trouvee</p>
            <p className="text-sm">Soyez le premier a poser cette question.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {questionsAffichees.map(q => (
              <article
                key={q._id}
                onClick={() => navigate(`/accueil/question/${q._id}`)}
                className="flex gap-4 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50/60 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="flex flex-col gap-2 min-w-[64px] flex-shrink-0 text-right">
                  <div className="text-sm text-gray-600">
                    <strong className="text-gray-900">{q.votes || 0}</strong> votes
                  </div>
                  <div
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full text-center ${
                      q.nbReponses > 0
                        ? 'bg-accent-50 text-accent-600'
                        : 'border border-gray-200 text-gray-500'
                    }`}
                  >
                    {q.nbReponses || 0} reponses
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-indigo-600 mb-1.5 truncate">
                    {q.titre}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2.5 leading-relaxed break-words text-ellipsis-2">
                    {q.contenu}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(q.tags || []).map(tag => (
                      <span
                        key={tag}
                        onClick={(e) => { e.stopPropagation(); choisirTag(tag) }}
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition-colors max-w-[160px] truncate"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400 ml-auto whitespace-nowrap flex-shrink-0">
                      {q.auteur?.prenom} {q.auteur?.nom} · {formatDate(q.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Sidebar droite */}
      <aside className="w-full md:w-52 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Tags populaires
          </h3>
          <div className="flex flex-wrap gap-2">
            {tousLesTags.map(tag => (
              <span
                key={tag}
                onClick={() => choisirTag(tag)}
                className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer transition-colors max-w-[120px] truncate"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Accueil
