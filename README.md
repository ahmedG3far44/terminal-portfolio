# Portfolio Application

A personal portfolio website built with React, featuring themes, multi-language support, GitHub integration, and an admin dashboard.

## Tech Stack

- **Framework**: React 18 + Vite
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Markdown**: react-markdown, remark-gfm, rehype-highlight

## Features

### 1. Multi-Theme System

- 10+ built-in themes (Neon, Retro, Cyber, Forest, Ocean, etc.)
- Theme switcher in bottom-right corner
- Keyboard shortcut: `Ctrl+Space` to cycle themes
- Persistent theme selection via localStorage

### 2. Bilingual Support

- English and Arabic languages
- Language toggle button
- RTL support for Arabic
- All UI text translatable via `src/data/en.json` and `src/data/ar.json`

### 3. GitHub Streaks Board

- Fetches GitHub contribution data via GraphQL API
- Displays:
  - Total contributions, commits, PRs, reviews, issues
  - Current and longest streaks
  - 52-week contribution heatmap (2026 only)
- Uses theme colors for visual consistency
- Full-width responsive layout

### 4. Project Management

- Dynamic projects loaded from `src/data/db.json`
- Each project has:
  - Title, description, slug
  - Repository URL, live demo URL
  - Tags, tech stack, tools
- Project detail pages render README.md from GitHub repos

### 5. README Rendering

- Fetches README.md from GitHub repos via REST API
- Supports:
  - Headers (h1-h6)
  - Bold, italic, strikethrough
  - Code blocks with syntax highlighting
  - Images (auto-sized)
  - Links (external open in new tab)
  - Task lists (checkboxes)
  - Blockquotes
  - Tables
  - Horizontal rules

### 6. Admin Dashboard

**Access**: `/admin` route

**Features**:
- Password-protected login
- Fixed dark sidebar layout (shadcn-style)
- Responsive: sidebar on desktop, hamburger on mobile
- Auto-scroll to top when editing projects

**Tabs**:

- **Projects**: Add/edit/delete projects with validation
  - Title: required
  - Slug: required, lowercase letters/numbers/hyphens only
  - URLs: must start with http:// or https://
  - Error messages below invalid fields

- **GitHub Repos**: Import repositories
  - Fetch repos from GitHub API
  - Toggle to select repos
  - Import selected to projects list
  - Shows stars and forks count

- **Skills**: Manage skills
  - Add via input + Enter or button
  - Delete with X button on chip

- **Personal Info**: Edit profile
  - Name, title, bio, email, LinkedIn, GitHub

### 7. Keyboard Shortcuts

- `Ctrl+Space`: Cycle themes
- Theme and language hints shown on page load

## Configuration

### Environment Variables

Create `.env` file in root:

```env
VITE_GITHUB_USERNAME=your_username
VITE_GITHUB_TOKEN=your_github_pat
VITE_ADMIN_PASSWORD=your_password
```

### GitHub Token

Create a Personal Access Token at: https://github.com/settings/tokens

Required scopes:
- `read:user` - Read user data
- `repo` - Read repository data

### Data Files

- `src/data/db.json`: Projects, skills, personal info
- `src/data/en.json`: English translations
- `src/data/ar.json`: Arabic translations

## Running

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Controls.jsx      # Theme/language switcher
│   ├── GitHubBoard.jsx  # GitHub streaks
│   ├── ReadmeParser.jsx # Markdown renderer
│   └── ...
├── context/
│   ├── AdminContext.jsx   # Admin state
│   ├── GitHubContext.jsx  # GitHub API
│   ├── LanguageContext.jsx # i18n
│   └── ThemeContext.jsx   # Theme state
├── data/
│   ├── db.json   # Database
│   ├── en.json  # English
│   └── ar.json  # Arabic
├── pages/
│   ├── AdminDashboard.jsx  # Admin panel
│   ├── ProjectDetails.jsx # Project page
│   └── Theme.jsx          # Main page
└── App.jsx               # Root component
```

## License

MIT