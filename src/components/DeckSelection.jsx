// src/components/DeckSelection.js (CORRECTED)

import React, { useState, useEffect } from 'react';

// --- SIMULATED DATA ---
const DECK_DATA = [
    { id: 1, name: 'Grow-A-Deck', vs_goal: 20, theme: 'grow-theme' },
    { id: 2, name: 'Lavish Laughables', vs_goal: 10, theme: 'lavish-theme' },
    { id: 3, name: 'Future Burn Deck', vs_goal: 8, theme: 'future-theme' }
];

const DeckSelection = ({ navigate }) => {
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [selectedAdvantage, setSelectedAdvantage] = useState(null);
    const [currentDeck, setCurrentDeck] = useState(null);

    // Update currentDeck whenever selectedDeckId changes
    useEffect(() => {
        const deck = DECK_DATA.find(d => d.id === selectedDeckId);
        setCurrentDeck(deck || null); // Ensure it defaults to null if no match found
        setSelectedAdvantage(null); // Reset advantage on deck change
    }, [selectedDeckId]);


    // --- LOGIC: Get Available Bottled Rift Options ---
    const getBottledRiftOptions = () => {
        if (!currentDeck) return [];

        const options = [
            { id: 'TEMP_MANA', name: 'Tempo Choice', effect: 'Grants 1 Temporary Mana Crystal' },
            { id: 'EXTRA_CARD', name: 'Draw Choice', effect: 'Draws 1 additional card (Total 6)' }
        ];
        
        // Conditional Rule: Resource Choice is only available if VS Goal >= 10
        if (currentDeck.vs_goal >= 10) {
            const vsGain = Math.floor(currentDeck.vs_goal * 0.1);
            
            options.push({ 
                id: 'VS_RESOURCE', 
                name: 'Resource Choice', 
                effect: `Starts with ${vsGain} VS (10% of Goal)`,
                value: vsGain 
            });
        }

        return options;
    };

    // --- Handle Match Start ---
    const handleStartMatch = () => {
        if (!selectedDeckId || !selectedAdvantage || !currentDeck) {
            alert("Please select both a Deck and a Second Player Advantage.");
            return;
        }

        const finalLoadout = {
            deckId: selectedDeckId,
            advantage: selectedAdvantage,
            vsGain: selectedAdvantage === 'VS_RESOURCE' ? Math.floor(currentDeck.vs_goal * 0.1) : 0 
        };
        
        navigate('matchQueue', finalLoadout);
    };

    // --- RENDER LOGIC (The Return Part) ---
    return ( // <--- Ensure this return is present and wraps the JSX
        <div className="deck-selection shop-counter-area"> 
            
            <h2 className="selection-header">1. Select Your Deck Box</h2>

            {/* A. Deck Selection: A row of clickable Deck Boxes */}
            <div className="deck-box-row">
                {DECK_DATA.map(deck => (
                    <div 
                        key={deck.id}
                        className={`deck-box ${deck.theme} ${selectedDeckId === deck.id ? 'selected-box' : ''}`}
                        onClick={() => setSelectedDeckId(deck.id)}
                    >
                        <h3 className="box-title">{deck.name}</h3>
                        <p className="box-goal">Goal: {deck.vs_goal} VS</p>
                        <span className="box-highlight">Click to Open</span>
                    </div>
                ))}
            </div>

            {/* B. Advantage Configuration: The 'Digital Console' that appears */}
            {currentDeck && (
                <div className="bottled-rift-console-wrapper">
                    <div className={`bottled-rift-console ${currentDeck.theme}`}>
                        <h3 className="console-title">2. Configure Bottled Rift</h3>
                        <p className="console-info">Advantage for Player 2 (Deck Goal: {currentDeck.vs_goal} VS)</p>

                        {getBottledRiftOptions().map(option => (
                            <label key={option.id} className="console-option">
                                <input
                                    type="radio"
                                    name="bottledRift"
                                    value={option.id}
                                    checked={selectedAdvantage === option.id}
                                    onChange={() => setSelectedAdvantage(option.id)}
                                />
                                <span className="option-text">{option.name}: {option.effect}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            
            {/* C. Action Buttons */}
            <div className="action-buttons-footer">
                <button 
                    className="shop-button start-match-button"
                    onClick={handleStartMatch}
                    disabled={!selectedDeckId || !selectedAdvantage}
                >
                    Start Match Vibe!
                </button>
                <button 
                    className="shop-button back-button" 
                    onClick={() => navigate('mainMenu')}
                >
                    ← Back to Shop Floor
                </button>
            </div>
        </div>
    );
};

export default DeckSelection;