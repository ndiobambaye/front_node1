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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-[50px] flex items-center gap-4">

        {/* Logo */}
        <Link to="/accueil" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">Dev</span>
          <span className="text-lg font-bold text-gray-900">Ask</span>
        </Link>

        {/* Liens nav */}
        <nav className="hidden md:flex gap-1">
          <Link to="/accueil" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
            Questions
          </Link>
          <Link to="/accueil/tags" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
            Tags
          </Link>
          <Link to="/accueil/utilisateurs" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
            Utilisateurs
          </Link>
        </nav>

        {/* Recherche */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </form>

        {/* Droite */}
        <div className="flex items-center gap-2 ml-auto">
          {token && user ? (
            <>
              <Link
                to="/accueil/poser"
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded transition-colors whitespace-nowrap"
              >
                Poser une question
              </Link>

              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdown(v => !v)}
                  className="w-8 h-8 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold flex items-center justify-center transition-colors"
                >
                  {initiales}
                </button>

                {dropdown && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg min-w-[210px] shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                    </div>

                    <Link
                      to={`/accueil/utilisateurs/${user.id}`}
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Mon profil
                    </Link>
                    <Link
                      to="/accueil/poser"
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Poser une question
                    </Link>
                    <Link
                      to="/accueil/tags"
                      onClick={() => setDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Tags
                    </Link>

                    <div className="border-t border-gray-100" />

                    <button
                      onClick={deconnexion}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Deconnexion
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm text-blue-500 hover:text-blue-600 px-3 py-1.5 font-medium">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors"
              >
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
