import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-mauve-900 text-mauve-100 text-center py-5 mt-auto border-t-2 border-primary-500">
      <p className="text-xs mono-tag tracking-wide">
        © {new Date().getFullYear()} devask — tous droits reserves
      </p>
    </footer>
  )
}

export default Footer
