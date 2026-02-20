/* ═══════════════════════════════════════════════════════════
   SPACE ADVENTURES — Kid-Friendly Game Logic
   Compact UI + Travel Animation + Integrated Star Map Actions
   ═══════════════════════════════════════════════════════════ */

// ─── GAME DATA ─────────────────────────────────────────────

const RESOURCES = {
    iron:            { name: 'Space Rocks',      basePrice: 10,   rarity: 'common',    symbol: '🪨' },
    carbon:          { name: 'Shadow Dust',      basePrice: 8,    rarity: 'common',    symbol: '🌑' },
    silicon:         { name: 'Sparkle Sand',     basePrice: 12,   rarity: 'common',    symbol: '✨' },
    copper:          { name: 'Sun Metal',        basePrice: 25,   rarity: 'uncommon',  symbol: '☀️' },
    titanium:        { name: 'Thunder Steel',    basePrice: 35,   rarity: 'uncommon',  symbol: '⚡' },
    helium3:         { name: 'Cloud Bubbles',    basePrice: 45,   rarity: 'uncommon',  symbol: '🫧' },
    platinum:        { name: 'Star Silver',      basePrice: 80,   rarity: 'rare',      symbol: '⭐' },
    darkMatter:      { name: 'Shadow Goo',       basePrice: 150,  rarity: 'rare',      symbol: '👾' },
    quantumCrystals: { name: 'Rainbow Crystals', basePrice: 200,  rarity: 'rare',      symbol: '🌈' },
    voidEssence:     { name: 'Dragon Fire',      basePrice: 500,  rarity: 'legendary', symbol: '🐉' },
    neutronium:      { name: 'Unicorn Dust',     basePrice: 1000, rarity: 'legendary', symbol: '🦄' },
};

const RARITY_NAMES = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', legendary: 'LEGENDARY' };
const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 };

const LOCATIONS = {
    havenStation: {
        name: 'Haven Station', emoji: '🏠', type: 'station',
        x: 400, y: 280,
        canMine: false, canTrade: true, canRefuel: true, canUpgrade: true,
        description: 'Your home base! A friendly space station with shops, fuel, and a repair bay.',
        dangerLevel: 0, color: '#00d4ff',
        resources: [],
        tradeResources: ['iron','carbon','silicon','copper','titanium','helium3','platinum'],
        priceModifiers: {}, fuelPrice: 3,
    },
    dustyRock: {
        name: 'Sandy Planet', emoji: '🏜️', type: 'planet',
        x: 220, y: 170,
        canMine: true, canTrade: false, canRefuel: false, canUpgrade: false,
        description: 'A sandy little planet covered in shiny rocks. Perfect for your first mining adventure!',
        dangerLevel: 1, color: '#c4813a',
        resources: [
            { id: 'iron', weight: 50 },
            { id: 'carbon', weight: 30 },
            { id: 'silicon', weight: 20 },
        ],
        tradeResources: [], priceModifiers: {}, fuelPrice: 0,
    },
    frostHaven: {
        name: 'Ice World', emoji: '🧊', type: 'planet',
        x: 110, y: 340,
        canMine: true, canTrade: true, canRefuel: true, canUpgrade: false,
        description: 'Brrr! A frozen planet with cool stuff under the ice! Has a tiny shop and fuel.',
        dangerLevel: 1, color: '#7ec8e3',
        resources: [
            { id: 'carbon', weight: 20 },
            { id: 'silicon', weight: 20 },
            { id: 'copper', weight: 30 },
            { id: 'helium3', weight: 20 },
            { id: 'titanium', weight: 10 },
        ],
        tradeResources: ['iron','carbon','silicon','copper','helium3'],
        priceModifiers: { helium3: 1.25, copper: 1.1 }, fuelPrice: 4,
    },
    vulcanPrime: {
        name: 'Volcano World', emoji: '🌋', type: 'planet',
        x: 280, y: 430,
        canMine: true, canTrade: false, canRefuel: false, canUpgrade: false,
        description: 'A fiery planet with volcanoes! The lava hides amazing treasures. Need strong hull!',
        dangerLevel: 2, color: '#e74c3c',
        resources: [
            { id: 'iron', weight: 10 },
            { id: 'copper', weight: 25 },
            { id: 'titanium', weight: 35 },
            { id: 'platinum', weight: 30 },
        ],
        tradeResources: [], priceModifiers: {}, fuelPrice: 0,
    },
    asteroidBelt: {
        name: 'Asteroid Playground', emoji: '☄️', type: 'planet',
        x: 560, y: 170,
        canMine: true, canTrade: true, canRefuel: false, canUpgrade: false,
        description: 'Floating rocks everywhere! Space miners hang out here and trade stuff.',
        dangerLevel: 2, color: '#95a5a6',
        resources: [
            { id: 'iron', weight: 20 },
            { id: 'titanium', weight: 25 },
            { id: 'platinum', weight: 30 },
            { id: 'silicon', weight: 25 },
        ],
        tradeResources: ['iron','silicon','titanium','platinum','copper'],
        priceModifiers: { iron: 0.8, titanium: 0.85, platinum: 1.15 }, fuelPrice: 0,
    },
    crystalFields: {
        name: 'Crystal Caves', emoji: '💎', type: 'planet',
        x: 80, y: 100,
        canMine: true, canTrade: false, canRefuel: false, canUpgrade: false,
        description: 'Magical planet full of glowing crystals! Rainbow crystals grow here. Need tough ship!',
        dangerLevel: 3, color: '#9b59b6',
        resources: [
            { id: 'helium3', weight: 10 },
            { id: 'platinum', weight: 20 },
            { id: 'darkMatter', weight: 30 },
            { id: 'quantumCrystals', weight: 40 },
        ],
        tradeResources: [], priceModifiers: {}, fuelPrice: 0,
    },
    theVoidEdge: {
        name: 'The Mystery Zone', emoji: '🌀', type: 'planet',
        x: 720, y: 70,
        canMine: true, canTrade: false, canRefuel: false, canUpgrade: false,
        description: 'The spookiest place in space! Amazing treasures. Only the bravest explore here!',
        dangerLevel: 4, color: '#6c2da8',
        resources: [
            { id: 'platinum', weight: 10 },
            { id: 'quantumCrystals', weight: 20 },
            { id: 'darkMatter', weight: 25 },
            { id: 'voidEssence', weight: 28 },
            { id: 'neutronium', weight: 17 },
        ],
        tradeResources: [], priceModifiers: {}, fuelPrice: 0,
    },
    coreMarket: {
        name: 'Big Space Mall', emoji: '🛒', type: 'station',
        x: 490, y: 400,
        canMine: false, canTrade: true, canRefuel: true, canUpgrade: false,
        description: 'The biggest shop in the galaxy! Great prices for rare finds!',
        dangerLevel: 0, color: '#4cd137',
        resources: [],
        tradeResources: ['iron','carbon','silicon','copper','titanium','helium3','platinum','darkMatter'],
        priceModifiers: { iron: 0.85, carbon: 0.85, silicon: 0.85, copper: 1.15, titanium: 1.2, helium3: 1.25, platinum: 1.1 },
        fuelPrice: 3,
    },
    frontierOutpost: {
        name: "Explorer's Hideout", emoji: '🔭', type: 'station',
        x: 660, y: 290,
        canMine: false, canTrade: true, canRefuel: true, canUpgrade: true,
        description: 'A secret base for brave explorers! Pays TONS for exotic treasures. Has upgrade shop!',
        dangerLevel: 0, color: '#f1c40f',
        resources: [],
        tradeResources: ['copper','titanium','helium3','platinum','darkMatter','quantumCrystals','voidEssence'],
        priceModifiers: { platinum: 1.4, darkMatter: 1.35, quantumCrystals: 1.3, voidEssence: 1.15 },
        fuelPrice: 4,
    },
    shadowBazaar: {
        name: 'Alien Market', emoji: '👽', type: 'station',
        x: 730, y: 450,
        canMine: false, canTrade: true, canRefuel: true, canUpgrade: false,
        description: 'Wild alien market! They go CRAZY for legendary treasures. Best prices!',
        dangerLevel: 0, color: '#e74c43',
        resources: [],
        tradeResources: ['platinum','darkMatter','quantumCrystals','voidEssence','neutronium'],
        priceModifiers: { voidEssence: 1.8, neutronium: 1.9, darkMatter: 1.4, quantumCrystals: 1.35 },
        fuelPrice: 5,
    },
};

// Deep-clone base locations for galaxy generation
const BASE_LOCATIONS = JSON.parse(JSON.stringify(LOCATIONS));

const GALAXY_NAMES = [
    'Sparkle Nebula', 'Rainbow Drift', 'Cosmic Candy', 'Star Whisper', 'Nova Bloom',
    'Galactic Fizz', 'Moonbeam Trail', 'Comet Garden', 'Starlight Valley', 'Nebula Dreams',
    'Solar Breeze', 'Astral Glow', 'Pixel Galaxy', 'Thunder Cloud', 'Crystal Void',
    'Emerald Spiral', 'Diamond Streak', 'Velvet Sky', 'Neon Frontier', 'Shadow Reef',
];

const LOCATION_EMOJIS = {
    havenStation:    ['🏠','🏡','🛖','🛸','🏰'],
    dustyRock:       ['🏜️','🪨','🌵','🏔️','🐪'],
    frostHaven:      ['🧊','❄️','🌨️','⛄','🏔️'],
    vulcanPrime:     ['🌋','🔥','💥','☀️','🧨'],
    asteroidBelt:    ['☄️','🪐','🌑','💫','🌠'],
    crystalFields:   ['💎','🔮','💠','✨','🌈'],
    theVoidEdge:     ['🌀','👁️','🕳️','🌑','🫧'],
    coreMarket:      ['🛒','🏪','🏬','🎪','🎁'],
    frontierOutpost: ['🔭','📡','⚓','🗼','🚩'],
    shadowBazaar:    ['👽','🛸','🎭','🐙','🦑'],
};

const LOCATION_NAMES = {
    havenStation:    ['Haven Station','Home Base','Cozy Port','Safe Harbor','Star Lodge'],
    dustyRock:       ['Sandy Planet','Desert World','Dusty Dunes','Dry Rock','Sand Globe'],
    frostHaven:      ['Ice World','Frozen Planet','Snow Globe','Chill Rock','Frost Peak'],
    vulcanPrime:     ['Volcano World','Fire Planet','Lava Land','Magma Rock','Blaze World'],
    asteroidBelt:    ['Asteroid Playground','Rock Field','Space Junkyard','Boulder Belt','Tumble Zone'],
    crystalFields:   ['Crystal Caves','Gem Planet','Sparkle World','Diamond Depths','Prism Rock'],
    theVoidEdge:     ['The Mystery Zone','Dark Frontier','Shadow Rim','Void Gate','Spook Space'],
    coreMarket:      ['Big Space Mall','Star Mart','Mega Market','Galaxy Bazaar','Trade Tower'],
    frontierOutpost: ["Explorer's Hideout",'Scout Station',"Ranger's Post",'Brave Base','Edge Camp'],
    shadowBazaar:    ['Alien Market','Strange Bazaar','Weird Shop','Creature Corner','Cosmic Flea Market'],
};

function generateGalaxy() {
    const galaxy = { name: GALAXY_NAMES[Math.floor(Math.random() * GALAXY_NAMES.length)] };
    galaxy.positions = {};
    galaxy.resourceWeights = {};
    galaxy.priceModifiers = {};
    galaxy.fuelPrices = {};
    galaxy.startingCredits = 800 + Math.floor(Math.random() * 401);
    galaxy.emojis = {};
    galaxy.names = {};
    galaxy.dangerLevels = {};
    galaxy.tradeVariations = {};

    for (const [id, base] of Object.entries(BASE_LOCATIONS)) {
        // Random emoji
        const emojiPool = LOCATION_EMOJIS[id];
        if (emojiPool) galaxy.emojis[id] = emojiPool[Math.floor(Math.random() * emojiPool.length)];

        // Random name
        const namePool = LOCATION_NAMES[id];
        if (namePool) galaxy.names[id] = namePool[Math.floor(Math.random() * namePool.length)];

        // Position jitter (bigger for more variation)
        const jitter = id === 'havenStation' ? 20 : 60;
        galaxy.positions[id] = {
            x: Math.max(50, Math.min(750, base.x + Math.round((Math.random() - 0.5) * 2 * jitter))),
            y: Math.max(50, Math.min(450, base.y + Math.round((Math.random() - 0.5) * 2 * jitter))),
        };

        // Resource weight variation (wider range)
        if (base.resources && base.resources.length > 0) {
            galaxy.resourceWeights[id] = base.resources.map(r => ({
                id: r.id,
                weight: Math.max(5, Math.round(r.weight * (0.6 + Math.random() * 0.8)))
            }));
        }

        // Price modifier variation
        if (base.priceModifiers && Object.keys(base.priceModifiers).length > 0) {
            galaxy.priceModifiers[id] = {};
            for (const [resId, mod] of Object.entries(base.priceModifiers)) {
                galaxy.priceModifiers[id][resId] = +(mod * (0.85 + Math.random() * 0.3)).toFixed(2);
            }
        }

        // Fuel price variation
        if (base.fuelPrice > 0) {
            galaxy.fuelPrices[id] = Math.max(1, base.fuelPrice + Math.round((Math.random() - 0.5) * 3));
        }

        // Danger level variation for planets (±1, 30% chance)
        if (base.dangerLevel > 0) {
            const shift = Math.random() < 0.3 ? (Math.random() < 0.5 ? -1 : 1) : 0;
            galaxy.dangerLevels[id] = Math.max(1, Math.min(5, base.dangerLevel + shift));
        }

        // Trade resource variation — 40% chance to swap one resource
        if (base.tradeResources && base.tradeResources.length > 2) {
            const allRes = Object.keys(RESOURCES);
            const trades = [...base.tradeResources];
            if (Math.random() < 0.4) {
                const removeIdx = Math.floor(Math.random() * trades.length);
                trades.splice(removeIdx, 1);
                const available = allRes.filter(r => !trades.includes(r));
                if (available.length > 0) trades.push(available[Math.floor(Math.random() * available.length)]);
            }
            galaxy.tradeVariations[id] = trades;
        }
    }
    return galaxy;
}

function applyGalaxy(galaxy) {
    if (!galaxy) return;
    for (const [id, loc] of Object.entries(LOCATIONS)) {
        if (galaxy.names && galaxy.names[id]) loc.name = galaxy.names[id];
        if (galaxy.emojis && galaxy.emojis[id]) loc.emoji = galaxy.emojis[id];
        if (galaxy.positions && galaxy.positions[id]) {
            loc.x = galaxy.positions[id].x;
            loc.y = galaxy.positions[id].y;
        }
        if (galaxy.resourceWeights && galaxy.resourceWeights[id]) {
            loc.resources = JSON.parse(JSON.stringify(galaxy.resourceWeights[id]));
        }
        if (galaxy.priceModifiers && galaxy.priceModifiers[id]) {
            loc.priceModifiers = { ...galaxy.priceModifiers[id] };
        }
        if (galaxy.fuelPrices && galaxy.fuelPrices[id] !== undefined) {
            loc.fuelPrice = galaxy.fuelPrices[id];
        }
        if (galaxy.dangerLevels && galaxy.dangerLevels[id] !== undefined) {
            loc.dangerLevel = galaxy.dangerLevels[id];
        }
        if (galaxy.tradeVariations && galaxy.tradeVariations[id]) {
            loc.tradeResources = [...galaxy.tradeVariations[id]];
        }
    }
}

function resetLocations() {
    for (const [id, base] of Object.entries(BASE_LOCATIONS)) {
        const loc = LOCATIONS[id];
        loc.name = base.name;
        loc.emoji = base.emoji;
        loc.x = base.x;
        loc.y = base.y;
        loc.resources = JSON.parse(JSON.stringify(base.resources));
        loc.priceModifiers = { ...base.priceModifiers };
        loc.fuelPrice = base.fuelPrice;
        loc.dangerLevel = base.dangerLevel;
        loc.tradeResources = [...base.tradeResources];
    }
}

const UPGRADES = {
    miningLaser: {
        name: 'Mining Laser', icon: '⚡',
        description: 'How fast you can mine and what you can find!',
        levels: [
            { cost: 0,     miningTime: 3000, desc: 'Basic laser — common stuff' },
            { cost: 400,   miningTime: 2500, desc: 'Better laser — uncommon too!' },
            { cost: 1500,  miningTime: 2000, desc: 'Cool laser — some rare stuff!' },
            { cost: 5000,  miningTime: 1500, desc: 'Super laser — all good stuff!' },
            { cost: 15000, miningTime: 1000, desc: '🌟 MEGA LASER — legendary!' },
        ],
    },
    cargoHold: {
        name: 'Backpack', icon: '🎒',
        description: 'How much stuff your ship can carry!',
        levels: [
            { cost: 0,     capacity: 25,  desc: 'Tiny — 25 items' },
            { cost: 300,   capacity: 40,  desc: 'Small — 40 items' },
            { cost: 1200,  capacity: 60,  desc: 'Medium — 60 items' },
            { cost: 4000,  capacity: 85,  desc: 'Big — 85 items!' },
            { cost: 12000, capacity: 120, desc: '🌟 MEGA — 120 items!!' },
        ],
    },
    fuelTank: {
        name: 'Fuel Tank', icon: '⛽',
        description: 'How far you can fly!',
        levels: [
            { cost: 0,     capacity: 100, desc: 'Small — 100 fuel' },
            { cost: 250,   capacity: 150, desc: 'Medium — 150 fuel' },
            { cost: 1000,  capacity: 200, desc: 'Large — 200 fuel' },
            { cost: 3500,  capacity: 300, desc: 'Huge — 300 fuel!' },
            { cost: 10000, capacity: 400, desc: '🌟 MEGA — 400 fuel!!' },
        ],
    },
    engines: {
        name: 'Engines', icon: '🚀',
        description: 'Use less fuel when you fly!',
        levels: [
            { cost: 0,     fuelMod: 1.0,  desc: 'Normal engines' },
            { cost: 350,   fuelMod: 0.80, desc: 'Better — saves 20% fuel!' },
            { cost: 1500,  fuelMod: 0.65, desc: 'Fast — saves 35% fuel!' },
            { cost: 5000,  fuelMod: 0.50, desc: 'Super — saves 50%!!' },
            { cost: 15000, fuelMod: 0.35, desc: '🌟 MEGA — saves 65%!!!' },
        ],
    },
    scanner: {
        name: 'Treasure Scanner', icon: '📡',
        description: 'Find rare stuff more often!',
        levels: [
            { cost: 0,     rareBonus: 0,    desc: 'No scanner' },
            { cost: 300,   rareBonus: 0.10, desc: 'Basic — +10% rare!' },
            { cost: 1200,  rareBonus: 0.20, desc: 'Good — +20% rare!' },
            { cost: 4000,  rareBonus: 0.30, desc: 'Great — +30% rare!!' },
            { cost: 12000, rareBonus: 0.40, desc: '🌟 MEGA — +40% rare!!!' },
        ],
    },
    hull: {
        name: 'Ship Armor', icon: '🛡️',
        description: 'Explore scarier planets!',
        levels: [
            { cost: 0,     access: 1, desc: 'Thin — safe planets ⭐' },
            { cost: 500,   access: 2, desc: 'Strong — medium ⭐⭐' },
            { cost: 2500,  access: 3, desc: 'Super — scary ⭐⭐⭐' },
            { cost: 8000,  access: 4, desc: 'Ultra — REALLY scary ⭐⭐⭐⭐' },
            { cost: 20000, access: 5, desc: '🌟 MEGA — EVERYWHERE!! ⭐⭐⭐⭐⭐' },
        ],
    },
    weapons: {
        name: 'Laser Cannon', icon: '🔫',
        description: 'Blast space baddies in battle!',
        levels: [
            { cost: 0,     damage: 8,  desc: 'Pea Shooter — 8 damage' },
            { cost: 500,   damage: 14, desc: 'Zapper — 14 damage!' },
            { cost: 2000,  damage: 22, desc: 'Blaster — 22 damage!!' },
            { cost: 7000,  damage: 32, desc: 'Mega Gun — 32 damage!!!' },
            { cost: 20000, damage: 45, desc: '🌟 ULTRA — 45 damage!!!!' },
        ],
    },
    shields: {
        name: 'Energy Shield', icon: '🔋',
        description: 'Block enemy attacks in battle!',
        levels: [
            { cost: 0,     maxShield: 30,  desc: 'Weak — 30 shield' },
            { cost: 400,   maxShield: 55,  desc: 'Better — 55 shield' },
            { cost: 1800,  maxShield: 85,  desc: 'Strong — 85 shield!' },
            { cost: 5500,  maxShield: 125, desc: 'Super — 125 shield!!' },
            { cost: 16000, maxShield: 180, desc: '🌟 MEGA — 180 shield!!!' },
        ],
    },
};

const LASER_ACCESS = [
    [1.0, 0.20, 0.0,  0.0],
    [1.0, 1.0,  0.12, 0.0],
    [1.0, 1.0,  0.75, 0.05],
    [1.0, 1.0,  1.0,  0.45],
    [1.0, 1.0,  1.0,  1.0],
];

// ─── ENEMIES & BOSSES ──────────────────────────────────────

const ENEMIES = [
    { name: 'Space Pirate',  emoji: '🏴\u200d☠️', hp: 25,  attack: 6,  tier: 1, loot: [12, 35] },
    { name: 'Alien Bug',     emoji: '🐛', hp: 20,  attack: 7,  tier: 1, loot: [8, 30] },
    { name: 'Rogue Bot',     emoji: '🤖', hp: 36,  attack: 10, tier: 2, loot: [25, 60] },
    { name: 'Nebula Shark',  emoji: '🦈', hp: 45,  attack: 12, tier: 2, loot: [35, 80] },
    { name: 'Dark Specter',  emoji: '👻', hp: 60,  attack: 16, tier: 3, loot: [50, 120] },
    { name: 'Void Serpent',  emoji: '🐍', hp: 80,  attack: 20, tier: 4, loot: [80, 180] },
];

const BOSSES = {
    sandWorm:     { name: 'Sand Worm',     emoji: '🪱👑', hp: 50,  attack: 7,  location: 'dustyRock',     reward: 300,  desc: 'A giant worm hiding under the sand!' },
    lavaLord:     { name: 'Lava Lord',      emoji: '😈🔥', hp: 95,  attack: 13, location: 'vulcanPrime',   reward: 800,  desc: 'A fiery demon from deep in the volcano!' },
    pirateKing:   { name: 'Pirate King',    emoji: '🏴\u200d☠️👑', hp: 140, attack: 17, location: 'asteroidBelt',  reward: 1800, desc: 'The boss of all space pirates!' },
    crystalTitan: { name: 'Crystal Titan',  emoji: '💎🗿', hp: 200, attack: 22, location: 'crystalFields', reward: 3500, desc: 'An ancient giant made of living crystals!' },
    cosmicDragon: { name: 'Cosmic Dragon',  emoji: '🐉✨', hp: 280, attack: 30, location: 'theVoidEdge',   reward: 8000, desc: 'The ultimate space dragon! FINAL BOSS!' },
};

// ─── DIFFICULTY ─────────────────────────────────────────────

const DIFFICULTY = {
    easy: {
        name: 'Explorer', emoji: '🌟', color: '#6bcb77',
        desc: 'Relax and have fun! Gentler enemies, bigger rewards.',
        details: '👾 Weaker enemies<br>🎁 +30% rewards<br>🏃 Easy to flee<br>💰 More starting coins',
        enemyHpMult: 0.7, enemyAtkMult: 0.65,
        bossHpMult: 0.75, bossAtkMult: 0.7,
        encounterMult: 0.5,
        rewardMult: 1.3,
        lossPenaltyMult: 0.5,
        fleeBonus: 0.15,
        startCreditsMult: 1.25,
    },
    normal: {
        name: 'Captain', emoji: '⚔️', color: '#ffd93d',
        desc: 'A balanced space adventure with real challenge!',
        details: '👾 Standard enemies<br>⚖️ Balanced rewards<br>🏃 Normal flee rate',
        enemyHpMult: 1.0, enemyAtkMult: 1.0,
        bossHpMult: 1.0, bossAtkMult: 1.0,
        encounterMult: 1.0,
        rewardMult: 1.0,
        lossPenaltyMult: 1.0,
        fleeBonus: 0,
        startCreditsMult: 1.0,
    },
    hard: {
        name: 'Commander', emoji: '💀', color: '#ff6b6b',
        desc: 'Brutal! Only the toughest survive the Cosmic Dragon!',
        details: '👾 Brutal enemies!<br>🎁 -30% rewards<br>🏃 Hard to flee<br>💀 Bosses are INSANE!',
        enemyHpMult: 1.4, enemyAtkMult: 1.3,
        bossHpMult: 1.35, bossAtkMult: 1.25,
        encounterMult: 1.5,
        rewardMult: 0.7,
        lossPenaltyMult: 1.5,
        fleeBonus: -0.15,
        startCreditsMult: 0.7,
    },
};

function getDifficulty() {
    return DIFFICULTY[(game && game.difficulty) || 'normal'];
}

// ─── ACHIEVEMENTS ──────────────────────────────────────────

const ACHIEVEMENTS = {
    firstFlight:    { name: 'First Flight!',       emoji: '🚀', desc: 'Travel to your first planet!', check: g => g.stats.tripsCount >= 1 },
    firstMine:      { name: 'Space Miner!',        emoji: '⛏️', desc: 'Mine 5 resources!', check: g => g.stats.totalMined >= 5 },
    bigMiner:       { name: 'Mining Pro!',          emoji: '💪', desc: 'Mine 50 resources!', check: g => g.stats.totalMined >= 50 },
    firstSale:      { name: 'Money Maker!',         emoji: '💰', desc: 'Sell something!', check: g => g.stats.totalSold >= 1 },
    bigSeller:      { name: 'Rich Trader!',         emoji: '🤑', desc: 'Earn 2,000 coins selling!', check: g => g.stats.creditsEarned >= 2000 },
    megaRich:       { name: 'Space Millionaire!',   emoji: '👑', desc: 'Have 10,000 coins!', check: g => g.credits >= 10000 },
    firstUpgrade:   { name: 'Level Up!',            emoji: '⬆️', desc: 'Buy your first upgrade!', check: g => Object.values(g.upgrades).some(v => v >= 2) },
    explorer:       { name: 'Explorer!',            emoji: '🗺️', desc: 'Visit 5 different places!', check: g => (g.visited || []).length >= 5 },
    rareFind:       { name: 'Rare Find!',           emoji: '💎', desc: 'Find a rare resource!', check: g => g.foundRare },
    legendaryFind:  { name: 'LEGENDARY!',           emoji: '🦄', desc: 'Find a legendary resource!', check: g => g.foundLegendary },
    fullUpgrade:    { name: 'Maxed Out!',           emoji: '🌟', desc: 'Max out any upgrade!', check: g => Object.values(g.upgrades).some(v => v >= 5) },
    allPlaces:      { name: 'Galaxy Master!',       emoji: '🌌', desc: 'Visit every place!', check: g => (g.visited || []).length >= Object.keys(LOCATIONS).length },
    firstCombatWin: { name: 'Space Fighter!',       emoji: '⚔️', desc: 'Win your first battle!', check: g => (g.combatStats ? g.combatStats.wins : 0) >= 1 },
    combatPro:      { name: 'Battle Hero!',         emoji: '🦸', desc: 'Win 10 battles!', check: g => (g.combatStats ? g.combatStats.wins : 0) >= 10 },
    bossSlayer:     { name: 'Boss Slayer!',         emoji: '👑', desc: 'Defeat a boss!', check: g => (g.bossesDefeated || []).length >= 1 },
    dragonSlayer:   { name: 'Dragon Slayer!!',      emoji: '🐉', desc: 'Defeat ALL bosses!', check: g => (g.bossesDefeated || []).length >= Object.keys(BOSSES).length },
};

// ─── BUDDY TIPS ────────────────────────────────────────────

function getBuddyTip() {
    if (!game) return { msg: "Hi! I'm Bleep! Let's explore space!", emoji: '🤖' };
    const loc = LOCATIONS[game.currentLocation];

    if (game.fuel <= 15 && loc.canRefuel)
        return { msg: "Fuel is super low! Hit the refuel button!", emoji: '😰' };
    if (game.fuel <= 15 && !loc.canRefuel)
        return { msg: "Uh oh, fuel is low! Fly to a station quick!", emoji: '😱' };
    if (getCargoUsed() >= getMaxCargo() && !loc.canTrade)
        return { msg: "Backpack full! Fly to a station to sell!", emoji: '🎒' };
    if (getCargoUsed() >= getMaxCargo() && loc.canTrade)
        return { msg: "Backpack full! Sell your treasures!", emoji: '🤩' };
    if (game.stats.tripsCount === 0 && game.currentLocation === 'havenStation')
        return { msg: "Welcome! Click Sandy Planet on the map, then fly there!", emoji: '👋' };
    if (loc.canMine && getCargoUsed() === 0)
        return { msg: "Click Mine for Treasure on the map to dig!", emoji: '🤩' };
    if (loc.canMine && getCargoUsed() > 0 && getCargoUsed() < getMaxCargo() * 0.7)
        return { msg: "Keep mining! Then fly to a station to sell!", emoji: '💪' };
    if (loc.canTrade && getCargoUsed() > 0)
        return { msg: "Sell your stuff! Hit the Sell Everything button!", emoji: '💰' };
    if (loc.canUpgrade && game.credits >= 250)
        return { msg: "You have coins for an upgrade! Check the ⬆ tab!", emoji: '🔧' };
    if (loc.canTrade && getCargoUsed() === 0 && game.fuel > 30)
        return { msg: "Nothing to sell? Fly to a planet and mine!", emoji: '🚀' };

    const bossHere = Object.entries(BOSSES).find(([id, b]) => b.location === game.currentLocation && !(game.bossesDefeated || []).includes(id));
    if (bossHere) return { msg: bossHere[1].emoji + ' ' + bossHere[1].name + ' is here! Challenge them?', emoji: '⚔️' };

    const tips = [
        { msg: "Alien Market pays the MOST for legendary stuff!", emoji: '👽' },
        { msg: "Upgrading engines saves fuel for long trips!", emoji: '🧠' },
        { msg: "The Mystery Zone has the rarest treasures!", emoji: '🌀' },
        { msg: "Sell Star Silver at Explorer's Hideout for extra!", emoji: '⭐' },
        { msg: "Upgrade your Scanner to find rare stuff more!", emoji: '📡' },
        { msg: "You're doing amazing, Captain! 🌟", emoji: '🎉' },
        { msg: "Crystal Caves are full of Rainbow Crystals!", emoji: '💎' },
        { msg: "Bigger backpack = more treasure per trip!", emoji: '🎒' },
        { msg: "Watch out for space baddies during travel! ⚔️", emoji: '🏴\u200d☠️' },
        { msg: "Upgrade your weapons to fight tougher enemies!", emoji: '🔫' },
        { msg: "Stronger shields help survive battles!", emoji: '🔋' },
        { msg: "Challenge bosses on planets for big rewards!", emoji: '👑' },
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// ─── CONFETTI / PARTICLES ──────────────────────────────────

function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c26dff','#ff9ff3','#00d4ff','#ff6348'];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = (Math.random() * 100) + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = (Math.random() * 0.5) + 's';
        piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
        container.appendChild(piece);
    }
    setTimeout(() => container.innerHTML = '', 3500);
}

function spawnMineParticle(container) {
    if (!container) return;
    const emojis = ['💎','⭐','✨','💫','🪨','⚡','🔥','💥'];
    const particle = document.createElement('div');
    particle.className = 'mine-particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = (30 + Math.random() * 40) + '%';
    particle.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
}

// ─── RETRO 80s AUDIO SYSTEM ────────────────────────────────

const RetroAudio = (() => {
    let ctx = null;
    let musicGain = null;
    let sfxGain = null;
    let musicPlaying = false;
    let musicScheduler = null;
    let nextNoteTime = 0;
    let patternIdx = 0;
    let noteIdx = 0;

    const settings = { musicOn: true, sfxOn: true, musicVol: 0.25, sfxVol: 0.5 };

    // Load persisted settings
    try {
        const s = JSON.parse(localStorage.getItem('spaceAdventure_audio'));
        if (s) Object.assign(settings, s);
    } catch (e) {}

    function ensureCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            musicGain = ctx.createGain();
            musicGain.gain.value = settings.musicOn ? settings.musicVol : 0;
            musicGain.connect(ctx.destination);
            sfxGain = ctx.createGain();
            sfxGain.gain.value = settings.sfxOn ? settings.sfxVol : 0;
            sfxGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
    }

    function saveSettings() {
        try { localStorage.setItem('spaceAdventure_audio', JSON.stringify(settings)); } catch (e) {}
    }

    // ── Music: Chiptune space theme ──
    const N = {
        C3:130.81, Eb3:155.56, F3:174.61, G3:196.00, Ab3:207.65, Bb3:233.08,
        C4:261.63, Eb4:311.13, F4:349.23, G4:392.00, Ab4:415.30, Bb4:466.16,
        C5:523.25, Eb5:622.25, F5:698.46, G5:783.99, R:0,
    };

    const BPM = 120;
    const STEP = 60 / BPM / 2;

    // Each note: [frequency, duration_in_steps]
    const PATTERNS = [
        // A: Dreamy ascending arp
        [[N.C4,2],[N.Eb4,2],[N.G4,2],[N.Bb4,2],[N.C5,2],[N.Bb4,2],[N.G4,2],[N.Eb4,2],
         [N.F4,2],[N.Ab4,2],[N.C5,2],[N.Eb5,2],[N.C5,2],[N.Ab4,2],[N.F4,2],[N.R,2]],
        // B: Rhythmic bounce
        [[N.G3,1],[N.R,1],[N.G4,1],[N.R,1],[N.Bb4,2],[N.G4,2],
         [N.F3,1],[N.R,1],[N.F4,1],[N.R,1],[N.Ab4,2],[N.F4,2],
         [N.Eb3,1],[N.R,1],[N.Eb4,1],[N.R,1],[N.G4,2],[N.Eb4,2]],
        // C: Higher melody
        [[N.C5,3],[N.Bb4,1],[N.G4,2],[N.Eb4,2],[N.F4,3],[N.Eb4,1],[N.C4,2],[N.R,2],
         [N.G4,3],[N.F4,1],[N.Eb4,2],[N.C4,2],[N.Eb4,3],[N.R,1],[N.C4,2],[N.R,2]],
    ];

    function scheduleMusicNote() {
        if (!musicPlaying || !ctx) return;

        while (nextNoteTime < ctx.currentTime + 0.15) {
            const pattern = PATTERNS[patternIdx];
            const [freq, steps] = pattern[noteIdx];
            const dur = steps * STEP;

            if (freq > 0) {
                // Lead voice (square wave)
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = freq;
                const env = ctx.createGain();
                env.gain.setValueAtTime(0, nextNoteTime);
                env.gain.linearRampToValueAtTime(0.09, nextNoteTime + 0.015);
                env.gain.setValueAtTime(0.06, nextNoteTime + dur * 0.3);
                env.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + dur * 0.95);
                osc.connect(env);
                env.connect(musicGain);
                osc.start(nextNoteTime);
                osc.stop(nextNoteTime + dur);

                // Sub bass (triangle, every 4th note)
                if (noteIdx % 4 === 0) {
                    const bass = ctx.createOscillator();
                    bass.type = 'triangle';
                    bass.frequency.value = freq / 4;
                    const benv = ctx.createGain();
                    benv.gain.setValueAtTime(0.05, nextNoteTime);
                    benv.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + STEP * 4);
                    bass.connect(benv);
                    benv.connect(musicGain);
                    bass.start(nextNoteTime);
                    bass.stop(nextNoteTime + STEP * 4);
                }
            }

            nextNoteTime += dur;
            noteIdx++;
            if (noteIdx >= pattern.length) {
                noteIdx = 0;
                patternIdx = (patternIdx + 1) % PATTERNS.length;
            }
        }

        musicScheduler = setTimeout(scheduleMusicNote, 80);
    }

    function startMusic() {
        if (musicPlaying || !settings.musicOn) return;
        ensureCtx();
        musicPlaying = true;
        nextNoteTime = ctx.currentTime + 0.1;
        noteIdx = 0;
        scheduleMusicNote();
    }

    function stopMusic() {
        musicPlaying = false;
        if (musicScheduler) { clearTimeout(musicScheduler); musicScheduler = null; }
    }

    // ── SFX helpers ──
    function playTone(freq, dur, type, vol) {
        if (!settings.sfxOn || !ctx) return;
        const osc = ctx.createOscillator();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        const env = ctx.createGain();
        env.gain.setValueAtTime(vol || 0.12, ctx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(env);
        env.connect(sfxGain);
        osc.start();
        osc.stop(ctx.currentTime + dur + 0.01);
    }

    function playSeq(notes, spacing, type, vol) {
        if (!settings.sfxOn) return;
        ensureCtx();
        const t = ctx.currentTime;
        notes.forEach((f, i) => {
            if (f <= 0) return;
            const osc = ctx.createOscillator();
            osc.type = type || 'square';
            osc.frequency.value = f;
            const env = ctx.createGain();
            env.gain.setValueAtTime(vol || 0.1, t + i * spacing);
            env.gain.exponentialRampToValueAtTime(0.001, t + i * spacing + spacing * 1.8);
            osc.connect(env);
            env.connect(sfxGain);
            osc.start(t + i * spacing);
            osc.stop(t + i * spacing + spacing * 2);
        });
    }

    // ── SFX library ──
    function sfx(type) {
        if (!settings.sfxOn) return;
        ensureCtx();
        switch (type) {
            case 'click': playTone(800, 0.04, 'square', 0.06); break;
            case 'mine-tap': playTone(200 + Math.random() * 400, 0.06, 'square', 0.08); break;
            case 'mine-find': playSeq([440, 554, 659], 0.08, 'square', 0.1); break;
            case 'rare': playSeq([659, 784, 988, 1175], 0.07, 'square', 0.12); break;
            case 'legendary': playSeq([523, 659, 784, 1047, 1319, 1568], 0.09, 'square', 0.14); break;
            case 'sell': playSeq([1200, 1600], 0.06, 'square', 0.08); break;
            case 'sell-all': playSeq([800, 1000, 1200, 1600], 0.06, 'square', 0.1); break;
            case 'buy': playTone(600, 0.12, 'triangle', 0.1); break;
            case 'travel': {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
                const env = ctx.createGain();
                env.gain.setValueAtTime(0.08, ctx.currentTime);
                env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.connect(env); env.connect(sfxGain);
                osc.start(); osc.stop(ctx.currentTime + 0.55);
                break;
            }
            case 'upgrade': playSeq([523, 659, 784, 1047], 0.1, 'square', 0.1); break;
            case 'achievement': playSeq([523, 659, 784, 1047, 784, 1047, 1319], 0.1, 'square', 0.12); break;
            case 'refuel': {
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.25);
                const env = ctx.createGain();
                env.gain.setValueAtTime(0.1, ctx.currentTime);
                env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc.connect(env); env.connect(sfxGain);
                osc.start(); osc.stop(ctx.currentTime + 0.35);
                break;
            }
            case 'error': playSeq([200, 150], 0.1, 'square', 0.1); break;
            case 'newgame': playSeq([262, 330, 392, 523, 659, 784], 0.12, 'square', 0.1); break;
            case 'combat-start': playSeq([200, 300, 200, 400], 0.08, 'square', 0.1); break;
            case 'boss-appear': playSeq([100, 150, 200, 300, 400, 500], 0.1, 'sawtooth', 0.12); break;
            case 'attack': playSeq([600, 900, 1200], 0.04, 'square', 0.1); break;
            case 'player-hit': playSeq([400, 200, 100], 0.06, 'square', 0.1); break;
            case 'combat-win': playSeq([523, 659, 784, 1047, 1319, 1568], 0.1, 'square', 0.13); break;
            case 'combat-lose': playSeq([400, 300, 200, 100], 0.12, 'triangle', 0.1); break;
            case 'flee': {
                const osc = ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
                const env = ctx.createGain();
                env.gain.setValueAtTime(0.08, ctx.currentTime);
                env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                osc.connect(env); env.connect(sfxGain);
                osc.start(); osc.stop(ctx.currentTime + 0.4);
                break;
            }
        }
    }

    // ── Settings API ──
    function setMusicOn(on) {
        settings.musicOn = on;
        if (on) { if (musicGain) musicGain.gain.value = settings.musicVol; startMusic(); }
        else { stopMusic(); if (musicGain) musicGain.gain.value = 0; }
        saveSettings();
    }
    function setSfxOn(on) {
        settings.sfxOn = on;
        if (sfxGain) sfxGain.gain.value = on ? settings.sfxVol : 0;
        saveSettings();
    }
    function setMusicVol(v) {
        settings.musicVol = v;
        if (musicGain && settings.musicOn) musicGain.gain.value = v;
        saveSettings();
    }
    function setSfxVol(v) {
        settings.sfxVol = v;
        if (sfxGain && settings.sfxOn) sfxGain.gain.value = v;
        saveSettings();
    }

    return { startMusic, stopMusic, sfx, ensureCtx, setMusicOn, setSfxOn, setMusicVol, setSfxVol,
             get settings() { return { ...settings }; } };
})();

// ─── GAME STATE ────────────────────────────────────────────

let game = null;
let activeSlot = 0;
let miningInterval = null;
let miningTimeout = null;
let currentPrices = {};

function newGameState() {
    return {
        difficulty: 'normal',
        credits: 1000,
        fuel: 100,
        currentLocation: 'havenStation',
        cargo: {},
        upgrades: {
            miningLaser: 1, cargoHold: 1, fuelTank: 1,
            engines: 1, scanner: 1, hull: 1,
            weapons: 1, shields: 1,
        },
        stats: {
            totalMined: 0, totalSold: 0, totalBought: 0,
            creditsEarned: 0, creditsSpent: 0,
            distanceTraveled: 0, tripsCount: 0,
        },
        events: [],
        activePanel: 'starmap',
        selectedLocation: null,
        mineHistory: [],
        lastMineResult: null,
        achievements: [],
        visited: ['havenStation'],
        foundRare: false,
        foundLegendary: false,
        bossesDefeated: [],
        combatStats: { wins: 0, losses: 0, fled: 0 },
        galaxy: null,
    };
}

// ─── UTILITY FUNCTIONS ─────────────────────────────────────

function getMaxFuel() { return UPGRADES.fuelTank.levels[game.upgrades.fuelTank - 1].capacity; }
function getMaxCargo() { return UPGRADES.cargoHold.levels[game.upgrades.cargoHold - 1].capacity; }
function getCargoUsed() { let t = 0; for (const q of Object.values(game.cargo)) t += q; return t; }
function getMiningTime() { return UPGRADES.miningLaser.levels[game.upgrades.miningLaser - 1].miningTime; }
function getFuelModifier() { return UPGRADES.engines.levels[game.upgrades.engines - 1].fuelMod; }
function getHullAccess() { return UPGRADES.hull.levels[game.upgrades.hull - 1].access; }
function getWeaponDamage() { return UPGRADES.weapons.levels[game.upgrades.weapons - 1].damage; }
function getMaxShield() { return UPGRADES.shields.levels[game.upgrades.shields - 1].maxShield; }

function getDistance(from, to) {
    const a = LOCATIONS[from], b = LOCATIONS[to];
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getFuelCost(from, to) {
    return Math.max(1, Math.ceil(getDistance(from, to) / 25 * getFuelModifier()));
}

function formatCR(n) { return n.toLocaleString() + ' coins'; }
function getRarityClass(rarity) { return 'rarity-' + rarity; }

// ─── ACHIEVEMENT SYSTEM ────────────────────────────────────

function checkAchievements() {
    if (!game.achievements) game.achievements = [];
    for (const [id, ach] of Object.entries(ACHIEVEMENTS)) {
        if (game.achievements.includes(id)) continue;
        if (ach.check(game)) {
            game.achievements.push(id);
            showAchievement(ach);
        }
    }
}

function showAchievement(ach) {
    RetroAudio.sfx('achievement');
    spawnConfetti();
    const el = document.createElement('div');
    el.className = 'achievement-popup';
    el.innerHTML =
        '<div class="achievement-emoji">' + ach.emoji + '</div>' +
        '<div class="achievement-content">' +
            '<div class="achievement-label">🏆 ACHIEVEMENT!</div>' +
            '<div class="achievement-name">' + ach.name + '</div>' +
            '<div class="achievement-desc">' + ach.desc + '</div>' +
        '</div>';
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 50);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 3500);
}

// ─── TRAVEL ANIMATION ─────────────────────────────────────

let travelAnimating = false;

function showTravelAnimation(fromId, toId, callback) {
    const fromLoc = LOCATIONS[fromId];
    const toLoc = LOCATIONS[toId];
    const overlay = document.getElementById('travel-overlay');

    document.getElementById('travel-from-emoji').textContent = fromLoc.emoji;
    document.getElementById('travel-to-emoji').textContent = toLoc.emoji;
    document.getElementById('travel-dest-text').textContent = 'Flying to ' + toLoc.name + '! ' + toLoc.emoji;

    // Generate star streaks
    const starsContainer = document.getElementById('travel-stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 35; i++) {
        const streak = document.createElement('div');
        streak.className = 'travel-star-streak';
        streak.style.top = (Math.random() * 100) + '%';
        streak.style.width = (30 + Math.random() * 100) + 'px';
        streak.style.setProperty('--dur', (0.25 + Math.random() * 0.55) + 's');
        streak.style.setProperty('--delay', (Math.random() * 0.4) + 's');
        streak.style.opacity = (0.3 + Math.random() * 0.7).toFixed(2);
        starsContainer.appendChild(streak);
    }

    travelAnimating = true;
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
        travelAnimating = false;
        starsContainer.innerHTML = '';
        callback();
    }, 1600);
}

// ─── CORE GAME LOGIC ──────────────────────────────────────

let pendingTravel = null;

function travel(locationId) {
    if (locationId === game.currentLocation || travelAnimating) return;

    const loc = LOCATIONS[locationId];
    const cost = getFuelCost(game.currentLocation, locationId);

    if (loc.canMine && loc.dangerLevel > getHullAccess()) {
        showToast('Ship needs stronger armor! 🛡️', 'error');
        addLog("Can't go to " + loc.name + ' — need Armor Level ' + loc.dangerLevel + '!', 'warning');
        return;
    }

    if (game.fuel < cost) {
        showToast('Not enough fuel! ⛽', 'error');
        addLog('Need ' + cost + ' fuel for ' + loc.name + ', have ' + game.fuel + '!', 'warning');
        return;
    }

    const fromId = game.currentLocation;
    RetroAudio.sfx('travel');

    showTravelAnimation(fromId, locationId, () => {
        game.fuel -= cost;
        game.stats.distanceTraveled += Math.round(getDistance(fromId, locationId));
        game.stats.tripsCount++;

        // Random encounter check based on route danger + difficulty
        const maxDanger = Math.max(LOCATIONS[fromId].dangerLevel, loc.dangerLevel);
        const encounterChance = maxDanger > 0 ? Math.min(0.6, (0.12 + maxDanger * 0.10) * getDifficulty().encounterMult) : 0;

        if (encounterChance > 0 && Math.random() < encounterChance) {
            pendingTravel = locationId;
            const enemy = pickRandomEnemy(maxDanger);
            startCombat(enemy, false, null);
            return;
        }

        arriveAt(locationId);
    });
}

function arriveAt(locationId) {
    const loc = LOCATIONS[locationId];
    game.currentLocation = locationId;
    game.selectedLocation = locationId;

    if (!game.visited) game.visited = [];
    if (!game.visited.includes(locationId)) game.visited.push(locationId);

    addLog('🚀 Arrived at ' + loc.emoji + ' ' + loc.name + '!', 'travel');

    if (game.fuel <= getMaxFuel() * 0.15)
        addLog('⚠️ Fuel getting low! (' + game.fuel + ' left)', 'warning');

    if (loc.canTrade) generatePrices(locationId);
    if (Math.random() < 0.2) triggerMarketEvent();

    cancelMining();
    updateAll();
    checkAchievements();
    saveGame();
}

function generatePrices(locationId) {
    currentPrices = {};
    const loc = LOCATIONS[locationId];
    for (const resId of loc.tradeResources) {
        const res = RESOURCES[resId];
        const mod = loc.priceModifiers[resId] || 1.0;
        let sell = Math.max(1, Math.round(res.basePrice * mod * (0.88 + Math.random() * 0.24)));
        let buy = Math.max(1, Math.round(res.basePrice * 1.35 * (2 - mod) * (0.88 + Math.random() * 0.24)));
        // Prevent infinite money: buy must always cost more than sell pays
        if (buy <= sell) buy = Math.round(sell * (1.15 + Math.random() * 0.15));
        currentPrices[resId] = { sell, buy };
    }
}

function sellResource(resId, qty) {
    if (!currentPrices[resId]) return;
    const amount = Math.min(qty, game.cargo[resId] || 0);
    if (amount <= 0) return;
    const revenue = amount * currentPrices[resId].sell;
    game.cargo[resId] -= amount;
    RetroAudio.sfx('sell');
    if (game.cargo[resId] <= 0) delete game.cargo[resId];
    game.credits += revenue;
    game.stats.totalSold += amount;
    game.stats.creditsEarned += revenue;
    addLog('💰 Sold ' + amount + 'x ' + RESOURCES[resId].symbol + ' ' + RESOURCES[resId].name + ' for ' + formatCR(revenue) + '!', 'trade');
    showToast('+ ' + formatCR(revenue) + '! 💰', 'success');
    updateAll();
    checkAchievements();
    saveGame();
}

function sellAllCargo() {
    const loc = LOCATIONS[game.currentLocation];
    if (!loc.canTrade) return;
    RetroAudio.sfx('sell-all');
    let totalRevenue = 0, totalItems = 0;
    for (const [resId, qty] of Object.entries(game.cargo)) {
        if (qty <= 0) continue;
        const price = currentPrices[resId] ? currentPrices[resId].sell : Math.max(1, Math.round(RESOURCES[resId].basePrice * 0.5));
        totalRevenue += qty * price;
        totalItems += qty;
    }
    if (totalItems === 0) { showToast('Nothing to sell!', 'info'); return; }
    game.cargo = {};
    game.credits += totalRevenue;
    game.stats.totalSold += totalItems;
    game.stats.creditsEarned += totalRevenue;
    addLog('🎉 SOLD EVERYTHING! ' + totalItems + ' items for ' + formatCR(totalRevenue) + '!', 'trade');
    showToast('🎉 + ' + formatCR(totalRevenue) + '!!', 'success');
    spawnConfetti();
    updateAll();
    checkAchievements();
    saveGame();
}

function buyResource(resId, qty) {
    if (!currentPrices[resId]) return;
    const maxAfford = Math.floor(game.credits / currentPrices[resId].buy);
    const maxCargo = getMaxCargo() - getCargoUsed();
    const amount = Math.min(qty, maxAfford, maxCargo);
    if (amount <= 0) {
        showToast(maxCargo <= 0 ? 'Backpack full! 🎒' : 'Need more coins! 💰', 'error');
        return;
    }
    const cost = amount * currentPrices[resId].buy;
    game.cargo[resId] = (game.cargo[resId] || 0) + amount;
    game.credits -= cost;
    game.stats.totalBought += amount;
    RetroAudio.sfx('buy');
    game.stats.creditsSpent += cost;
    addLog('🛒 Bought ' + amount + 'x ' + RESOURCES[resId].symbol + ' ' + RESOURCES[resId].name + ' for ' + formatCR(cost), 'trade');
    updateAll();
    saveGame();
}

function refuel(amount) {
    const loc = LOCATIONS[game.currentLocation];
    if (!loc.canRefuel) return;
    const maxNeed = getMaxFuel() - game.fuel;
    const qty = Math.min(amount, maxNeed);
    if (qty <= 0) { showToast('Tank full! ⛽', 'info'); return; }
    const maxAfford = Math.floor(game.credits / loc.fuelPrice);
    const actual = Math.min(qty, maxAfford);
    if (actual <= 0) { showToast('Need more coins! 💰', 'error'); return; }
    const cost = actual * loc.fuelPrice;
    game.fuel += actual;
    game.credits -= cost;
    game.stats.creditsSpent += cost;
    RetroAudio.sfx('refuel');
    addLog('⛽ +' + actual + ' fuel for ' + formatCR(cost) + '!', 'trade');
    showToast('⛽ +' + actual + ' fuel!', 'success');
    updateAll();
    saveGame();
}

function purchaseUpgrade(upgradeId) {
    const current = game.upgrades[upgradeId];
    if (current >= 5) { showToast('Already max! 🌟', 'info'); return; }
    const nextLevel = UPGRADES[upgradeId].levels[current];
    if (game.credits < nextLevel.cost) { showToast('Need more coins! 💰', 'error'); return; }
    game.credits -= nextLevel.cost;
    game.stats.creditsSpent += nextLevel.cost;
    game.upgrades[upgradeId] = current + 1;
    RetroAudio.sfx('upgrade');
    addLog('⬆️ ' + UPGRADES[upgradeId].name + ' → Level ' + (current + 1) + '! 🎉', 'upgrade');
    showToast('⬆️ ' + UPGRADES[upgradeId].name + ' Lv' + (current + 1) + '!', 'success');
    spawnConfetti();
    if (upgradeId === 'fuelTank' && game.fuel > getMaxFuel()) game.fuel = getMaxFuel();
    updateAll();
    checkAchievements();
    saveGame();
}

// ─── MINING SYSTEM (Click-to-Mine!) ────────────────────────

let isMining = false;
let miningProgress = 0;
let mineClicksEnabled = false;
let quickMineActive = false;
let quickMineTimer = null;

function startMining() {
    const loc = LOCATIONS[game.currentLocation];
    if (!loc.canMine || isMining) return;
    if (getCargoUsed() >= getMaxCargo()) { showToast('Backpack full! 🎒', 'error'); return; }

    game.lastMineResult = null;
    isMining = true;
    miningProgress = 0;
    mineClicksEnabled = true;

    const duration = getMiningTime();
    const step = 50;
    addLog('⛏️ Mining on ' + loc.emoji + ' ' + loc.name + '...', 'mine');

    miningInterval = setInterval(() => {
        miningProgress += (step / duration) * 60;
        if (miningProgress >= 100) miningProgress = 100;
        updateMiningProgressBar();
        if (miningProgress >= 100) finishMining();
    }, step);

    renderMining();
}

function onMineClick() {
    if (!isMining || !mineClicksEnabled) return;
    RetroAudio.sfx('mine-tap');
    miningProgress = Math.min(100, miningProgress + 3 + Math.random() * 4);
    const container = document.getElementById('mine-particles');
    spawnMineParticle(container);
    const btn = document.getElementById('mine-tap-btn');
    if (btn) { btn.classList.remove('squish'); void btn.offsetWidth; btn.classList.add('squish'); }
    updateMiningProgressBar();

    const floater = document.createElement('div');
    floater.className = 'click-floater';
    const words = ['DIG!', 'NICE!', 'BOOM!', 'WOW!', 'GO!', 'YES!', 'POW!'];
    floater.textContent = words[Math.floor(Math.random() * words.length)];
    const area = document.querySelector('.mining-area');
    if (area) {
        floater.style.left = (30 + Math.random() * 40) + '%';
        area.appendChild(floater);
        setTimeout(() => floater.remove(), 800);
    }
    if (miningProgress >= 100) finishMining();
}

function finishMining() {
    if (miningInterval) clearInterval(miningInterval);
    if (miningTimeout) clearTimeout(miningTimeout);
    miningInterval = null;
    miningTimeout = null;
    isMining = false;
    mineClicksEnabled = false;
    miningProgress = 100;
    completeMining();
}

function cancelMining() {
    if (miningInterval) clearInterval(miningInterval);
    if (miningTimeout) clearTimeout(miningTimeout);
    miningInterval = null;
    miningTimeout = null;
    isMining = false;
    mineClicksEnabled = false;
    miningProgress = 0;
    cancelQuickMine();
}

function completeMining() {
    const loc = LOCATIONS[game.currentLocation];
    const result = rollMiningResult(loc);
    if (!result) {
        addLog("Didn't find anything! Try again! 🤷", 'warning');
        renderMining();
        return;
    }
    const resId = result.resourceId;
    const res = RESOURCES[resId];
    const actual = Math.min(result.quantity, getMaxCargo() - getCargoUsed());
    game.cargo[resId] = (game.cargo[resId] || 0) + actual;
    game.stats.totalMined += actual;

    if (res.rarity === 'rare') game.foundRare = true;
    if (res.rarity === 'legendary') game.foundLegendary = true;

    RetroAudio.sfx(res.rarity === 'legendary' ? 'legendary' : res.rarity === 'rare' ? 'rare' : 'mine-find');

    const tag = res.rarity === 'legendary' ? '🦄🦄🦄 LEGENDARY!!! ' :
                res.rarity === 'rare' ? '💎💎 RARE!! ' :
                res.rarity === 'uncommon' ? '⭐ Nice! ' : '';
    addLog(tag + 'Found ' + actual + 'x ' + res.symbol + ' ' + res.name + '!', 'mine');

    game.mineHistory.unshift({ resId, qty: actual, rarity: res.rarity });
    if (game.mineHistory.length > 20) game.mineHistory.pop();
    game.lastMineResult = { resId, qty: actual, rarity: res.rarity };

    if (res.rarity === 'legendary' || res.rarity === 'rare') spawnConfetti();

    updateAll();
    checkAchievements();
    saveGame();
}

function rollMiningResult(loc) {
    const laserLevel = game.upgrades.miningLaser;
    const scannerBonus = UPGRADES.scanner.levels[game.upgrades.scanner - 1].rareBonus;
    let candidates = [], totalWeight = 0;

    for (const entry of loc.resources) {
        const res = RESOURCES[entry.id];
        const rarityIdx = RARITY_ORDER[res.rarity];
        let accessMult = LASER_ACCESS[laserLevel - 1][rarityIdx];
        if (rarityIdx >= 2) accessMult *= (1 + scannerBonus);
        if (rarityIdx >= 3 && game.upgrades.scanner >= 5) accessMult *= 1.15;
        const weight = entry.weight * accessMult;
        if (weight > 0) { candidates.push({ id: entry.id, weight }); totalWeight += weight; }
    }

    if (candidates.length === 0 || totalWeight === 0) return null;

    let roll = Math.random() * totalWeight;
    let chosen = candidates[0].id;
    for (const c of candidates) { roll -= c.weight; if (roll <= 0) { chosen = c.id; break; } }

    const res = RESOURCES[chosen];
    let qty = 1;
    if (res.rarity === 'common') qty += Math.floor(Math.random() * 4);
    else if (res.rarity === 'uncommon') qty += Math.floor(Math.random() * 3);
    if (Math.random() < 0.10 * laserLevel) qty++;
    if (game.upgrades.hull >= 5 && Math.random() < 0.2) qty++;

    return { resourceId: chosen, quantity: qty };
}

// ─── QUICK MINE (from star map) ────────────────────────────

function startQuickMine() {
    const loc = LOCATIONS[game.currentLocation];
    if (!loc.canMine || quickMineActive || isMining) return;
    if (getCargoUsed() >= getMaxCargo()) { showToast('Backpack full! 🎒', 'error'); return; }

    quickMineActive = true;
    game.lastMineResult = null;

    addLog('⛏️ Mining on ' + loc.emoji + ' ' + loc.name + '...', 'mine');

    // Update button to show mining state
    const btn = document.getElementById('quick-mine-btn');
    if (btn) { btn.textContent = '⛏️ Mining...'; btn.disabled = true; }

    quickMineTimer = setTimeout(() => {
        quickMineActive = false;
        quickMineTimer = null;
        completeMining();
    }, getMiningTime());
}

function cancelQuickMine() {
    if (quickMineTimer) clearTimeout(quickMineTimer);
    quickMineTimer = null;
    quickMineActive = false;
}

// ─── MARKET EVENTS ─────────────────────────────────────────

function triggerMarketEvent() {
    const events = [
        { msg: '📡 A friendly alien said hi!' },
        { msg: '📡 You saw a shooting star! 🌠' },
        { msg: '📡 Space whales spotted! 🐋' },
        { msg: '📡 A space puppy floated by! 🐶' },
        { msg: '📡 Space cat says meow! 🐱' },
        { msg: '📡 A tiny robot waved! 🤖' },
        { msg: '📡 You flew through a rainbow! 🌈' },
        { msg: '📡 Found a Space Penny! +1 coin!', credits: 1 },
        { msg: '📡 A comet left behind 3 coins! ☄️', credits: 3 },
        { msg: '📡 Lucky space clover! +10 coins! 🍀', credits: 10 },
        { msg: '📡 Helpful drone gave you 5 fuel! ⛽', fuel: 5 },
        { msg: '📡 Tiny asteroid bump! Lost 2 fuel... 💫', fuel: -2 },
    ];
    const evt = events[Math.floor(Math.random() * events.length)];
    addLog(evt.msg, 'market');
    if (evt.credits) game.credits = Math.max(0, game.credits + evt.credits);
    if (evt.fuel) game.fuel = Math.max(1, Math.min(getMaxFuel(), game.fuel + evt.fuel));
}

// ─── COMBAT SYSTEM ─────────────────────────────────────────

let combatState = null;

function pickRandomEnemy(dangerLevel) {
    const diff = getDifficulty();
    const eligible = ENEMIES.filter(e => e.tier <= Math.max(1, dangerLevel));
    const picked = eligible[Math.floor(Math.random() * eligible.length)];
    const hpScale = (0.85 + dangerLevel * 0.12 + Math.random() * 0.2) * diff.enemyHpMult;
    return { ...picked, hp: Math.round(picked.hp * hpScale), attack: Math.round(picked.attack * diff.enemyAtkMult) };
}

function startCombat(enemyData, isBoss, bossId) {
    const maxShield = getMaxShield();
    combatState = {
        enemy: enemyData,
        enemyHp: enemyData.hp,
        enemyMaxHp: enemyData.hp,
        playerShield: maxShield,
        maxShield: maxShield,
        isBoss: !!isBoss,
        bossId: bossId,
        turnPhase: 'player',
        log: [],
    };
    combatState.log.push(enemyData.emoji + ' ' + enemyData.name + ' appeared!');
    RetroAudio.sfx(isBoss ? 'boss-appear' : 'combat-start');
    renderCombat();
    document.getElementById('combat-overlay').classList.add('active');
}

function combatAttack() {
    if (!combatState || combatState.turnPhase !== 'player') return;

    const baseDmg = getWeaponDamage();
    const damage = baseDmg + Math.floor(Math.random() * baseDmg * 0.4);
    combatState.enemyHp = Math.max(0, combatState.enemyHp - damage);

    const words = ['POW!', 'ZAP!', 'BOOM!', 'WHAM!', 'KAPOW!', 'BAM!'];
    combatState.log.push('⚔️ ' + words[Math.floor(Math.random() * words.length)] + ' Hit for ' + damage + ' damage!');
    RetroAudio.sfx('attack');

    if (combatState.enemyHp <= 0) { combatWin(); return; }

    combatState.turnPhase = 'enemy';
    renderCombat();
    setTimeout(() => {
        if (!combatState || combatState.turnPhase !== 'enemy') return;
        enemyTurn();
    }, 600);
}

function enemyTurn() {
    const enemy = combatState.enemy;
    const baseDmg = enemy.attack;
    const damage = baseDmg + Math.floor(Math.random() * baseDmg * 0.4);
    combatState.playerShield = Math.max(0, combatState.playerShield - damage);

    const words = ['OUCH!', 'OOF!', 'YIKES!', 'BONK!', 'CRASH!', 'BAM!'];
    combatState.log.push(enemy.emoji + ' ' + words[Math.floor(Math.random() * words.length)] + ' ' + enemy.name + ' hits for ' + damage + '!');
    RetroAudio.sfx('player-hit');

    if (combatState.playerShield <= 0) { combatLose(); return; }

    combatState.turnPhase = 'player';
    renderCombat();
}

function combatWin() {
    combatState.turnPhase = 'done';
    const enemy = combatState.enemy;
    const diff = getDifficulty();
    const creditReward = Math.round((combatState.isBoss
        ? enemy.reward
        : (enemy.loot[0] + Math.floor(Math.random() * (enemy.loot[1] - enemy.loot[0])))) * diff.rewardMult);
    game.credits += creditReward;
    game.stats.creditsEarned += creditReward;

    combatState.log.push('🎉 YOU WON! +' + formatCR(creditReward) + '!');

    if (combatState.isBoss && combatState.bossId) {
        if (!game.bossesDefeated) game.bossesDefeated = [];
        if (!game.bossesDefeated.includes(combatState.bossId)) {
            game.bossesDefeated.push(combatState.bossId);
        }
        combatState.log.push('👑 BOSS DEFEATED! ' + enemy.name + ' is no more!');
    }

    if (!game.combatStats) game.combatStats = { wins: 0, losses: 0, fled: 0 };
    game.combatStats.wins++;

    RetroAudio.sfx('combat-win');
    spawnConfetti();
    renderCombat();
    checkAchievements();
    saveGame();
}

function combatLose() {
    combatState.turnPhase = 'done';

    const diff = getDifficulty();
    const lostCredits = Math.floor(game.credits * (0.10 + Math.random() * 0.10) * diff.lossPenaltyMult);
    game.credits = Math.max(0, game.credits - lostCredits);

    let lostItems = 0;
    for (const key of Object.keys(game.cargo)) {
        if (game.cargo[key] <= 0) continue;
        const lose = Math.ceil(game.cargo[key] * (0.10 + Math.random() * 0.15) * diff.lossPenaltyMult);
        game.cargo[key] -= lose;
        lostItems += lose;
        if (game.cargo[key] <= 0) delete game.cargo[key];
    }

    combatState.log.push('💔 Shields down! Lost ' + formatCR(lostCredits) + (lostItems > 0 ? ' and ' + lostItems + ' items!' : '!'));

    if (!game.combatStats) game.combatStats = { wins: 0, losses: 0, fled: 0 };
    game.combatStats.losses++;

    RetroAudio.sfx('combat-lose');
    renderCombat();
    saveGame();
}

function combatFlee() {
    if (!combatState || combatState.turnPhase !== 'player') return;

    const fleeChance = Math.max(0.05, 0.35 + game.upgrades.engines * 0.10 + getDifficulty().fleeBonus);

    if (Math.random() < fleeChance) {
        combatState.turnPhase = 'done';
        combatState.log.push('🏃 Escaped! Phew!');
        if (!game.combatStats) game.combatStats = { wins: 0, losses: 0, fled: 0 };
        game.combatStats.fled++;
        RetroAudio.sfx('flee');
        renderCombat();
        saveGame();
    } else {
        combatState.log.push("🏃 Couldn't escape!");
        combatState.turnPhase = 'enemy';
        renderCombat();
        setTimeout(() => {
            if (!combatState || combatState.turnPhase !== 'enemy') return;
            enemyTurn();
        }, 600);
    }
}

function endCombat() {
    document.getElementById('combat-overlay').classList.remove('active');
    const dest = pendingTravel;
    pendingTravel = null;

    if (dest) {
        arriveAt(dest);
    } else {
        updateAll();
    }
    combatState = null;
}

function challengeBoss(bossId) {
    const boss = BOSSES[bossId];
    if (!boss) return;
    const diff = getDifficulty();
    startCombat({ ...boss, hp: Math.round(boss.hp * diff.bossHpMult), attack: Math.round(boss.attack * diff.bossAtkMult), loot: null }, true, bossId);
}

function renderCombat() {
    if (!combatState) return;
    const cs = combatState;
    const overlay = document.getElementById('combat-overlay');

    const enemyHpPct = Math.max(0, cs.enemyHp / cs.enemyMaxHp * 100).toFixed(1);
    const shieldPct = Math.max(0, cs.playerShield / cs.maxShield * 100).toFixed(1);

    const isDone = cs.turnPhase === 'done';
    const won = isDone && cs.enemyHp <= 0;
    const lost = isDone && cs.playerShield <= 0;
    const fled = isDone && cs.playerShield > 0 && cs.enemyHp > 0;

    let header = cs.isBoss ? '👑 BOSS BATTLE!' : '⚔️ SPACE BATTLE!';
    if (won) header = '🎉 VICTORY!';
    else if (lost) header = '💔 SHIELDS DOWN!';
    else if (fled) header = '🏃 ESCAPED!';

    let actionsHtml = '';
    if (!isDone) {
        const canAct = cs.turnPhase === 'player';
        actionsHtml =
            '<button class="btn btn-combat-attack" onclick="combatAttack()" ' + (canAct ? '' : 'disabled') + '>⚔️ ATTACK!</button>' +
            (cs.isBoss ? '' : '<button class="btn btn-combat-flee" onclick="combatFlee()" ' + (canAct ? '' : 'disabled') + '>🏃 Run Away!</button>');
    } else {
        actionsHtml = '<button class="btn btn-primary btn-large" onclick="endCombat()">✅ Continue</button>';
    }

    const logHtml = cs.log.slice(-6).map(l => '<div class="combat-log-line">' + l + '</div>').join('');

    const shieldColor = shieldPct > 50 ? '#00d4ff' : shieldPct > 25 ? '#ffd93d' : '#ff6b6b';
    const enemyHpColor = enemyHpPct > 50 ? '#ff6b6b' : enemyHpPct > 25 ? '#ffd93d' : '#6bcb77';

    overlay.innerHTML =
        '<div class="combat-scene ' + (won ? 'combat-won' : lost ? 'combat-lost' : fled ? 'combat-fled' : '') + '">' +
            '<div class="combat-header">' + header + '</div>' +
            '<div class="combat-arena">' +
                '<div class="combatant">' +
                    '<div class="combatant-emoji">🚀</div>' +
                    '<div class="combatant-label">Your Ship</div>' +
                    '<div class="combat-bar"><div class="combat-bar-fill" style="width:' + shieldPct + '%;background:' + shieldColor + '"></div></div>' +
                    '<div class="combat-bar-text">🔋 ' + Math.max(0, cs.playerShield) + ' / ' + cs.maxShield + '</div>' +
                '</div>' +
                '<div class="combat-vs">⚡</div>' +
                '<div class="combatant">' +
                    '<div class="combatant-emoji">' + cs.enemy.emoji + '</div>' +
                    '<div class="combatant-label">' + cs.enemy.name + '</div>' +
                    '<div class="combat-bar"><div class="combat-bar-fill" style="width:' + enemyHpPct + '%;background:' + enemyHpColor + '"></div></div>' +
                    '<div class="combat-bar-text">❤️ ' + Math.max(0, cs.enemyHp) + ' / ' + cs.enemyMaxHp + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="combat-log">' + logHtml + '</div>' +
            '<div class="combat-actions">' + actionsHtml + '</div>' +
        '</div>';
}

// ─── EVENT LOG ─────────────────────────────────────────────

function addLog(message, type) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    game.events.unshift({ message, type, time });
    if (game.events.length > 50) game.events.pop();
    renderEventLog();
}

function toggleLog() {
    const bar = document.getElementById('log-bar');
    const icon = document.getElementById('log-toggle-icon');
    if (bar) {
        bar.classList.toggle('collapsed');
        if (icon) icon.textContent = bar.classList.contains('collapsed') ? '▲' : '▼';
    }
}

// ─── TOAST ─────────────────────────────────────────────────

function showToast(message, type) {
    if (type === 'error') RetroAudio.sfx('error');
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
}

// ─── UI RENDERING ──────────────────────────────────────────

function updateAll() {
    updateStatusBar();
    updateBuddyTip();
    const panel = game.activePanel;
    if (panel === 'starmap') renderStarMap();
    else if (panel === 'mining') renderMining();
    else if (panel === 'trading') renderTrading();
    else if (panel === 'upgrades') renderUpgrades();
    else if (panel === 'ship') renderShip();
    else if (panel === 'settings') renderSettings();
}

function updateStatusBar() {
    const maxFuel = getMaxFuel(), maxCargo = getMaxCargo(), cargoUsed = getCargoUsed();
    const maxShield = getMaxShield(), shieldLvl = game.upgrades.shields, maxLvl = UPGRADES.shields.levels.length;
    document.getElementById('credits-value').textContent = '💰 ' + formatCR(game.credits);
    document.getElementById('fuel-value').textContent = game.fuel + '/' + maxFuel;
    document.getElementById('cargo-value').textContent = cargoUsed + '/' + maxCargo;
    document.getElementById('shield-value').textContent = '🔋 ' + maxShield;
    document.getElementById('location-value').textContent = LOCATIONS[game.currentLocation].emoji + ' ' + LOCATIONS[game.currentLocation].name;
    document.getElementById('fuel-bar').style.width = (game.fuel / maxFuel * 100) + '%';
    document.getElementById('cargo-bar').style.width = (cargoUsed / maxCargo * 100) + '%';
    document.getElementById('shield-bar').style.width = (shieldLvl / maxLvl * 100) + '%';
}

function updateBuddyTip() {
    const el = document.getElementById('buddy-message');
    if (!el) return;
    const tip = getBuddyTip();
    el.innerHTML = '<span class="buddy-emoji">' + tip.emoji + '</span> <span class="buddy-text">' + tip.msg + '</span>';
}

function showPanel(panelId) {
    RetroAudio.sfx('click');
    game.activePanel = panelId;
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + panelId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.panel === panelId));
    cancelMining();
    updateAll();
}

// ═══════════════════════════════════════════════════════════
// STAR MAP — Side-by-side with integrated quick actions
// ═══════════════════════════════════════════════════════════

function renderStarMap() {
    const panel = document.getElementById('panel-starmap');
    const currentLoc = game.currentLocation;
    const selected = game.selectedLocation || currentLoc;

    // Stars background
    let starsHtml = '';
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * 100, y = Math.random() * 100;
        const size = Math.random() < 0.15 ? 2 : 1;
        const op = (0.3 + Math.random() * 0.7).toFixed(2);
        const dur = (3 + Math.random() * 4).toFixed(1);
        const delay = (Math.random() * 5).toFixed(1);
        starsHtml += '<div class="star" style="left:' + x + '%;top:' + y + '%;width:' + size + 'px;height:' + size + 'px;--base-op:' + op + ';--dur:' + dur + 's;--delay:-' + delay + 's"></div>';
    }

    // Map nodes
    let nodesHtml = '';
    for (const [id, loc] of Object.entries(LOCATIONS)) {
        const isCurrent = id === currentLoc;
        const isSelected = id === selected;
        const typeClass = loc.type === 'station' ? 'station' : 'planet';
        const extra = (isCurrent ? ' current' : '') + (isSelected ? ' selected' : '');
        const mapX = (loc.x / 800 * 100).toFixed(1);
        const mapY = (loc.y / 500 * 100).toFixed(1);
        nodesHtml += '<div class="map-node ' + typeClass + extra + '" data-loc="' + id + '" style="left:' + mapX + '%;top:' + mapY + '%">' +
            '<div class="map-node-emoji">' + loc.emoji + '</div>' +
            '<div class="map-node-label">' + loc.name + '</div></div>';
    }

    // Info panel content
    const sel = LOCATIONS[selected];
    const isHere = selected === currentLoc;
    const fuelCost = isHere ? 0 : getFuelCost(currentLoc, selected);
    const canAffordFuel = game.fuel >= fuelCost;
    const hullOk = !sel.canMine || sel.dangerLevel <= getHullAccess();

    let services = '';
    if (sel.canMine) services += '<span class="service-badge mine">⛏️ Mine</span>';
    if (sel.canTrade) services += '<span class="service-badge">💰 Trade</span>';
    if (sel.canRefuel) services += '<span class="service-badge">⛽ Fuel</span>';
    if (sel.canUpgrade) services += '<span class="service-badge upgrade-badge">⬆️ Upgrades</span>';

    let dangerHtml = '';
    if (sel.dangerLevel > 0) {
        dangerHtml = '<span class="service-badge danger">Danger: ' + '⭐'.repeat(sel.dangerLevel) + '☆'.repeat(5 - sel.dangerLevel) + '</span>';
        if (sel.dangerLevel > getHullAccess())
            dangerHtml += '<span class="service-badge danger">🛡️ Need Armor Lv' + sel.dangerLevel + '</span>';
    }

    let resourcesHtml = '';
    if (sel.canMine) {
        const pills = sel.resources.map(r => {
            const res = RESOURCES[r.id];
            return '<span class="resource-pill ' + res.rarity + '">' + res.symbol + ' ' + res.name + '</span>';
        }).join('');
        resourcesHtml = '<div class="section-title">🎁 Treasures</div><div class="mining-resources">' + pills + '</div>';
    }

    // Travel button or "You are here" + quick actions
    let actionHtml = '';
    if (isHere) {
        actionHtml = '<div class="you-are-here">📍 You are here!</div>';
        actionHtml += buildQuickActions(sel);
    } else {
        let btnLabel = '🚀 Fly There!';
        let btnDisabled = '';
        if (!hullOk) { btnLabel = '🛡️ Armor Too Weak!'; btnDisabled = ' disabled'; }
        else if (!canAffordFuel) { btnLabel = '⛽ Not Enough Fuel!'; btnDisabled = ' disabled'; }

        actionHtml = '<div class="starmap-travel">' +
            '<span class="fuel-cost">⛽ ' + fuelCost + ' fuel</span>' +
            '<button class="btn btn-primary btn-large" onclick="travel(\'' + selected + '\')"' + btnDisabled + '>' + btnLabel + '</button>' +
        '</div>';
    }

    // Assemble side-by-side layout
    panel.innerHTML =
        '<div class="starmap-layout">' +
            '<div class="starmap-container"><div class="starmap-stars">' + starsHtml + '</div>' + nodesHtml + '</div>' +
            '<div class="starmap-info">' +
                '<h3>' + sel.emoji + ' ' + sel.name + '</h3>' +
                '<div class="loc-type">' + (sel.type === 'station' ? '🏪 Station' : '🪐 Planet') + '</div>' +
                '<div class="loc-desc">' + sel.description + '</div>' +
                '<div class="starmap-services">' + services + dangerHtml + '</div>' +
                resourcesHtml +
                actionHtml +
            '</div>' +
        '</div>';

    // Attach node click handlers
    panel.querySelectorAll('.map-node').forEach(node => {
        node.addEventListener('click', () => {
            game.selectedLocation = node.dataset.loc;
            renderStarMap();
        });
    });
}

function buildQuickActions(loc) {
    let html = '<div class="quick-actions"><div class="qa-title">⚡ Actions</div>';

    // Boss challenge
    const bossHere = Object.entries(BOSSES).find(([id, b]) => b.location === game.currentLocation && !(game.bossesDefeated || []).includes(id));
    if (bossHere) {
        const [bossId, boss] = bossHere;
        html += '<div class="boss-challenge">' +
            '<div class="boss-info">' + boss.emoji + ' <strong>' + boss.name + '</strong> — ' + boss.desc + '</div>' +
            '<div class="boss-reward">🏆 Reward: ' + formatCR(Math.round(boss.reward * getDifficulty().rewardMult)) + '</div>' +
            '<button class="btn btn-boss" onclick="challengeBoss(\'' + bossId + '\')">⚔️ Fight ' + boss.name + '!</button>' +
        '</div>';
    }
    const defeatedBossHere = Object.entries(BOSSES).find(([id, b]) => b.location === game.currentLocation && (game.bossesDefeated || []).includes(id));
    if (defeatedBossHere) {
        html += '<div class="boss-defeated">' + defeatedBossHere[1].emoji + ' ' + defeatedBossHere[1].name + ' — DEFEATED! ✅</div>';
    }

    // Mine button
    if (loc.canMine) {
        const cargoFull = getCargoUsed() >= getMaxCargo();
        if (quickMineActive) {
            html += '<button class="btn btn-mine-quick" id="quick-mine-btn" disabled>⛏️ Mining...</button>';
        } else if (cargoFull) {
            html += '<button class="btn btn-mine-quick" disabled>🎒 Backpack Full!</button>';
        } else {
            html += '<button class="btn btn-mine-quick" id="quick-mine-btn" onclick="startQuickMine()">⛏️ Mine for Treasure!</button>';
        }

        // Show last mine result inline
        if (game.lastMineResult) {
            const r = game.lastMineResult;
            const mres = RESOURCES[r.resId];
            const label = mres.rarity === 'legendary' ? '🦄 LEGENDARY!' :
                          mres.rarity === 'rare' ? '💎 RARE!' :
                          mres.rarity === 'uncommon' ? '⭐ Nice!' : '✅ Found:';
            html += '<div class="quick-mine-result ' + mres.rarity + '">' + label + ' ' + mres.symbol + ' ' + r.qty + 'x ' + mres.name + '</div>';
        }

        html += '<button class="btn" style="background:var(--surface-2);color:var(--text);font-size:0.78rem" onclick="showPanel(\'mining\')">⛏️ Open Full Mining (tap to dig!)</button>';
    }

    // Sell All button
    if (loc.canTrade && getCargoUsed() > 0) {
        if (Object.keys(currentPrices).length === 0) generatePrices(game.currentLocation);
        let totalValue = 0;
        for (const [resId, qty] of Object.entries(game.cargo)) {
            if (qty <= 0) continue;
            const price = currentPrices[resId] ? currentPrices[resId].sell : Math.max(1, Math.round(RESOURCES[resId].basePrice * 0.5));
            totalValue += qty * price;
        }
        html += '<button class="btn btn-sell-quick" onclick="sellAllCargo()">💰 Sell Everything! (+' + formatCR(totalValue) + ')</button>';
    }

    if (loc.canTrade) {
        html += '<button class="btn" style="background:var(--surface-2);color:var(--text);font-size:0.78rem" onclick="showPanel(\'trading\')">💰 Open Full Trading</button>';
    }

    // Refuel button
    if (loc.canRefuel && game.fuel < getMaxFuel()) {
        const fuelNeed = getMaxFuel() - game.fuel;
        const cost = fuelNeed * loc.fuelPrice;
        if (game.credits >= loc.fuelPrice) {
            html += '<button class="btn btn-refuel-quick" onclick="refuel(9999)">⛽ Fill Up Fuel! (' + formatCR(cost) + ')</button>';
        }
    }

    // Upgrade shop link
    if (loc.canUpgrade) {
        html += '<button class="btn btn-upgrade-quick" onclick="showPanel(\'upgrades\')">⬆️ Visit Upgrade Shop</button>';
    }

    // Mini cargo summary
    const cargoUsed = getCargoUsed();
    if (cargoUsed > 0) {
        const entries = Object.entries(game.cargo).filter(([, q]) => q > 0);
        entries.sort((a, b) => RARITY_ORDER[RESOURCES[b[0]].rarity] - RARITY_ORDER[RESOURCES[a[0]].rarity]);
        html += '<div class="quick-cargo-mini">';
        for (const [resId, qty] of entries.slice(0, 8)) {
            const res = RESOURCES[resId];
            html += '<span class="quick-cargo-chip ' + getRarityClass(res.rarity) + '">' + res.symbol + 'x' + qty + '</span>';
        }
        if (entries.length > 8) html += '<span class="quick-cargo-chip">+' + (entries.length - 8) + ' more</span>';
        html += '</div>';
    }

    html += '</div>';
    return html;
}

// ═══════════════════════════════════════════════════════════
// MINING PANEL (Full tap-to-mine experience)
// ═══════════════════════════════════════════════════════════

function renderMining() {
    const panel = document.getElementById('panel-mining');
    const loc = LOCATIONS[game.currentLocation];

    if (!loc.canMine) {
        panel.innerHTML = '<div class="empty-state"><div class="icon">⛏️</div>' +
            "<p>Can't mine at " + loc.emoji + ' ' + loc.name + '!</p>' +
            '<p>Fly to a planet to dig! 🪐</p></div>';
        return;
    }

    const cargoFull = getCargoUsed() >= getMaxCargo();

    const resList = loc.resources.map(r => {
        const res = RESOURCES[r.id];
        return '<span class="resource-pill ' + res.rarity + '">' + res.symbol + ' ' + res.name + '</span>';
    }).join('');

    let miningAreaHtml = '';
    if (isMining) {
        const pct = miningProgress.toFixed(1);
        let stage = '⛏️ DIGGING...', stageClass = 'stage-drill';
        if (miningProgress > 70) { stage = '✨ ALMOST DONE...'; stageClass = 'stage-process'; }
        else if (miningProgress > 35) { stage = '🔥 GETTING CLOSER...'; stageClass = 'stage-extract'; }

        miningAreaHtml = '<div id="mine-particles" class="mine-particles-container"></div>' +
            '<div class="mine-progress-container"><div class="mine-progress-bar">' +
            '<div class="mine-progress-fill ' + stageClass + '" id="mine-fill" style="width:' + pct + '%"></div></div>' +
            '<div class="mine-stage-label">' + stage + ' ' + Math.floor(miningProgress) + '%</div></div>' +
            '<button class="btn btn-mine-tap" id="mine-tap-btn" onclick="onMineClick()">⛏️ TAP TO DIG! ⛏️</button>' +
            '<div class="tap-hint">Click fast! 💨</div>';
    } else {
        let resultHtml = '';
        if (game.lastMineResult) {
            const r = game.lastMineResult;
            const mres = RESOURCES[r.resId];
            const rLabel = mres.rarity === 'legendary' ? '🦄🦄🦄 LEGENDARY!!!' :
                           mres.rarity === 'rare' ? '💎💎 RARE!!' :
                           mres.rarity === 'uncommon' ? '⭐ Nice!' : '✅ Found:';
            resultHtml = '<div class="mine-result ' + mres.rarity + '"><div class="mine-result-label">' + rLabel + '</div><div class="mine-result-item">' + mres.symbol + ' ' + r.qty + 'x ' + mres.name + '</div></div>';
        }
        miningAreaHtml = resultHtml +
            '<button class="btn btn-mine-start" onclick="startMining()" ' + (cargoFull ? 'disabled' : '') + '>' +
            (cargoFull ? '🎒 Backpack Full!' : '⛏️ Start Mining!') + '</button>';
    }

    let historyHtml = '';
    if (game.mineHistory.length > 0) {
        const items = game.mineHistory.slice(0, 8).map(h => {
            const res = RESOURCES[h.resId];
            return '<div class="mine-history-item"><span class="' + getRarityClass(h.rarity) + '">' + res.symbol + ' ' + h.qty + 'x ' + res.name + '</span></div>';
        }).join('');
        historyHtml = '<div class="mine-history"><h4>🎁 Recent Finds</h4><div class="mine-history-list">' + items + '</div></div>';
    }

    panel.innerHTML = '<div class="mining-header">' +
        '<h2>⛏️ Mining on ' + loc.emoji + ' ' + loc.name + '</h2>' +
        '<div class="planet-desc">' + loc.description + '</div></div>' +
        '<div class="mining-resources">' + resList + '</div>' +
        '<div class="mining-area">' + miningAreaHtml + '</div>' +
        historyHtml + renderCargoSummary();
}

function updateMiningProgressBar() {
    const fill = document.getElementById('mine-fill');
    if (!fill) return;
    fill.style.width = miningProgress.toFixed(1) + '%';
    const label = fill.parentElement.nextElementSibling;
    if (label) {
        const pct = Math.floor(miningProgress);
        if (miningProgress > 70) { fill.className = 'mine-progress-fill stage-process'; label.textContent = '✨ ALMOST DONE... ' + pct + '%'; }
        else if (miningProgress > 35) { fill.className = 'mine-progress-fill stage-extract'; label.textContent = '🔥 GETTING CLOSER... ' + pct + '%'; }
        else { label.textContent = '⛏️ DIGGING... ' + pct + '%'; }
    }
}

// ═══════════════════════════════════════════════════════════
// TRADING PANEL
// ═══════════════════════════════════════════════════════════

function renderTrading() {
    const panel = document.getElementById('panel-trading');
    const loc = LOCATIONS[game.currentLocation];

    if (!loc.canTrade) {
        panel.innerHTML = '<div class="empty-state"><div class="icon">💰</div>' +
            '<p>No shops at ' + loc.emoji + ' ' + loc.name + '!</p>' +
            '<p>Fly to a station! 🏪</p></div>';
        return;
    }

    if (Object.keys(currentPrices).length === 0) generatePrices(game.currentLocation);
    const cargoUsed = getCargoUsed();

    let totalSellValue = 0;
    for (const [resId, qty] of Object.entries(game.cargo)) {
        if (qty <= 0) continue;
        const price = currentPrices[resId] ? currentPrices[resId].sell : Math.max(1, Math.round(RESOURCES[resId].basePrice * 0.5));
        totalSellValue += qty * price;
    }

    let sellAllHtml = '';
    if (cargoUsed > 0) {
        sellAllHtml = '<div class="sell-all-section"><button class="btn btn-sell-all" onclick="sellAllCargo()">💰 SELL EVERYTHING! (+' + formatCR(totalSellValue) + ') 💰</button></div>';
    }

    let rows = '';
    for (const resId of loc.tradeResources) {
        const res = RESOURCES[resId];
        const prices = currentPrices[resId];
        if (!prices) continue;
        const inCargo = game.cargo[resId] || 0;
        const sellVsAvg = prices.sell / res.basePrice;
        const sellIcon = sellVsAvg >= 1.1 ? '🟢' : sellVsAvg <= 0.9 ? '🔴' : '🟡';
        const buyVsAvg = prices.buy / (res.basePrice * 1.35);
        const buyIcon = buyVsAvg <= 0.9 ? '🟢' : buyVsAvg >= 1.1 ? '🔴' : '🟡';
        const canSell = inCargo > 0;
        const canBuy = game.credits >= prices.buy && getCargoUsed() < getMaxCargo();

        rows += '<tr>' +
            '<td><span class="' + getRarityClass(res.rarity) + ' trade-resource-name">' + res.symbol + ' ' + res.name + '</span></td>' +
            '<td class="trade-held">' + (inCargo > 0 ? '<span class="has-items">' + inCargo + '</span>' : '<span class="no-items">0</span>') + '</td>' +
            '<td>' + sellIcon + ' ' + prices.sell + '</td>' +
            '<td><div class="trade-actions">' +
                '<button class="btn btn-sell" onclick="sellResource(\'' + resId + '\', 1)" ' + (canSell ? '' : 'disabled') + '>1</button>' +
                '<button class="btn btn-sell" onclick="sellResource(\'' + resId + '\', 9999)" ' + (canSell ? '' : 'disabled') + '>All</button>' +
            '</div></td>' +
            '<td>' + buyIcon + ' ' + prices.buy + '</td>' +
            '<td><button class="btn btn-buy" onclick="buyResource(\'' + resId + '\', 1)" ' + (canBuy ? '' : 'disabled') + '>Buy</button></td></tr>';
    }

    // Off-market cargo
    for (const [resId, qty] of Object.entries(game.cargo)) {
        if (qty <= 0 || loc.tradeResources.includes(resId)) continue;
        const res = RESOURCES[resId];
        const emergSell = Math.max(1, Math.round(res.basePrice * 0.5));
        rows += '<tr>' +
            '<td><span class="' + getRarityClass(res.rarity) + ' trade-resource-name">' + res.symbol + ' ' + res.name + '</span> <small class="off-market">(rare!)</small></td>' +
            '<td class="trade-held"><span class="has-items">' + qty + '</span></td>' +
            '<td>🔴 ' + emergSell + '</td>' +
            '<td><button class="btn btn-sell" onclick="emergencySell(\'' + resId + '\', ' + emergSell + ', 9999)">All</button></td>' +
            '<td>—</td><td></td></tr>';
    }

    let refuelHtml = '';
    if (loc.canRefuel) {
        const fuelNeed = getMaxFuel() - game.fuel;
        const fp = loc.fuelPrice;
        refuelHtml = '<div class="refuel-section"><h3>⛽ Fuel — ' + fp + ' coins/fuel</h3>' +
            '<div class="fuel-status">Fuel: ' + game.fuel + '/' + getMaxFuel() + (game.fuel < getMaxFuel() * 0.3 ? ' ⚠️' : ' ✅') + '</div>' +
            '<div class="refuel-actions">' +
            '<button class="btn btn-primary" onclick="refuel(9999)" ' + (fuelNeed > 0 && game.credits >= fp ? '' : 'disabled') + '>⛽ Fill Up (' + (fuelNeed * fp) + ')</button>' +
            '<button class="btn btn-primary" onclick="refuel(10)" ' + (fuelNeed > 0 && game.credits >= fp ? '' : 'disabled') + '>+10</button>' +
            '</div></div>';
    }

    panel.innerHTML = '<div class="trading-header"><h2>💰 Trading at ' + loc.emoji + ' ' + loc.name + '</h2>' +
        '<div class="station-desc">' + loc.description + '</div></div>' +
        sellAllHtml +
        '<div class="trading-tip">🟢 Great &nbsp; 🟡 OK &nbsp; 🔴 Bad</div>' +
        '<table class="trading-table"><thead><tr><th>Item</th><th>Have</th><th>Sell</th><th></th><th>Buy</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>' +
        refuelHtml + renderCargoSummary();
}

function emergencySell(resId, price, qty) {
    const amount = Math.min(qty, game.cargo[resId] || 0);
    if (amount <= 0) return;
    const revenue = amount * price;
    game.cargo[resId] -= amount;
    if (game.cargo[resId] <= 0) delete game.cargo[resId];
    game.credits += revenue;
    game.stats.totalSold += amount;
    game.stats.creditsEarned += revenue;
    addLog('💰 Sold ' + amount + 'x ' + RESOURCES[resId].symbol + ' ' + RESOURCES[resId].name + ' for ' + formatCR(revenue) + '!', 'trade');
    showToast('+ ' + formatCR(revenue) + '! 💰', 'success');
    updateAll();
    checkAchievements();
    saveGame();
}

// ═══════════════════════════════════════════════════════════
// UPGRADES PANEL
// ═══════════════════════════════════════════════════════════

function renderUpgrades() {
    const panel = document.getElementById('panel-upgrades');
    const loc = LOCATIONS[game.currentLocation];

    if (!loc.canUpgrade) {
        panel.innerHTML = '<div class="empty-state"><div class="icon">⬆️</div>' +
            '<p>No upgrade shop at ' + loc.emoji + ' ' + loc.name + '!</p>' +
            "<p>Fly to 🏠 Haven Station or 🔭 Explorer's Hideout!</p></div>";
        return;
    }

    let cards = '';
    for (const [id, upg] of Object.entries(UPGRADES)) {
        const level = game.upgrades[id];
        const isMax = level >= 5;
        const current = upg.levels[level - 1];
        const next = isMax ? null : upg.levels[level];

        let stars = '';
        for (let i = 0; i < 5; i++) stars += i < level ? '⭐' : '☆';

        let statsHtml = '<div class="upgrade-stats">Now: <span class="current-val">' + current.desc + '</span>';
        if (next) statsHtml += '<br>Next: <span class="next-val">' + next.desc + '</span>';
        statsHtml += '</div>';

        let costHtml = '';
        if (isMax) {
            costHtml = '<div class="upgrade-cost"><span class="upgrade-maxed">🌟 MAX! 🌟</span></div>';
        } else {
            const canAfford = game.credits >= next.cost;
            const pct = Math.min(100, (game.credits / next.cost * 100)).toFixed(0);
            costHtml = '<div class="upgrade-cost"><div><span class="upgrade-price ' + (canAfford ? '' : 'cant-afford') + '">' + formatCR(next.cost) + '</span>' +
                (!canAfford ? '<div class="upgrade-progress-hint">' + pct + '% saved</div>' : '') +
                '</div><button class="btn btn-primary" onclick="purchaseUpgrade(\'' + id + '\')" ' + (canAfford ? '' : 'disabled') + '>' +
                (canAfford ? '⬆️ Upgrade!' : '🔒') + '</button></div>';
        }

        cards += '<div class="upgrade-card ' + (isMax ? 'maxed' : '') + '">' +
            '<div class="upgrade-card-header"><h3>' + upg.icon + ' ' + upg.name + '</h3><span class="upgrade-stars">' + stars + '</span></div>' +
            '<div class="upgrade-desc">' + upg.description + '</div>' +
            statsHtml + costHtml + '</div>';
    }

    panel.innerHTML = '<div class="upgrades-header"><h2>⬆️ Ship Upgrades</h2>' +
        '<div class="upgrades-coins">💰 <span class="text-credits">' + formatCR(game.credits) + '</span></div></div>' +
        '<div class="upgrades-grid">' + cards + '</div>';
}

// ═══════════════════════════════════════════════════════════
// SHIP / ACHIEVEMENTS PANEL
// ═══════════════════════════════════════════════════════════

function renderShip() {
    const panel = document.getElementById('panel-ship');

    const upgradeList = Object.entries(UPGRADES).map(([id, upg]) => {
        const level = game.upgrades[id];
        let stars = '';
        for (let i = 0; i < 5; i++) stars += i < level ? '⭐' : '☆';
        return '<div class="ship-upgrade-row"><span>' + upg.icon + ' ' + upg.name + '</span><span>' + stars + '</span></div>';
    }).join('');

    let totalValue = 0;
    for (const [resId, qty] of Object.entries(game.cargo)) totalValue += RESOURCES[resId].basePrice * qty;

    const achHtml = Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
        const unlocked = (game.achievements || []).includes(id);
        return '<div class="achievement-item ' + (unlocked ? 'unlocked' : 'locked') + '">' +
            '<span class="achievement-item-emoji">' + (unlocked ? ach.emoji : '🔒') + '</span>' +
            '<span class="achievement-item-name">' + (unlocked ? ach.name : '???') + '</span></div>';
    }).join('');

    const galaxyLabel = game.galaxy ? game.galaxy.name : 'Classic Galaxy';
    const diffInfo = getDifficulty();

    const bossProgressHtml = Object.entries(BOSSES).map(([id, boss]) => {
        const defeated = (game.bossesDefeated || []).includes(id);
        return '<div class="boss-progress-item ' + (defeated ? 'defeated' : '') + '">' +
            '<span class="boss-emoji">' + (defeated ? boss.emoji : '❓') + '</span>' +
            '<span>' + (defeated ? boss.name : '???') + '</span>' +
            (defeated ? ' ✅' : '') + '</div>';
    }).join('');

    const cs = game.combatStats || { wins: 0, losses: 0, fled: 0 };

    panel.innerHTML = '<div class="ship-panel"><h2>🚀 My Spaceship</h2>' +
        '<div class="ship-galaxy-name">🌌 ' + galaxyLabel + ' &nbsp;|&nbsp; <span style="color:' + diffInfo.color + '">' + diffInfo.emoji + ' ' + diffInfo.name + '</span></div>' +
        '<div class="ship-stats-grid">' +
            '<div class="ship-stat-card"><div class="label">💰 Coins</div><div class="value credits">' + formatCR(game.credits) + '</div></div>' +
            '<div class="ship-stat-card"><div class="label">⛽ Fuel</div><div class="value fuel">' + game.fuel + '/' + getMaxFuel() + '</div></div>' +
            '<div class="ship-stat-card"><div class="label">🎒 Backpack</div><div class="value accent">' + getCargoUsed() + '/' + getMaxCargo() + '</div></div>' +
            '<div class="ship-stat-card"><div class="label">💎 Value</div><div class="value credits">' + formatCR(totalValue) + '</div></div>' +
            '<div class="ship-stat-card"><div class="label">📍 At</div><div class="value accent">' + LOCATIONS[game.currentLocation].emoji + ' ' + LOCATIONS[game.currentLocation].name + '</div></div>' +
            '<div class="ship-stat-card"><div class="label">🚀 Trips</div><div class="value">' + game.stats.tripsCount + '</div></div>' +
        '</div>' +
        '<div class="section-title">⬆️ Upgrades</div><div class="ship-upgrades-box">' + upgradeList + '</div>' +
        '<div class="section-title">👑 Boss Progress (' + (game.bossesDefeated || []).length + '/' + Object.keys(BOSSES).length + ')</div>' +
        '<div class="boss-progress-grid">' + bossProgressHtml + '</div>' +
        '<div class="section-title">🏆 Achievements (' + (game.achievements || []).length + '/' + Object.keys(ACHIEVEMENTS).length + ')</div>' +
        '<div class="achievements-grid">' + achHtml + '</div>' +
        '<div class="section-title">📊 Stats</div><div class="ship-stats-box">' +
            '⛏️ Mined: <span class="text-accent">' + game.stats.totalMined + '</span><br>' +
            '💰 Sold: <span class="text-credits">' + game.stats.totalSold + '</span><br>' +
            '🛒 Bought: <span class="text-accent">' + game.stats.totalBought + '</span><br>' +
            '💰 Earned: <span class="text-credits">' + formatCR(game.stats.creditsEarned) + '</span><br>' +
            '💸 Spent: <span class="text-danger">' + formatCR(game.stats.creditsSpent) + '</span><br>' +
            '🚀 Distance: <span class="text-accent">' + game.stats.distanceTraveled.toLocaleString() + ' miles</span><br>' +
            '⚔️ Battles Won: <span class="text-accent">' + cs.wins + '</span><br>' +
            '💔 Battles Lost: <span class="text-danger">' + cs.losses + '</span><br>' +
            '🏃 Fled: <span class="text-muted">' + cs.fled + '</span>' +
        '</div>' +
        renderCargoSummary() +
        '<div class="ship-actions"><button class="btn btn-primary" onclick="returnToMenu()">🔙 Main Menu</button></div></div>';
}

// ═══════════════════════════════════════════════════════════
// SETTINGS PANEL
// ═══════════════════════════════════════════════════════════

function renderSettings() {
    const panel = document.getElementById('panel-settings');
    const s = RetroAudio.settings;

    panel.innerHTML =
        '<div class="settings-panel">' +
            '<h2>⚙️ Settings</h2>' +
            '<div class="settings-section">' +
                '<h3>🎵 Music</h3>' +
                '<div class="settings-row">' +
                    '<label class="toggle-label">' +
                        '<input type="checkbox" class="toggle-input" ' + (s.musicOn ? 'checked' : '') +
                            ' onchange="RetroAudio.setMusicOn(this.checked)">' +
                        '<span class="toggle-switch"></span>' +
                        '<span>' + (s.musicOn ? 'ON' : 'OFF') + '</span>' +
                    '</label>' +
                '</div>' +
                '<div class="settings-row">' +
                    '<span class="vol-label">Volume</span>' +
                    '<input type="range" min="0" max="100" value="' + Math.round(s.musicVol * 100) +
                        '" class="vol-slider" oninput="RetroAudio.setMusicVol(this.value/100)">' +
                '</div>' +
            '</div>' +
            '<div class="settings-section">' +
                '<h3>🔊 Sound Effects</h3>' +
                '<div class="settings-row">' +
                    '<label class="toggle-label">' +
                        '<input type="checkbox" class="toggle-input" ' + (s.sfxOn ? 'checked' : '') +
                            ' onchange="RetroAudio.setSfxOn(this.checked)">' +
                        '<span class="toggle-switch"></span>' +
                        '<span>' + (s.sfxOn ? 'ON' : 'OFF') + '</span>' +
                    '</label>' +
                '</div>' +
                '<div class="settings-row">' +
                    '<span class="vol-label">Volume</span>' +
                    '<input type="range" min="0" max="100" value="' + Math.round(s.sfxVol * 100) +
                        '" class="vol-slider" oninput="RetroAudio.setSfxVol(this.value/100)">' +
                '</div>' +
                '<div class="settings-row">' +
                    '<button class="btn btn-primary" onclick="RetroAudio.sfx(\'click\')">🔊 Test Sound</button>' +
                '</div>' +
            '</div>' +
            '<div class="settings-section settings-info">' +
                '<p>🎶 Retro 80s chiptune music!</p>' +
                '<p>🔈 All sounds are generated — no downloads needed.</p>' +
            '</div>' +
            '<div class="settings-section settings-menu">' +
                '<button class="btn btn-menu-main" onclick="confirmMainMenu()">🏠 Main Menu</button>' +
                '<p class="menu-hint">Save & return to slot selection</p>' +
            '</div>' +
        '</div>';
}

// ── Cargo Summary ──

function renderCargoSummary() {
    const entries = Object.entries(game.cargo).filter(([, q]) => q > 0);
    if (entries.length === 0)
        return '<div class="cargo-summary"><h4>🎒 Backpack</h4><div class="cargo-empty">Empty! Go mine! ⛏️</div></div>';

    entries.sort((a, b) => RARITY_ORDER[RESOURCES[b[0]].rarity] - RARITY_ORDER[RESOURCES[a[0]].rarity]);

    const items = entries.map(([resId, qty]) => {
        const res = RESOURCES[resId];
        return '<div class="cargo-item"><span class="res-name ' + getRarityClass(res.rarity) + '">' + res.symbol + ' ' + res.name + '</span><span class="res-qty">x' + qty + '</span></div>';
    }).join('');

    return '<div class="cargo-summary"><h4>🎒 Backpack (' + getCargoUsed() + '/' + getMaxCargo() + ')</h4><div class="cargo-grid">' + items + '</div></div>';
}

// ── Event Log ──

function renderEventLog() {
    const container = document.getElementById('events-container');
    if (!container) return;
    container.innerHTML = game.events.slice(0, 25).map(e =>
        '<div class="log-entry ' + e.type + '"><span class="log-time">' + e.time + '</span> ' + e.message + '</div>'
    ).join('');
}

// ─── SAVE / LOAD (3 Slots) ────────────────────────────────

function getSlotKey(n) { return 'spaceAdventure_slot' + n; }

function saveGame() {
    if (!activeSlot || !game) return;
    try { localStorage.setItem(getSlotKey(activeSlot), JSON.stringify(game)); } catch (e) {}
}

function loadSlot(n) {
    try {
        const data = localStorage.getItem(getSlotKey(n));
        if (data) {
            game = JSON.parse(data);
            const defaults = newGameState();
            for (const key of Object.keys(defaults)) { if (!(key in game)) game[key] = defaults[key]; }
            for (const key of Object.keys(defaults.stats)) { if (!(key in game.stats)) game.stats[key] = defaults.stats[key]; }
            for (const key of Object.keys(defaults.upgrades)) { if (!(key in game.upgrades)) game.upgrades[key] = 1; }
            if (!game.visited) game.visited = ['havenStation'];
            if (!game.achievements) game.achievements = [];
            activeSlot = n;
            resetLocations();
            if (game.galaxy) applyGalaxy(game.galaxy);
            return true;
        }
    } catch (e) {}
    return false;
}

function getSlotSummary(n) {
    try {
        const data = localStorage.getItem(getSlotKey(n));
        if (data) {
            const g = JSON.parse(data);
            return {
                exists: true,
                credits: g.credits || 0,
                location: g.currentLocation || 'havenStation',
                trips: g.stats ? g.stats.tripsCount || 0 : 0,
                mined: g.stats ? g.stats.totalMined || 0 : 0,
                achievements: (g.achievements || []).length,
                galaxyName: g.galaxy ? g.galaxy.name : 'Classic Galaxy',
                difficulty: g.difficulty || 'normal',
            };
        }
    } catch (e) {}
    return { exists: false };
}

function deleteSlot(n) {
    if (!confirm('Delete this save? It will be gone forever!')) return;
    localStorage.removeItem(getSlotKey(n));
    if (activeSlot === n) { activeSlot = 0; game = null; }
    renderSlotPicker();
}

function returnToMenu() {
    saveGame();
    cancelMining();
    RetroAudio.stopMusic();
    activeSlot = 0;
    game = null;
    currentPrices = {};
    resetLocations();
    renderSlotPicker();
}

function confirmMainMenu() {
    if (confirm('Return to main menu? Your game will be saved!')) returnToMenu();
}

// ─── INITIALIZATION ────────────────────────────────────────

function migrateOldSave() {
    try {
        const old = localStorage.getItem('spaceTrader_save');
        if (old && !localStorage.getItem(getSlotKey(1))) {
            localStorage.setItem(getSlotKey(1), old);
        }
        if (old) localStorage.removeItem('spaceTrader_save');
    } catch (e) {}
}

function renderSlotPicker() {
    const overlay = document.getElementById('intro-overlay');
    overlay.classList.remove('hidden');

    let slotsHtml = '';
    for (let i = 1; i <= 3; i++) {
        const s = getSlotSummary(i);
        if (s.exists) {
            const loc = BASE_LOCATIONS[s.location] || { emoji: '❓', name: 'Unknown' };
            slotsHtml +=
                '<div class="save-slot filled">' +
                    '<div class="slot-header">🌌 ' + s.galaxyName + '</div>' +
                    '<div class="slot-details">' +
                        '<span class="slot-difficulty" style="color:' + (DIFFICULTY[s.difficulty] || DIFFICULTY.normal).color + '">' + (DIFFICULTY[s.difficulty] || DIFFICULTY.normal).emoji + ' ' + (DIFFICULTY[s.difficulty] || DIFFICULTY.normal).name + '</span>' +
                        '<span>💰 ' + s.credits.toLocaleString() + ' coins</span>' +
                        '<span>📍 ' + loc.emoji + ' ' + loc.name + '</span>' +
                        '<span>🚀 ' + s.trips + ' trips &nbsp; ⛏️ ' + s.mined + ' mined</span>' +
                        '<span>🏆 ' + s.achievements + '/' + Object.keys(ACHIEVEMENTS).length + ' achievements</span>' +
                    '</div>' +
                    '<div class="slot-actions">' +
                        '<button class="btn-intro btn-continue" onclick="loadAndPlay(' + i + ')">🚀 Play!</button>' +
                        '<button class="btn-slot-delete" onclick="deleteSlot(' + i + ')">🗑️</button>' +
                    '</div>' +
                '</div>';
        } else {
            slotsHtml +=
                '<div class="save-slot empty">' +
                    '<div class="slot-empty-icon">✨</div>' +
                    '<div class="slot-empty-text">Empty Slot</div>' +
                    '<button class="btn-intro btn-new" onclick="newGameInSlot(' + i + ')">🌟 New Adventure!</button>' +
                '</div>';
        }
    }

    overlay.innerHTML =
        '<div class="intro-title">🚀 Space Adventures 🌟</div>' +
        '<div class="intro-subtitle">Pick a save slot!</div>' +
        '<div class="save-slots">' + slotsHtml + '</div>';
}

function loadAndPlay(n) {
    if (loadSlot(n)) {
        document.getElementById('intro-overlay').classList.add('hidden');
        const loc = LOCATIONS[game.currentLocation];
        if (loc.canTrade) generatePrices(game.currentLocation);
        RetroAudio.ensureCtx();
        RetroAudio.startMusic();
        updateAll();
        renderEventLog();
    }
}

function newGameInSlot(n) {
    renderDifficultyPicker(n);
}

function renderDifficultyPicker(slotNum) {
    const overlay = document.getElementById('intro-overlay');
    let html = '<div class="intro-title">🚀 Space Adventures 🌟</div>' +
        '<div class="intro-subtitle">Choose your difficulty!</div>' +
        '<div class="difficulty-picker">';

    for (const [key, diff] of Object.entries(DIFFICULTY)) {
        html += '<div class="difficulty-option diff-' + key + '" onclick="startNewGame(' + slotNum + ',\'' + key + '\')">' +
            '<div class="diff-emoji">' + diff.emoji + '</div>' +
            '<div class="diff-name">' + diff.name + '</div>' +
            '<div class="diff-desc">' + diff.desc + '</div>' +
            '<div class="diff-details">' + diff.details + '</div>' +
        '</div>';
    }

    html += '</div><button class="diff-back-btn" onclick="renderSlotPicker()">🔙 Back</button>';
    overlay.innerHTML = html;
}

function startNewGame(n, difficultyKey) {
    activeSlot = n;
    resetLocations();
    const galaxy = generateGalaxy();
    applyGalaxy(galaxy);

    const diff = DIFFICULTY[difficultyKey] || DIFFICULTY.normal;
    game = newGameState();
    game.difficulty = difficultyKey;
    game.galaxy = galaxy;
    game.credits = Math.round(galaxy.startingCredits * diff.startCreditsMult);

    currentPrices = {};
    generatePrices('havenStation');
    addLog('🌌 Welcome to the ' + galaxy.name + ', Captain!', 'travel');
    addLog(diff.emoji + ' Difficulty: ' + diff.name, 'travel');
    addLog('💡 Click Sandy Planet on the map and fly there!', 'travel');

    document.getElementById('intro-overlay').classList.add('hidden');
    RetroAudio.ensureCtx();
    RetroAudio.startMusic();
    RetroAudio.sfx('newgame');
    updateAll();
    renderEventLog();
    saveGame();
}

function init() {
    migrateOldSave();

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => showPanel(btn.dataset.panel));
    });

    renderSlotPicker();
}

window.addEventListener('DOMContentLoaded', init);
