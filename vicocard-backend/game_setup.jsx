// vicocard-backend/game_setup.js

// --- 1. CARD DEFINITIONS (SIMULATED DATABASE DATA) ---
// This mimics the 'cards' table data (mana cost, keywords, etc.)
const CARD_DEFINITIONS = [
    { id: 1, name: "Bamboo Sprout", type: "Plant", cost: 1, baseAttack: 0, baseHealth: 0, keywords: { PLANT: 1 }, text: "Gains +1 Health at the start of your turn. Cannot attack." },
    { id: 2, name: "Dispel", type: "Spell", cost: 2, text: "Destroy one target Summon. Cannot target Plants.", keywords: {} },
    { id: 3, name: "Farmers", type: "Summon", cost: 3, baseAttack: 2, baseHealth: 1, keywords: { RUSH: true }, text: "Rush. Can attack on the turn it is played." },
    { id: 4, name: "Winged Striker", type: "Summon", cost: 4, baseAttack: 3, baseHealth: 3, keywords: { FRENZY: 2 }, text: "Frenzy 2. Gets +2 Attack when attacking. Loses Frenzy after 2 attacks." },
    { id: 5, name: "Golden Labrador", type: "Summon", cost: 5, baseAttack: 4, baseHealth: 4, keywords: {}, text: "When this card deals damage, flip a coin. On heads, gain 1 VS." },
    { id: 6, name: "Guardian", type: "Summon", cost: 5, baseAttack: 2, baseHealth: 6, keywords: { GUARDIAN: true }, text: "Redirects damage from adjacent Summons to itself." },
    // Add more cards here...
];

// --- 2. DECK LISTS (SIMULATED DATABASE DATA) ---
// This mimics the 'deck_cards' table data
const DECK_LISTS = {
    // Grow-A-Deck (ID 1)
    1: [ 
        { cardId: 1, quantity: 3 }, // Bamboo Sprout
        { cardId: 3, quantity: 3 }, // Farmers
        { cardId: 5, quantity: 2 }, // Golden Labrador
        { cardId: 6, quantity: 2 }, // Guardian
        { cardId: 4, quantity: 3 }, // Winged Striker
        { cardId: 2, quantity: 2 }, // Dispel
        // ... total of 20 cards for simplicity
    ],
    // Lavish Laughables (ID 2)
    2: [
        { cardId: 2, quantity: 3 }, // Dispel
        { cardId: 3, quantity: 2 }, // Farmers
        { cardId: 6, quantity: 3 }, // Guardian
        // ... total of 20 cards
    ]
};

// --- HELPER FUNCTION: SHUFFLE ALGORITHM (Fisher-Yates) ---
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- 3. CORE FUNCTION: CREATE AND SHUFFLE DECK ---
function loadInitialDeck(deckId) {
    const cardList = DECK_LISTS[deckId];
    if (!cardList) {
        console.error(`Deck ID ${deckId} not found.`);
        return [];
    }

    let fullDeck = [];
    for (const item of cardList) {
        const cardDefinition = CARD_DEFINITIONS.find(c => c.id === item.cardId);
        if (cardDefinition) {
            // Add the card object N times based on quantity
            for (let i = 0; i < item.quantity; i++) {
                fullDeck.push({ ...cardDefinition }); // Use spread to create a new object instance
            }
        }
    }

    return shuffle(fullDeck);
}

// --- 4. CORE FUNCTION: DRAW INITIAL HAND ---
function drawInitialHand(deck, advantage) {
    let drawCount = 5; // Standard starting hand size

    // Check for "Draw Choice" Bottled Rift Advantage
    if (advantage === 'EXTRA_CARD') {
        drawCount = 6;
        console.log("Applying Draw Choice: Drawing 6 cards.");
    }

    // Ensure we don't draw more cards than are in the deck
    const actualDraw = Math.min(drawCount, deck.length);
    
    const hand = deck.splice(0, actualDraw); // Remove cards from the start of the deck
    
    return { hand, remainingDeck: deck };
}


module.exports = {
    loadInitialDeck,
    drawInitialHand,
    CARD_DEFINITIONS // Exported for reference later
};