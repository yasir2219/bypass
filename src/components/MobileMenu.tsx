'use client'

import { useState } from 'react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    const sidebar = document.getElementById('mobile-sidebar')
    if (sidebar) {
      sidebar.classList.toggle('translate-x-0')
    }
  }

  return (
    <button
      onClick={toggleMenu}
      className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900 border border-cyan-500/30 rounded-lg"
    >
      <div className="space-y-1">
        <div className="w-6 h-0.5 bg-cyan-400"></div>
        <div className="w-6 h-0.5 bg-cyan-400"></div>
        <div className="w-6 h-0.5 bg-cyan-400"></div>
      </div>
    </button>
  )
}