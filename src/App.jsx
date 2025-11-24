// src/App.js

import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import DeckSelection from './components/DeckSelection';
import './App.css'; // For basic styling later

const App = () => {
    // State to track the current page (simulating routing)
    const [currentPage, setCurrentPage] = useState('mainMenu');

    // Function to navigate between pages
    const navigateTo = (pageName) => {
        setCurrentPage(pageName);
    };

    // --- Content Render Logic ---
    let content;

    switch (currentPage) {
        case 'mainMenu':
            // Pass the navigation function down to the menu component
            content = <MainMenu navigate={navigateTo} />;
            break;
        case 'deckSelection':
            content = <DeckSelection navigate={navigateTo} />;
            break;
        case 'deckEditor':
            // Simple placeholder for other pages
            content = <h1>Deck Editor (Coming Soon!)</h1>;
            break;
        default:
            content = <MainMenu navigate={navigateTo} />;
    }

    return (
        <div className="vico-card-app">
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