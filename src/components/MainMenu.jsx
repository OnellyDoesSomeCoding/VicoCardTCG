// src/components/MainMenu.js

import React from 'react';

const MainMenu = ({ navigate }) => {
    
    return (
        // 1. Shop Floor/Background Area
        <div className="vico-main-menu shop-floor">
            
            <header className="shop-sign">
                <h1>The VicoCard Trading Post</h1>
                <p>— Choose Your Destiny —</p>
            </header>

            {/* 2. The Interactive Counter/Display Case */}
            <div className="shop-counter">
                
                <h2 className="counter-title">What would you like to do?</h2>
                
                <div className="menu-display-case">
                    
                    {/* Buttons are styled to look like glowing selection items */}
                    <button 
                        className="shop-button display-item" 
                        onClick={() => navigate('deckSelection')}
                    >
                        ▶️ Play Match (Open a Deck Box)
                    </button>

                    <button 
                        className="shop-button display-item" 
                        onClick={() => navigate('deckEditor')}
                    >
                        🔨 Deck Editor (Check the Binder)
                    </button>

                    <button 
                        className="shop-button display-item" 
                        onClick={() => alert("Settings opened!")}
                    >
                        ⚙️ Settings (Adjust the Shop Rules)
                    </button>

                </div>
            </div>

            <footer className="shop-footer">
                <p className="app-version">VicoCard Dev Build 1.0.0</p>
            </footer>
        </div>
    );
};

export default MainMenu;