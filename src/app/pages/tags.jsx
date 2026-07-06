import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Tags = () => {
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const charger = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/questions/tags/liste`)
        const result = await response.json()
        if (response.ok) {
          setTags(result.tags || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    charger()
  }, [])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-2">Tags</h1>
      <p className="text-sm text-gray-500 mb-6">
        Un tag est un mot-cle qui decrit le sujet d'une question.
      </p>

      {tags.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun tag pour le moment.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tags.map(tag => (
            <div
              key={tag._id}
              onClick={() => navigate(`/accueil?tag=${tag._id}`)}
              className="border border-gray-200 rounded p-4 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <span className="inline-block text-sm px-2 py-1 rounded bg-accent-50 text-accent-600 border border-accent-100 mb-2">
                {tag._id}
              </span>
              <p className="text-xs text-gray-500">
                {tag.count} question{tag.count !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tags