import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

  const PoserQuestion = () => {
  const navigate = useNavigate()
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [apercu, setApercu] = useState(false)

  const ajouterTag = (e) => {
    if (['Enter', ',', ' '].includes(e.key)) {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase().replace(/[,\s]+/g, '')
      if (t && !tags.includes(t) && tags.length < 5) {
        setTags([...tags, t])
      }
      setTagInput('')
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(tags.slice(0, -1))
    }
  }

  const retirerTag = (tag) => setTags(tags.filter(t => t !== tag))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titre.trim()) {
      toast.error('Le titre est requis')
      return
    }
    if (!contenu.trim() || contenu.trim().length < 20) {
      toast.error('La description doit contenir au moins 20 caracteres')
      return
    }
    if (tags.length === 0) {
      toast.error('Ajoutez au moins un tag')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Vous devez etre connecte pour poser une question')
      navigate('/')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titre, contenu, tags }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Question publiee avec succes !')
        const id = result.question?._id || result.question?.id
        navigate(id ? `/accueil/question/${id}` : '/accueil')
      } else {
        toast.error(result.message || "Erreur lors de la publication")
      }
    } catch (error) {
      toast.error('Serveur inaccessible. Verifiez que le backend est demarre.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/accueil')}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-2xl font-normal text-gray-900 mb-1">Poser une question</h1>
      <p className="text-sm text-gray-500 mb-6">
        Soyez precis et donnez tous les details necessaires pour obtenir une bonne reponse.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Titre */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            maxLength={150}
            placeholder="Ex : Comment trier un tableau d'objets par date en JavaScript ?"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">
            Soyez precis comme si vous posiez la question a une autre personne.
          </p>
        </div>

        {/* Description (markdown) */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>

          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setApercu(false)}
                className={`text-xs px-4 py-2 ${!apercu ? 'bg-white text-primary-600 font-semibold border-b-2 border-primary-500' : 'text-gray-500'}`}
              >
                Ecrire
              </button>
              <button
                type="button"
                onClick={() => setApercu(true)}
                className={`text-xs px-4 py-2 ${apercu ? 'bg-white text-primary-600 font-semibold border-b-2 border-primary-500' : 'text-gray-500'}`}
              >
                Apercu
              </button>
            </div>

            {!apercu ? (
              <textarea
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Decrivez votre probleme en detail. Indiquez ce que vous avez deja essaye. Markdown supporte : **gras**, *italique*, `code`, ```bloc de code```"
                className="w-full min-h-[200px] p-3 text-sm font-mono outline-none resize-y"
              />
            ) : (
              <div className="min-h-[200px] p-3 text-sm whitespace-pre-wrap text-gray-700">
                {contenu.trim() ? contenu : <span className="text-gray-400">Rien a previsualiser.</span>}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Minimum 20 caracteres.</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Tags <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 border border-gray-300 rounded px-2 py-2 min-h-[42px] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-accent-50 text-accent-600 border border-accent-100">
                {tag}
                <button type="button" onClick={() => retirerTag(tag)} className="text-accent-500 hover:text-accent-600">×</button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={ajouterTag}
                onBlur={() => { if (tagInput.trim()) ajouterTag({ key: 'Enter', preventDefault: () => {} }) }}
                placeholder={tags.length === 0 ? 'javascript, react... (Entree pour valider)' : ''}
                className="flex-1 min-w-[120px] text-sm outline-none px-1"
              />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Jusqu'a 5 tags.</p>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded transition-colors"
          >
            {loading ? 'Publication...' : 'Publier la question'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/accueil')}
            className="text-sm text-gray-600 hover:text-gray-900 px-5 py-2.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default PoserQuestion
