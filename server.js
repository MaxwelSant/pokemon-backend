const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Pokemon data
const mockPokemons = [
  {
    id: 1,
    name: 'Pikachu',
    type: ['Electric'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  },
  {
    id: 2,
    name: 'Charizard',
    type: ['Fire', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
  },
  {
    id: 3,
    name: 'Blastoise',
    type: ['Water'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'
  },
  {
    id: 4,
    name: 'Venusaur',
    type: ['Grass', 'Poison'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
  },
  {
    id: 5,
    name: 'Mewtwo',
    type: ['Psychic'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png'
  },
  {
    id: 6,
    name: 'Mew',
    type: ['Psychic'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png'
  },
  {
    id: 7,
    name: 'Articuno',
    type: ['Ice', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png'
  },
  {
    id: 8,
    name: 'Zapdos',
    type: ['Electric', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png'
  },
  {
    id: 9,
    name: 'Moltres',
    type: ['Fire', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png'
  },
  {
    id: 10,
    name: 'Gyarados',
    type: ['Water', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png'
  },
  {
    id: 11,
    name: 'Dragonite',
    type: ['Dragon', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png'
  },
  {
    id: 12,
    name: 'Alakazam',
    type: ['Psychic'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png'
  }
];

let jiraLinkAttempts = 0;
let linkedJiraIssue = null;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pokemon API is running!' });
});

app.get('/api/pokemons', (req, res) => {
  const { name, type, legendary } = req.query;
  
  let filteredPokemons = [...mockPokemons];
  
  // Filter by name (case insensitive)
  if (name) {
    filteredPokemons = filteredPokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  // Filter by type (case insensitive)
  if (type) {
    filteredPokemons = filteredPokemons.filter(pokemon => 
      pokemon.type.some(t => t.toLowerCase() === type.toLowerCase())
    );
  }
  
  // Filter by legendary status
  if (legendary !== undefined) {
    const isLegendary = legendary === 'true';
    filteredPokemons = filteredPokemons.filter(pokemon => 
      pokemon.legendary === isLegendary
    );
  }
  
  res.json({
    success: true,
    count: filteredPokemons.length,
    data: filteredPokemons
  });
});

app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = mockPokemons.find(p => p.id === id);
  
  if (!pokemon) {
    return res.status(404).json({
      success: false,
      message: 'Pokemon not found'
    });
  }
  
  res.json({
    success: true,
    data: pokemon
  });
});

// Get all unique types
app.get('/api/types', (req, res) => {
  const types = [...new Set(mockPokemons.flatMap(pokemon => pokemon.type))];
  res.json({
    success: true,
    data: types.sort()
  });
});

app.get('/api/jira-status', (req, res) => {
  const jiraConfigured = Boolean(process.env.JIRA_BASE_URL && process.env.JIRA_API_TOKEN);
  if (!jiraConfigured || !linkedJiraIssue) {
    return res.json({
      success: false,
      attempts: 1,
      message: 'Jira integration is not configured (failure 1)'
    });
  }
  res.json({ success: true, attempts: jiraLinkAttempts, data: linkedJiraIssue });
});

app.post('/api/jira-link', (req, res) => {
  const { issueKey } = req.body;
  const jiraConfigured = Boolean(process.env.JIRA_BASE_URL && process.env.JIRA_API_TOKEN);

  if (!issueKey || typeof issueKey !== 'string') {
    jiraLinkAttempts += 1;
    return res.status(400).json({
      success: false,
      attempts: jiraLinkAttempts,
      message: `Issue key is required (failure ${jiraLinkAttempts})`
    });
  }

  if (!jiraConfigured) {
    jiraLinkAttempts += 1;
    return res.status(503).json({
      success: false,
      attempts: jiraLinkAttempts,
      message: `Jira integration is not configured (failure ${jiraLinkAttempts})`
    });
  }

  linkedJiraIssue = { key: issueKey };
  res.json({ success: true, attempts: jiraLinkAttempts, data: linkedJiraIssue });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Pokemon API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
