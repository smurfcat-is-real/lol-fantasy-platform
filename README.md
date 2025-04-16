# LoL Fantasy Platform

A League of Legends fantasy esports platform where users create teams with professional LoL players and compete based on real-world performance.

![LoL Fantasy Platform](https://i.imgur.com/FwbY5hO.png)

## Features

- **User Authentication**: Secure signup and login system
- **League Management**: Create and join leagues with customizable settings
- **Team Management**: Build and manage your dream team of pro players
- **Transfer Market**: Buy and sell players to optimize your roster
- **Real-time Stats**: Player performance scoring based on actual matches

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Data Source**: Leaguepedia API

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/smurfcat-is-real/lol-fantasy-platform.git
cd lol-fantasy-platform
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
# Update .env with your database credentials and NextAuth secret
```

4. Set up the database
```bash
npx prisma migrate dev --name init
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Development Guide

### Project Structure

The project follows a standard Next.js 14 App Router structure:

```
/lol-fantasy-platform
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard page
│   │   └── leagues/           # League-related pages
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   ├── league/            # League management components
│   │   ├── market/            # Transfer market components
│   │   └── team/              # Team management components
│   ├── lib/                   # Utility functions and services
│   │   ├── leaguepedia/       # Leaguepedia API client
│   │   ├── scoring/           # Scoring calculations
│   │   └── services/          # Business logic services
│   ├── services/              # Frontend service layer
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
└── public/                    # Static assets
```

### Key Components

1. **Auth System**: Authentication is handled via NextAuth.js with credentials provider
2. **League Service**: Manages league creation, joining, and operations
3. **Market Service**: Handles player transfers and roster management
4. **Scoring System**: Calculates player points based on match performance

### API Endpoints

The platform provides a RESTful API with the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/leagues` | GET | Get user's leagues |
| `/api/leagues` | POST | Create a new league |
| `/api/leagues/:id` | GET | Get a specific league |
| `/api/leagues/:id/join` | POST | Join a league |
| `/api/market/:teamId` | GET | Get available players |
| `/api/market/:teamId` | POST | Buy a player |
| `/api/market/:teamId` | DELETE | Sell a player |
| `/api/teams/:id/players` | GET | Get team players |

## Data Flow

The application follows this data flow pattern:

1. **Data Source**: Pro player stats are fetched from Leaguepedia
2. **Backend Processing**: Stats are transformed and scored
3. **Database Storage**: Processed data is stored in PostgreSQL
4. **API Layer**: Next.js API routes expose data to frontend
5. **Frontend Consumption**: React components display data to users

## Deployment

The platform can be deployed to Vercel with the following steps:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy the application

For the database, you can use:
- Supabase
- Railway
- Neon
- Any PostgreSQL provider

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Leaguepedia](https://lol.fandom.com) for esports data
- [Riot Games](https://riotgames.com) for League of Legends
- All the professional players who make esports exciting
