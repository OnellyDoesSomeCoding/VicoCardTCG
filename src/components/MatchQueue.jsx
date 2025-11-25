// src/components/MatchQueue.js

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client'; // <--- NEW IMPORT

// Connection details for the backend server
const SERVER_URL = "http://localhost:3001";

const MatchQueue = ({ navigate, loadout }) => {
    const [status, setStatus] = useState("Searching for opponent...");

    useEffect(() => {
        // --- 1. Establish Socket Connection ---
        const socket = io(SERVER_URL);
        
        setStatus("Connecting to server...");

        socket.on('connect', () => {
            setStatus("Connected. Joining single-player queue...");
            
            // --- 2. Join the Queue ---
            // Tell the server we want to start a single-player game with this loadout
            socket.emit('join_single_player_queue', loadout);
        });

        // --- 3. Handle Match Found Event ---
        socket.on('match_found', (initialGameState) => {
            setStatus(`Match Found! Opponent: ${initialGameState.player2.opponentType || 'AI Bot'}`);
            
            // Navigate to the Game Board, passing the full initial game state received from the server
            setTimeout(() => {
                // Pass the initial game state, not just the loadout
                navigate('gameBoard', initialGameState);
            }, 2000); 
        });

        // Handle connection errors
        socket.on('connect_error', (err) => {
            console.error("Socket connection failed:", err.message);
            setStatus("🔴 Connection Failed. Is the backend server running?");
        });


        // --- 4. Cleanup ---
        return () => {
            socket.disconnect();
        };

    }, [navigate, loadout]);

    return (
        <div className="match-queue-screen">
            <h2 className="queue-status-header">VicoCard Matchmaking</h2>
            
            <div className="queue-spinner">
                {/* CSS will make this look like a spinning card or animation */}
                <div className="spinning-card">🃏</div>
            </div>
            
            <p className="status-message">{status}</p>

            {status === "Searching for opponent..." && (
                <button 
                    className="shop-button cancel-queue" 
                    onClick={() => navigate('deckSelection')}
                >
                    Cancel Search
                </button>
            )}
        </div>
    );
};

export default MatchQueue;