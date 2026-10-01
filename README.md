# Pokemon Backend API

A simple Node.js/Express API for managing and filtering Pokemon data.

## Features

- RESTful API endpoints for Pokemon data
- Filter by name, type, legendary status, and generation
- CORS enabled for frontend integration
- Docker support with health checks
- Mock data with 12 Pokemon

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/pokemons` - Get all Pokemon with optional filtering
- `GET /api/pokemons/:id` - Get specific Pokemon by ID
- `GET /api/types` - Get all available Pokemon types

### Query Parameters for `/api/pokemons`

- `name` - Filter by Pokemon name (case-insensitive partial match)
- `type` - Filter by Pokemon type (case-insensitive exact match)
- `legendary` - Filter by legendary status (`true` or `false`)
- `generation` - Filter by Pokemon generation number (e.g. `1`)

### Example Requests

```bash
# Get all Pokemon
curl http://localhost:3001/api/pokemons

# Filter by name
curl http://localhost:3001/api/pokemons?name=pika

# Filter by type
curl http://localhost:3001/api/pokemons?type=fire

# Filter legendary Pokemon
curl http://localhost:3001/api/pokemons?legendary=true

# Filter by generation
curl http://localhost:3001/api/pokemons?generation=1

# Combined filters
curl http://localhost:3001/api/pokemons?type=psychic&legendary=true
```

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## Docker Setup

### Build and run with Docker

```bash
# Build the image
docker build -t pokemon-backend .

# Run the container
docker run -p 3001:3001 pokemon-backend
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# Stop the service
docker-compose down
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## Project Structure

```
pokemon-backend/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Mock Data

The API includes mock data for 12 Pokemon:
- Regular Pokemon: Pikachu, Charizard, Blastoise, Venusaur, Gyarados, Dragonite, Alakazam
- Legendary Pokemon: Mewtwo, Mew, Articuno, Zapdos, Moltres

Each Pokemon has:
- `id` - Unique identifier
- `name` - Pokemon name
- `type` - Array of types
- `legendary` - Boolean indicating legendary status
- `generation` - Generation number the Pokemon was introduced in
- `image` - URL to Pokemon sprite

## Health Check

The API includes a health check endpoint at `/health` that returns the server status. This is used by Docker for container health monitoring.
