# LoL Fantasy Platform

A League of Legends fantasy esports platform where users create teams with professional LoL players and compete based on real-world performance.

## Features

- User authentication (sign-up, login)
- League creation and management
- Team management
- Player market system
- Real-time scoring based on professional matches

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
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

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
/lol-fantasy-platform
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and services
│   │   ├── leaguepedia/  # Leaguepedia API client
│   │   ├── services/     # Business logic services
│   │   └── scoring/      # Scoring calculations
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript types
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── tests/                # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
