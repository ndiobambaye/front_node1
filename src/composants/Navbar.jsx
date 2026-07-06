import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const [dropdown, setDropdown] = useState(false)
  const [search, setSearch] = useState('')
  const dropRef = useRef(null)

  const token = localStorage.getItem('token')
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const deconnexion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setDropdown(false)
    toast.success('Vous avez ete deconnecte')
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/accueil?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const initiales = user?.prenom && user?.nom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : '?'

  return (
    <header className="bg-mauve-700 border-b-2 border-primary-500 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center gap-4">

        {/* Logo type terminal */}
        <Link to="/accueil" className="flex items-center gap-0 flex-shrink-0 mono-tag">
          <span className="text-primary-300 text-lg font-medium">{'>'}</span>
          <span className="text-lg font-medium text-paper ml-1.5">devask</span>
          <span className="text-lg text-primary-300 cursor-blink ml-0.5">_</span>
        </Link>

        {/* Liens nav */}
        <nav className="hidden md:flex gap-1 flex-shrink-0 mono-tag text-[13px]">
          <Link to="/accueil" className="text-mauve-100 px-3 py-2 hover:text-paper hover:bg-mauve-600 transition-colors whitespace-nowrap">
            questions
          </Link>
          <Link to="/accueil/tags" className="text-mauve-100 px-3 py-2 hover:text-paper hover:bg-mauve-600 transition-colors whitespace-nowrap">
            tags
          </Link>
          <Link to="/accueil/utilisateurs" className="text-mauve-100 px-3 py-2 hover:text-paper hover:bg-mauve-600 transition-colors whitespace-nowrap">
            utilisateurs
          </Link>
        </nav>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mauve-300 text-xs mono-tag pointer-events-none">
            /
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="rechercher..."
            className="w-full pl-7 pr-3 py-2 border border-mauve-600 rounded-card text-sm bg-mauve-900/40 text-paper outline-none focus:bg-white focus:text-ink-900 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-all mono-tag placeholder:text-mauve-300"
          />
        </form>

        {/* Droite */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {token && user ? (
            <>
              <Link
                to={`/accueil/profil/${user._id || user.id}`}
                className="text-sm text-mauve-100 hover:text-paper px-3.5 py-2 border border-mauve-600 rounded-card hover:border-primary-300 transition-colors whitespace-nowrap"
              >
                Mon profil
              </Link>
              <button
                onClick={deconnexion}
                className="text-sm text-primary-200 hover:text-paper px-3.5 py-2 border border-mauve-600 rounded-card hover:bg-mauve-600 transition-colors whitespace-nowrap"
              >
                Deconnexion
              </button>
              <div className="w-9 h-9 rounded-card bg-primary-500 text-white text-xs mono-tag font-medium flex items-center justify-center flex-shrink-0">
                {initiales}
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm text-primary-200 hover:text-primary-100 px-3.5 py-2 font-medium whitespace-nowrap">
                Connexion
              </Link>
              <Link to="/inscription" className="text-sm bg-primary-500 hover:bg-primary-400 text-paper px-4 py-2 rounded-card transition-colors font-medium whitespace-nowrap">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
