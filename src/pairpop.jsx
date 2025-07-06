import React, { useState, useEffect } from 'react';
import './index.css';

const symbols = ['🎯', '🎨', '🎪', '🎭', '🎸', '🎲'];

const initializeCards = () => {
  const pairs = [...symbols, ...symbols];
  return pairs
    .map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const Pairpop = () => {
  const [cards, setCards] = useState(initializeCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    let interval;
    if (active && !won) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [active, won]);

  useEffect(() => {
    if (cards.every(c => c.isMatched)) {
      setWon(true);
      setActive(false);
    }
  }, [cards]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [id1, id2] = flipped;
    const [card1, card2] = [cards.find(c => c.id === id1), cards.find(c => c.id === id2)];
    setMoves(m => m + 1);

    if (card1.symbol === card2.symbol) {
      setTimeout(() => {
        setCards(cards.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true } : c
        ));
        setFlipped([]);
      }, 500);
    } else {
      setTimeout(() => {
        setCards(cards.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
        ));
        setFlipped([]);
      }, 500);
    }
  }, [flipped, cards]);

  const handleClick = (id) => {
    const card = cards.find(c => c.id === id);
    if (card.isFlipped || card.isMatched || flipped.length === 2) return;

    if (!active) setActive(true);

    setCards(cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    ));
    setFlipped([...flipped, id]);
  };

  const reset = () => {
    setCards(initializeCards());
    setFlipped([]);
    setMoves(0);
    setTimer(0);
    setActive(false);
    setWon(false);
  };

  return (
    <div className="memory-game-container">
      <div className="memory-game-wrapper">
        <h1 className="memory-game-title">Pair_Pop</h1>

        <div className="game-info-bar">
          <div className="info-item">Time: {formatTime(timer)}</div>
          <div className="info-item">Moves: {moves}</div>
          <button className="reset-button" onClick={reset}>Reset</button>
        </div>

        <div className="card-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleClick(card.id)}
            >
              <div className="card-content">
                {card.isFlipped || card.isMatched ? (
                  <span className={`card-symbol ${card.isMatched ? 'matched-text' : 'flipped-text'}`}>
                    {card.symbol}
                  </span>
                ) : (
                  <span className="card-placeholder">?</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {won && (
          <div className="modal">
            <div className="modal-content">
              <h2 className="modal-title">You Won! 🎉</h2>
              <p className="modal-message">
                Completed in {moves} moves and {formatTime(timer)}!
              </p>
              <button className="play-again-button" onClick={reset}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pairpop;
