# Smart Portfolio Manager

An AI-powered portfolio builder that automatically generates beautiful, personalized portfolios from your GitHub projects.

## Features

- 🔐 **GitHub Authentication** - Secure login with GitHub OAuth
- 🤖 **AI-Powered Summaries** - Uses Google Gemini AI to generate project descriptions, tech stacks, and highlights
- 🎨 **Beautiful Portfolios** - Modern, responsive design with dark mode support
- ⚙️ **Full Customization** - Manage your profile, work experience, education, skills, and project visibility
- 📦 **Easy Import** - Import and manage your GitHub repositories with a few clicks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub OAuth App credentials
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd spm
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
GEMINI_API_KEY="your_gemini_api_key"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI

## Project Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── profile/      # Profile display pages
│   ├── settings/     # Settings page
│   └── page.tsx       # Homepage
├── components/       # React components
└── lib/              # Utility functions
```

## License

MIT
