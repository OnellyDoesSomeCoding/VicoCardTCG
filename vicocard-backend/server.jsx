// vicocard-backend/server.js (UPDATED with Game Setup)

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { Pool } = require('pg'); 
// --- NEW IMPORT ---
const { loadInitialDeck, drawInitialHand } = require('./game_setup');

const app = express();
const server = http.createServer(app);

// --- 1. Database Setup (Same as before) ---
const pool = new Pool({
    user: 'your_db_username',
    host: 'localhost',
    database: 'vicocard_db',
    password: 'your_db_password',
    port: 5432,
});

pool.connect()
  .then(() => console.log('🟢 Connected successfully to PostgreSQL database!'))
  .catch(err => console.error('🔴 Database connection error:', err.stack));


// --- 2. Real-time Communication Setup (Socket.IO) ---
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

const activeGames = {}; 

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- GAME LOGIC: Single-Player Queue ---
    socket.on('join_single_player_queue', async (loadout) => {
        console.log(`[Queue] User ${socket.id} joined SP queue. Loadout:`, loadout);
        
        // --- A. LOAD DECKS ---
        // Player's deck (using their chosen deckId)
        const playerDeck = loadInitialDeck(loadout.deckId);
        // Bot's deck (We'll hardcode the bot to use Deck ID 2 - Lavish Laughables)
        const botDeck = loadInitialDeck(2); 

        // --- B. DRAW HANDS AND APPLY BOTTLED RIFT ---
        
        // Player's draw (Apply player's Bottled Rift advantage, e.g., 'EXTRA_CARD')
        const { hand: playerHand, remainingDeck: newPlayerDeck } = drawInitialHand(playerDeck, loadout.advantage);
        
        // Bot's draw (Bot always gets standard draw, no advantage)
        const { hand: botHand, remainingDeck: newBotDeck } = drawInitialHand(botDeck, null);


        // --- C. ASSEMBLE INITIAL GAME STATE ---
        const gameId = Math.random().toString(36).substring(2, 9);
        
        const initialGameState = {
            gameId: gameId,
            player1: { // This is the actual player
                deck: newPlayerDeck,
                hand: playerHand,
                vs: loadout.vsGain, // Apply initial VS gain from Bottled Rift
                mana: 0,
                maxMana: 0,
                field: []
            },
            player2: { // This is the AI Bot
                deck: newBotDeck,
                hand: botHand,
                vs: 0,
                mana: 0,
                maxMana: 0,
                field: []
            },
            turn: 1, // Player 1 always goes first in single-player
        };

        activeGames[gameId] = initialGameState;
        console.log(`[Game ${gameId}] Initial State Created.`);

        // --- D. NOTIFY FRONTEND ---
        // Send the initial game state back to the client immediately
        io.to(socket.id).emit('match_found', initialGameState);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// --- 3. Start the Server (Same as before) ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});