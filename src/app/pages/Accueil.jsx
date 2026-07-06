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

  const stats = useMemo(() => {
    const total = questions.length
    const reponses = questions.reduce((acc, q) => acc + (q.nbReponses || 0), 0)
    const nonResolues = questions.filter(q => (q.nbReponses || 0) === 0).length
    const tauxResolution = total ? Math.round(((total - nonResolues) / total) * 100) : 0
    return { total, reponses, nonResolues, tauxResolution }
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
    return <div className="max-w-7xl mx-auto px-4 py-10 text-ink-400 mono-tag text-sm">chargement des questions...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">

      {/* Bandeau de stats type dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <button
          onClick={() => setTri('recent')}
          className="text-left bg-white border border-ink-200 rounded-lg p-3 hover:border-mauve-300 hover:shadow-card transition-all"
        >
          <p className="text-[11px] text-ink-400 mono-tag uppercase tracking-wide mb-1">Questions</p>
          <p className="text-2xl font-heading font-semibold text-ink-900">{stats.total}</p>
        </button>
        <button
          onClick={() => setTri('votes')}
          className="text-left bg-white border border-ink-200 rounded-lg p-3 hover:border-mauve-300 hover:shadow-card transition-all"
        >
          <p className="text-[11px] text-ink-400 mono-tag uppercase tracking-wide mb-1">Réponses</p>
          <p className="text-2xl font-heading font-semibold text-ink-900">{stats.reponses}</p>
        </button>
        <button
          onClick={() => setTri('non-resolues')}
          className="text-left bg-white border border-ink-200 rounded-lg p-3 hover:border-mauve-300 hover:shadow-card transition-all"
        >
          <p className="text-[11px] text-ink-400 mono-tag uppercase tracking-wide mb-1">Non résolues</p>
          <p className="text-2xl font-heading font-semibold text-primary-600">{stats.nonResolues}</p>
        </button>
        <div className="text-left bg-mauve-700 rounded-lg p-3">
          <p className="text-[11px] text-mauve-100 mono-tag uppercase tracking-wide mb-1">Taux résolution</p>
          <p className="text-2xl font-heading font-semibold text-paper">{stats.tauxResolution}%</p>
        </div>
      </div>

      <div className="flex gap-5 flex-col md:flex-row">

        {/* Contenu principal */}
        <main className="flex-1 min-w-0">

          <div className="flex justify-between items-center gap-3 mb-3 flex-wrap">
            <h1 className="font-heading text-xl font-semibold text-ink-900">
              Toutes les questions
            </h1>
            <button
              onClick={() => token ? navigate('/accueil/poser') : navigate('/')}
              className="bg-mauve-700 hover:bg-mauve-600 text-paper text-xs font-medium px-3.5 py-2 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
            >
              + Poser une question
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {[
              { key: 'recent', label: 'Récentes' },
              { key: 'votes', label: 'Votes' },
              { key: 'non-resolues', label: 'Non résolues' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setTri(opt.key)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  tri === opt.key
                    ? 'bg-mauve-700 border-mauve-700 text-paper'
                    : 'bg-white border-ink-200 text-ink-600 hover:border-mauve-300 hover:text-mauve-700'
                }`}
              >
                {opt.label}
              </button>
            ))}

            {(tagActif || recherche) && (
              <button
                onClick={() => { setTagActif(null); setRecherche(''); setSearchParams({}) }}
                className="text-xs px-3 py-1.5 rounded-md border border-ink-200 bg-white text-ink-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                Effacer les filtres
              </button>
            )}

            <span className="text-xs text-ink-400 ml-auto">
              {questionsAffichees.length} résultat{questionsAffichees.length !== 1 ? 's' : ''}
            </span>
          </div>

          {questionsAffichees.length === 0 ? (
            <div className="text-center py-16 px-4 text-ink-400 bg-white border border-ink-200 rounded-lg">
              <p className="text-base font-medium mb-1.5 text-ink-600 font-heading">Aucune question trouvee</p>
              <p className="text-sm">Soyez le premier a poser cette question.</p>
            </div>
          ) : (
            <div className="bg-white border border-ink-200 rounded-lg overflow-hidden">
              {questionsAffichees.map((q, i) => (
                <article
                  key={q._id}
                  onClick={() => navigate(`/accueil/question/${q._id}`)}
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-mauve-50/50 transition-colors ${
                    i !== 0 ? 'border-t border-ink-100' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center w-11 h-11 rounded-md bg-mauve-50 flex-shrink-0">
                    <span className="text-sm font-semibold text-mauve-700 leading-none">{q.votes || 0}</span>
                    <span className="text-[9px] text-mauve-400 mono-tag">votes</span>
                  </div>

                  <div
                    className={`text-[10px] font-medium px-1.5 py-1 rounded-md text-center w-16 flex-shrink-0 whitespace-nowrap ${
                      q.nbReponses > 0
                        ? 'bg-accent-50 text-accent-600'
                        : 'bg-ink-50 text-ink-400'
                    }`}
                  >
                    {q.nbReponses || 0} rép.
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h2 className="font-medium text-sm text-ink-900 truncate hover:text-primary-500">
                        {q.titre}
                      </h2>
                      <span className="text-xs text-ink-300 whitespace-nowrap flex-shrink-0 hidden sm:inline">
                        {formatDate(q.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-400 truncate">{q.contenu}</p>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 flex-shrink-0 max-w-[200px]">
                    {(q.tags || []).slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        onClick={(e) => { e.stopPropagation(); choisirTag(tag) }}
                        className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer transition-colors truncate"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="hidden lg:inline text-xs text-ink-300 whitespace-nowrap flex-shrink-0 w-28 text-right truncate">
                    {q.auteur?.prenom} {q.auteur?.nom}
                  </span>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Sidebar droite */}
        <aside className="w-full md:w-48 flex-shrink-0 flex flex-col gap-3">
          <div className="bg-white border border-ink-200 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-ink-900 mb-2.5">
              Tags populaires
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tousLesTags.map(tag => (
                <span
                  key={tag}
                  onClick={() => choisirTag(tag)}
                  className="inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer transition-colors max-w-[120px] truncate"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-mauve-50 border border-mauve-100 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-mauve-700 mb-2">
              À propos
            </h3>
            <p className="text-[11px] text-ink-500 leading-relaxed">
              devask est un espace pour poser vos questions techniques et aider d'autres developpeurs.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Accueil
