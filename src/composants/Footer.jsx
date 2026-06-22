import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 text-center py-4 mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} DevAsk — Tous droits reserves
      </p>
    </footer>
  )
}

export default Footer
