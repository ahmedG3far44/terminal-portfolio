# Terminal Portfolio

A full-stack terminal-themed portfolio platform with GitHub OAuth, MongoDB persistence, dynamic user routing, Cloudinary media uploads, and a super admin panel — all built with TypeScript.

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **Markdown**: react-markdown, remark-gfm, rehype-highlight
- **HTTP**: Custom fetch interceptor with `useQuery`/`useMutation` hooks

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (user) + JWT (super admin), bcrypt
- **OAuth**: GitHub OAuth 2.0
- **File Upload**: Multer + Cloudinary SDK
- **GitHub API**: GraphQL (contributions) + REST (repos, README)

## Features

### 1. Dynamic User Portfolios
- Every portfolio lives at `/:username` (e.g. `/john-doe`)
- Anyone can view any portfolio by typing the GitHub username
- Legacy `/portfolio` route works as fallback

### 2. GitHub OAuth + JWT Auth
- Sign in with GitHub to access the admin dashboard
- JWT stored in `localStorage` (`auth-token`)
- User model stores GitHub access token for proxied API calls
- Automatic re-auth redirect when token expires

### 3. Admin Dashboard (`/admin`)
- **Projects**: Full CRUD with title, slug, description, tags, tech stack, tools, cover image/video
- **GitHub Repos**: Fetch repos from GitHub, toggle-select, import as projects
- **Skills**: Add/remove skill chips
- **Personal Info**: Name, title, bio, email, available for hire
- **Cover Upload**: Upload images/videos to Cloudinary (PNG, JPEG, GIF, MP4 — max 4MB)
- Tag-style inputs for tags, tech stack (suggestions from skills), and tools
- Loading/disabled states on all form actions

### 4. Dynamic Username Routing
- `/:username` → renders public portfolio
- `/:username/project/:id` → renders project detail
- Landing page detects auth state: logged-in users see their avatar/username + "View My Portfolio" link
- Unauthenticated visitors see a "Sign in with GitHub" CTA

### 5. Project Detail Pages (`/:username/project/:id`)

Each project displays:
- Cover image or video (with play on hover for overlay title/description)
- Tags, tech stack, tools (only rendered if non-empty)
- GitHub README fetched via server-side proxy (only rendered if available)
- "View Code" and "Live Demo" links

### 6. Project Cards
- Full-width cover image/video when present
- Hover overlay reveals title + description + tech stack
- Fallback shows ID badge + title + description when no media

### 7. GitHub Contributions Board
- Fetches via GitHub GraphQL API (proxied through server)
- Stat cards: total contributions, commits, PRs, issues
- Current streak and longest streak (with "days" suffix)
- 52-week contribution heatmap colored with theme accent
- Zero-value stat cards are hidden
- Falls back to `GITHUB_TOKEN` env var for unauthenticated requests

### 8. Super Admin Panel (`/admin/super`)
- Email/password login (bcrypt, JWT)
- Dashboard with platform insights (users, projects, skills, themes)
- User search, block/activate
- Theme CRUD — create/edit/delete color themes
- Public themes endpoint for frontend consumption

### 9. Multi-Theme System
- All themes stored in MongoDB (super admin manages via CRUD)
- Dynamic accent color applied across terminal UI
- 10 default themes seeded (green, blue, purple, sky blue, zinc, amber, rose, cyan, emerald, orange)
- No hardcoded theme fallbacks — DB is the single source of truth

### 10. Bilingual Support (i18n)
- English and Arabic
- Language toggle with RTL layout support
- All UI text via `en.json` / `ar.json` translation files

### 11. README Rendering
- Fetches README.md from GitHub repos via server proxy
- Renders: headers, bold/italic, code blocks (syntax highlighted), images, links, task lists, blockquotes, tables, horizontal rules

### 12. Cloudinary Media Uploads
- Drag-and-drop file picker in admin project form
- Preview before upload (video with autoPlay/muted/loop, image thumbnail)
- Validates file type (PNG, JPEG, GIF, MP4) and size (max 4MB) client-side
- Server-side validation via multer
- Uploads to Cloudinary `portfolio/projects` folder
- Remove button to clear cover media

### 13. Header Bar
- Fixed top bar with terminal branding (`~/portfolio`)
- Shows avatar + username + Dashboard link + logout button when authenticated
- Shows Login button when unauthenticated

### 14. Controls Panel
- Floating settings button (bottom-right, `Ctrl+Space`)
- Accent color picker (from available DB themes)
- Language switcher (EN/AR)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- GitHub OAuth App (client ID + secret)
- Cloudinary account (for media uploads)

### Installation

```bash
git clone <repo>
cd terminal-portfolio

# Server
cd server
npm install
cp .env.example .env   # fill in your env vars
npm run seed            # creates super admin + default themes
npm run dev

# Client (in another terminal)
cd client
npm install
npm run dev
```

### Environment Variables (`server/.env`)

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/portfolio

JWT_SECRET=your-jwt-secret
JWT_ADMIN_SECRET=your-admin-jwt-secret

GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=your_github_personal_access_token

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Default Super Admin
- Email: `admin@portfolio.com`
- Password: `admin123`
- Created via `npm run seed` in the server directory

## Project Structure

```
├── shared/
│   └── types.ts                  # Shared TypeScript interfaces
├── server/
│   ├── configs/
│   │   ├── cloudinary.ts         # Cloudinary SDK config
│   │   ├── db.ts                 # MongoDB connection
│   │   └── env.ts                # Environment variable loader
│   ├── controllers/
│   │   ├── adminAuthController   # Super admin login (email/password)
│   │   ├── adminController       # Insights, users, themes
│   │   ├── authController        # GitHub OAuth flow
│   │   ├── githubController      # Contributions, repos, README proxy
│   │   └── portfolioController   # Portfolio CRUD + public endpoints
│   ├── middlewares/
│   │   ├── auth.ts               # JWT user auth
│   │   ├── adminAuth.ts          # JWT super admin auth
│   │   └── errorHandler.ts       # Global error handler
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Portfolio.ts
│   │   ├── Theme.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── admin.ts
│   │   ├── adminAuth.ts
│   │   ├── auth.ts
│   │   ├── github.ts
│   │   ├── portfolio.ts
│   │   ├── publicThemes.ts
│   │   └── upload.ts             # Cloudinary upload endpoint
│   ├── utils/
│   │   ├── github.ts             # GitHub API helpers
│   │   └── jwt.ts                # Token sign/verify
│   ├── app.ts                    # Express entry point
│   └── seed.ts                   # DB seeder
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Controls.tsx      # Theme/language panel
│   │   │   ├── GitHubBoard.tsx   # Contributions heatmap
│   │   │   ├── Header.tsx        # Auth-aware top bar
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── ReadmeParser.tsx  # Markdown renderer
│   │   │   ├── ThemeSelector.tsx
│   │   │   └── VariantSwitcher.tsx
│   │   ├── context/
│   │   │   ├── AdminContext.tsx   # Portfolio CRUD state
│   │   │   ├── AuthContext.tsx    # JWT + GitHub OAuth
│   │   │   ├── GitHubContext.tsx  # GitHub API hooks
│   │   │   ├── LanguageContext.tsx # i18n
│   │   │   └── ThemeContext.tsx   # DB-driven themes
│   │   ├── hooks/
│   │   │   └── useQuery.ts       # useQuery / useMutation
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Home.tsx          # Portfolio page (/:username)
│   │   │   ├── Landing.tsx       # Marketing landing
│   │   │   ├── ProjectDetails.tsx
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   └── SuperAdminLogin.tsx
│   │   ├── services/
│   │   │   └── http.ts           # Fetch interceptor + upload helper
│   │   ├── types/
│   │   │   └── index.ts          # Frontend type definitions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   └── tsconfig.json
└── .gitignore
```

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/portfolio` | Default portfolio (optionally authenticated) |
| GET | `/api/portfolio/:username` | Portfolio by GitHub username |
| GET | `/api/portfolio/project/:id` | Project by ID from default portfolio |
| GET | `/api/portfolio/:username/project/:projectId` | Project by username + project ID |
| GET | `/api/github/contributions` | Contribution heatmap + streaks |
| GET | `/api/github/readme/:owner/:repo` | Raw README content |
| GET | `/api/themes` | Active themes |

### Authenticated (user JWT)
| Method | Path | Description |
|--------|------|-------------|
| PUT | `/api/portfolio` | Update portfolio |
| POST | `/api/portfolio/reset` | Reset portfolio to defaults |
| GET | `/api/github/repos` | User's GitHub repos |
| POST | `/api/upload` | Upload file to Cloudinary |

### Super Admin
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/admin/auth/login` | Email/password login |
| GET | `/api/admin/insights` | Platform stats |
| GET | `/api/admin/users` | Search users |
| PATCH | `/api/admin/users/:id/block` | Block user |
| PATCH | `/api/admin/users/:id/activate` | Activate user |
| GET/POST/PUT/DELETE | `/api/admin/themes` | Theme CRUD |

### Auth
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/github` | GitHub OAuth redirect |
| GET | `/api/auth/callback` | OAuth callback → JWT |
| GET | `/api/auth/me` | Current user info |

## License

MIT
