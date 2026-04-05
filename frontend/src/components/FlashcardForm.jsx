import { useState, useEffect } from 'react'

function FlashcardForm({ onSave, editingCard, onCancel }) {
  const [form, setForm] = useState({ question: '', answer: '', category: '' })

  // 当点击"编辑"时，把已有内容填入表单
  useEffect(() => {
    if (editingCard) {
      setForm({
        question: editingCard.question,
        answer: editingCard.answer,
        category: editingCard.category || '',
      })
    } else {
      setForm({ question: '', answer: '', category: '' })
    }
  }, [editingCard])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return
    onSave(form)
    setForm({ question: '', answer: '', category: '' })
  }

  return (
    <div className="form-card">
      <h2>{editingCard ? '✏️ Edit Card' : '➕ New Flashcard'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question *</label>
          <textarea
            placeholder="Enter your question..."
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Answer *</label>
          <textarea
            placeholder="Enter the answer..."
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
            rows={3}
          />
        </div>
        <div className="form-group">
          <label>Category (optional)</label>
          <input
            type="text"
            placeholder="e.g. Math, History, Biology..."
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingCard ? 'Save Changes' : 'Create Card'}
          </button>
          {editingCard && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default FlashcardForm
