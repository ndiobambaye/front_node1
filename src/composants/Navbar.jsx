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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center gap-4">

        {/* Logo */}
        <Link to="/accueil" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-lg">Dev</span>
          <span className="text-lg font-bold text-gray-900">Ask</span>
        </Link>

        {/* Liens nav */}
        <nav className="hidden md:flex gap-1">
          <Link to="/accueil" className="text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors whitespace-nowrap">
            Questions
          </Link>
          {/* Tags et Utilisateurs retires temporairement - pages non encore creees
          <Link to="/accueil/tags" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
            Tags
          </Link>
          <Link to="/accueil/utilisateurs" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
            Utilisateurs
          </Link>
          */}
        </nav>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </form>

        {/* Droite */}
        <div className="flex items-center gap-2 ml-auto">
        {token && user ? (
  <>
    <Link
          to={`/accueil/profil/${user._id || user.id}`}
         className="text-sm text-gray-600 hover:text-indigo-600 px-3.5 py-2 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
>
        Mon profil
     </Link>
        <button
       onClick={deconnexion}
        className="text-sm text-red-500 hover:text-red-600 px-3.5 py-2 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
>
    Deconnexion
      </button>
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white text-xs font-bold flex items-center justify-center shadow-sm">
      {initiales}
    </div>
  </>
) : (
  <>
    <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-700 px-3.5 py-2 font-medium">
      Connexion
    </Link>
    <Link to="/inscription" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm">
      S'inscrire
    </Link>
    <Link to="/accueil/tags" className="text-sm text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 whitespace-nowrap">
  Tags
</Link>
  </>
)}
        </div>
      </div>
    </header>
  )
}

export default Navbar
