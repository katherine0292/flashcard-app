import { useState } from 'react'

function FlashcardItem({ card, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false)
  const [used, setUsed] = useState(false)

  // 点击卡片：翻转显示答案
  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true)
    } else {
      // 已经翻转后再次点击 → 卡片消失（题目用完）
      setUsed(true)
    }
  }

  // 卡片消失后不渲染
  if (used) return null

  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        {/* 正面：问题 */}
        <div className="flashcard-front">
          {card.category && <span className="category-badge">{card.category}</span>}
          <p className="card-text">{card.question}</p>
          <p className="hint">Click to reveal answer</p>
        </div>

        {/* 背面：答案 */}
        <div className="flashcard-back">
          {card.category && <span className="category-badge">{card.category}</span>}
          <p className="card-text">{card.answer}</p>
          <p className="hint">Click again to dismiss</p>
        </div>
      </div>

      {/* 编辑和删除按钮（阻止冒泡，不触发翻转） */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-edit"
          onClick={() => onEdit(card)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="btn-delete"
          onClick={() => onDelete(card.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default FlashcardItem
