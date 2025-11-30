import React, { useState } from 'react'
import Home from './pages/Home'
import Optimize from './pages/Optimize'
import Knapsack from './pages/Knapsack'

export default function App() {
  const [view, setView] = useState('home')

  return (
    <div className="app">
      <header className="header">
        <h1>LiquiVerde</h1>
        <nav>
          <button 
            className={view === 'home' ? 'active' : ''}
            onClick={() => setView('home')}
          >
            🔍 Buscar producto
          </button>
          <button 
            className={view === 'optimize' ? 'active' : ''}
            onClick={() => setView('optimize')}
          >
            🛒 Optimizar lista
          </button>
          <button 
            className={view === 'knapsack' ? 'active' : ''}
            onClick={() => setView('knapsack')}
          >
            🎁 Mi mochila
          </button>
        </nav>
      </header>

      <main className="main">
        {view === 'home' && <Home />}
        {view === 'optimize' && <Optimize />}
        {view === 'knapsack' && <Knapsack />}
      </main>

      <footer className="footer">
        <strong>LiquiVerde</strong> — Ahorra dinero, cuida el planeta 🌍 | v0.1.0
      </footer>
    </div>
  )
}


