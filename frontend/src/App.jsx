import { useState, useEffect } from 'react'
import axios from 'axios'
import FlashcardForm from './components/FlashcardForm'
import FlashcardItem from './components/FlashcardItem'
import './App.css'

const API = 'https://flashcard-app-q1pb.onrender.com/api/flashcards'

function App() {
  const [cards, setCards] = useState([])
  const [editingCard, setEditingCard] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 获取所有闪卡
  const fetchCards = async () => {
    try {
      const res = await axios.get(API)
      setCards(res.data)
      setError('')
    } catch (err) {
      setError('Cannot connect to server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCards() }, [])

  // 创建或更新闪卡
  const handleSave = async (data) => {
    try {
      if (editingCard) {
        await axios.put(`${API}/${editingCard.id}`, data)
        setEditingCard(null)
      } else {
        await axios.post(API, data)
      }
      fetchCards()
    } catch (err) {
      alert('Failed to save. Please try again.')
    }
  }

  // 删除闪卡
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return
    try {
      await axios.delete(`${API}/${id}`)
      fetchCards()
    } catch (err) {
      alert('Failed to delete. Please try again.')
    }
  }

  // 获取所有分类（用于筛选）
  const categories = ['All', ...new Set(cards.map((c) => c.category).filter(Boolean))]

  const filteredCards = filterCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === filterCategory)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🃏 Flashcard Learning</h1>
        <p>Click a card to reveal the answer · Click again to dismiss</p>
      </header>

      <main className="app-main">
        {/* 左侧：创建表单 */}
        <aside className="sidebar">
          <FlashcardForm
            onSave={handleSave}
            editingCard={editingCard}
            onCancel={() => setEditingCard(null)}
          />
        </aside>

        {/* 右侧：闪卡列表 */}
        <section className="cards-section">
          {/* 分类筛选 */}
          <div className="filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cards-count">{filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}</div>

          {error && <div className="error-box">{error}</div>}
          {loading && <div className="loading">Loading...</div>}

          {!loading && filteredCards.length === 0 && !error && (
            <div className="empty-state">No flashcards yet. Create your first one on the left!</div>
          )}

          <div className="cards-grid">
            {filteredCards.map((card) => (
              <FlashcardItem
                key={card.id}
                card={card}
                onEdit={setEditingCard}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
