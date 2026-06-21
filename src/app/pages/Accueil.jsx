import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const TAGS_COULEURS = {
  react: '#61dafb22',
  javascript: '#f7df1e22',
  nodejs: '#3c873a22',
  express: '#00000011',
  java: '#f8981d22',
  'spring-boot': '#6db33f22',
  mysql: '#00618a22',
}

function formatDate(iso) {
  const d = new Date(iso)
  const maintenant = new Date()
  const diffMs = maintenant - d
  const diffH = diffMs / 3600000
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
    return <div style={{ maxWidth: '1264px', margin: '0 auto', padding: '40px 16px' }}>Chargement...</div>
  }

  return (
    <div style={{
      maxWidth: '1264px', margin: '0 auto', padding: '24px 16px',
      display: 'flex', gap: '24px',
      fontFamily: "-apple-system, 'Segoe UI', Arial, sans-serif",
      color: '#232629',
    }}>

      <aside style={{ width: '164px', flexShrink: 0 }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={sideNavStyle(true)}>Questions</div>
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '27px', fontWeight: '400', margin: 0, color: '#1a1a1a' }}>
              Toutes les questions
            </h1>
            <p style={{ fontSize: '13px', color: '#6a737c', marginTop: '4px' }}>
              {questionsAffichees.length} question{questionsAffichees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => token ? navigate('/accueil/poser') : navigate('/')}
            style={{
              background: '#0a95ff', color: '#fff', border: 'none',
              padding: '9px 16px', borderRadius: '4px',
              fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Poser une question
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          borderBottom: '1px solid #e3e6e8', paddingBottom: '12px', marginBottom: '16px',
          flexWrap: 'wrap',
        }}>
          {[
            { key: 'recent', label: 'Recentes' },
            { key: 'votes', label: 'Votes' },
            { key: 'non-resolues', label: 'Non resolues' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setTri(opt.key)}
              style={{
                fontSize: '13px',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid ' + (tri === opt.key ? '#0a95ff' : '#d6d9dc'),
                background: tri === opt.key ? '#0a95ff' : '#fff',
                color: tri === opt.key ? '#fff' : '#3b4045',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}

          {(tagActif || recherche) && (
            <button
              onClick={() => { setTagActif(null); setRecherche(''); setSearchParams({}) }}
              style={{
                fontSize: '12px', color: '#6a737c', background: 'none',
                border: 'none', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline',
              }}
            >
              Effacer les filtres
            </button>
          )}
        </div>

        {questionsAffichees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6a737c' }}>
            <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>Aucune question trouvee</p>
            <p style={{ fontSize: '13px' }}>Soyez le premier a poser cette question.</p>
          </div>
        ) : (
          <div>
            {questionsAffichees.map(q => (
              <article
                key={q._id}
                onClick={() => navigate(`/accueil/question/${q._id}`)}
                style={{
                  display: 'flex', gap: '16px',
                  padding: '16px 0',
                  borderBottom: '1px solid #e3e6e8',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '64px', textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '13px', color: '#3b4045' }}>
                    <strong>{q.votes || 0}</strong> votes
                  </div>
                  <div style={{
                    fontSize: '13px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    color: q.nbReponses > 0 ? '#fff' : '#3b4045',
                    background: q.nbReponses > 0 ? '#5eba7d' : 'transparent',
                    border: q.nbReponses > 0 ? 'none' : '1px solid #d6d9dc',
                  }}>
                    <strong>{q.nbReponses || 0}</strong> reponses
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '400', margin: '0 0 6px', color: '#0a95ff' }}>
                    {q.titre}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#3b4045', margin: '0 0 10px', lineHeight: '1.5' }}>
                    {q.contenu.length > 150 ? q.contenu.slice(0, 150) + '...' : q.contenu}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {(q.tags || []).map(tag => (
                      <span
                        key={tag}
                        onClick={(e) => { e.stopPropagation(); choisirTag(tag) }}
                        style={badgeTagStyle(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                    <span style={{ fontSize: '12px', color: '#6a737c', marginLeft: 'auto' }}>
                      {q.auteur?.prenom} {q.auteur?.nom} · {formatDate(q.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <aside style={{ width: '200px', flexShrink: 0 }}>
        <div style={{ border: '1px solid #e3e6e8', borderRadius: '6px', padding: '14px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 10px', color: '#1a1a1a' }}>
            Tags populaires
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {tousLesTags.map(tag => (
              <span
                key={tag}
                onClick={() => choisirTag(tag)}
                style={{ ...badgeTagStyle(tag), cursor: 'pointer' }}
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

function sideNavStyle(active) {
  return {
    fontSize: '13px',
    padding: '7px 12px',
    borderRadius: '4px',
    color: active ? '#1a1a1a' : '#3b4045',
    background: active ? '#e3f1fc' : 'transparent',
    fontWeight: active ? '600' : '400',
    textDecoration: 'none',
    borderLeft: active ? '3px solid #0a95ff' : '3px solid transparent',
    paddingLeft: active ? '9px' : '12px',
  }
}

function badgeTagStyle(tag) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '4px',
    background: TAGS_COULEURS[tag] || '#e1ecf422',
    color: '#39739d',
    border: '1px solid #d9e6f2',
    cursor: 'pointer',
  }
}

export default Accueil