// src/App.jsx (FINAL FRONEND NAVIGATION UPDATE)

import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import DeckSelection from './components/DeckSelection';
import MatchQueue from './components/MatchQueue'; 
import GameBoard from './components/GameBoard';
import './App.css'; 

const App = () => {
    // Tracks the current page
    const [currentPage, setCurrentPage] = useState('mainMenu');
    // Renamed state to hold the full game state or initial loadout
    const [matchData, setMatchData] = useState(null); 

    // Function to navigate between pages and handle data passing
    const navigateTo = (pageName, data = null) => {
        if (data) {
            setMatchData(data); // Stores the loadout OR the full initialGameState
        }
        setCurrentPage(pageName);
    };

    // --- Content Render Logic ---
    let content;

    switch (currentPage) {
        case 'mainMenu':
            content = <MainMenu navigate={navigateTo} />;
            break;
        case 'deckSelection':
            content = <DeckSelection navigate={navigateTo} />;
            break;
        case 'matchQueue': 
            // When navigating TO matchQueue, matchData is the 'loadout'
            content = <MatchQueue navigate={navigateTo} loadout={matchData} />; 
            break;
        case 'gameBoard':
            // When navigating TO gameBoard, matchData is the 'initialGameState'
            content = <GameBoard navigate={navigateTo} gameState={matchData} />; // <-- Now passes 'gameState'
            break;
        case 'deckEditor':
            content = <h1>Deck Editor (Coming Soon!)</h1>;
            break;
        default:
            content = <MainMenu navigate={navigateTo} />;
    }

    return (
        <div className="vico-card-app shop-floor">
            <header className="app-header">
                <h1>VicoCard TCG</h1>
            </header>
            <main className="app-main-content">
                {content}
            </main>
        </div>
    );
};

export default App;