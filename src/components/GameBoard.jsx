// src/components/GameBoard.js (UPDATED to use live gameState prop)

import React, { useState, useEffect } from 'react';

// --- Placeholder Card Rendering Component (Same as before, simplified for this display) ---
const RenderCardOnField = ({ card }) => (
    <div className={`field-card ${card.keywords.RUSH ? 'rush-active' : ''}`}>
        <p className="card-name">{card.name}</p>
        <p className="card-stats">Cost:{card.cost} | A:{card.baseAttack || '-'} / H:{card.baseHealth || '-'}</p>
        {card.keywords.RUSH && <span className="card-status-badge">RUSH</span>}
    </div>
);


const GameBoard = ({ navigate, gameState: initialGameState }) => { // <-- Renamed prop to initialGameState
    // Use the state received from the server as the starting point
    const [gameState, setGameState] = useState(initialGameState);
    
    // Derived properties for easier rendering
    const player = gameState.player1;
    const opponent = gameState.player2;

    useEffect(() => {
        // Now logs the actual starting hand and VS points from the server
        console.log("Game Board Loaded. Your starting Hand:", player.hand.map(c => c.name));
        console.log("Your starting VS:", player.vs);
    }, [player.hand, player.vs]);


    // --- RENDER FUNCTION ---
    return (
        <div className="game-board-container">

            {/* A. OPPONENT ZONE (Top Half) */}
            <div className="opponent-zone">
                <div className="resource-bar">
                    <p>Opponent Mana: {opponent.mana} / {opponent.maxMana}</p>
                    <p>Opponent VS: {opponent.vs} (Goal: {opponent.deck.vsGoal || 10})</p> {/* VS Goal is a placeholder until we send it from server */}
                </div>
                <div className="opponent-field">
                    {/* Render opponent's field cards here */}
                    {opponent.field.map((card, index) => (
                        <RenderCardOnField key={index} card={card} />
                    ))}
                    <div className="empty-field-slot"></div>
                </div>
                <div className="opponent-hand-placeholder">
                    {/* Display card backs based on opponent's hand count */}
                    {[...Array(opponent.hand.length)].map((_, i) => (
                        <div key={i} className="card-back-stub"></div>
                    ))}
                    <p>Deck Size: {opponent.deck.length}</p>
                </div>
            </div>
            
            <hr style={{width: '90%', borderTop: '2px solid #555'}} /> {/* Visual divider */}

            {/* B. PLAYER ZONE (Bottom Half) */}
            <div className="player-zone">
                <div className="player-field">
                    {/* Render player's field cards here */}
                    {player.field.map((card, index) => (
                        <RenderCardOnField key={index} card={card} />
                    ))}
                    <div className="empty-field-slot"></div>
                </div>
                
                <div className="player-hand">
                    {/* Display player's actual hand */}
                    {player.hand.map((card, i) => (
                        <div key={i} className="hand-card-playable">
                            <p>{card.name} (Cost: {card.cost})</p>
                        </div>
                    ))}
                </div>

                <div className="control-bar">
                    <p>Your Mana: {player.mana} / {player.maxMana}</p>
                    <p>Your VS: {player.vs} (Goal: {player.deck.vsGoal || 20})</p> {/* VS Goal is a placeholder until we send it from server */}
                    <button className="game-action-button attack-btn">Attack</button>
                    <button className="game-action-button end-turn-btn">End Turn</button>
                    <p>Deck Size: {player.deck.length}</p>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;