# GitHub Profile Panels

A dynamic GitHub profile trophy generator that creates beautiful SVG panels displaying your GitHub achievements with customizable themes and rankings. Similar to [ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy), but with enhanced features and a modern design.

![GitHub Profile Panels](https://img.shields.io/badge/GitHub-Profile%20Panels-blue?style=for-the-badge)

## Example 

<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=vampire">
<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=aura">
<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=kimbie-dark">
<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=dark-lover">
<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=matrix">
<img src = "https://git-jadugar-trophies.vercel.app/api/panels?username=varchasvakhare2022&theme=discord">

## ✨ Features

- 🏆 **Trophy System**: Earn grades (S+, S, A+, A, B+, B, C+, C, D) based on your GitHub activity
- 🎨 **Multiple Themes**: 30+ beautiful themes including vampire, dracula, onedark, and more
- 📊 **Comprehensive Stats**: Tracks Stars, Commits, Pull Requests, Issues, Repositories, and Followers
- 🎯 **Progress Bars**: Visual progress indicators showing how close you are to the next rank
- 🎨 **Customizable Layout**: Control columns, rows, margins, and card appearance
- ⚡ **Fast & Cached**: SVG generation with caching for optimal performance
- 🔄 **Auto-reload**: Development server with hot-reloading using nodemon

## 📁 Project Structure

```
Github-Profile-Panels/
├── api/
│   └── panels.js          # Main API endpoint for generating panels
├── src/
│   ├── github.js          # GitHub API integration and data fetching
│   ├── render.js          # SVG rendering and trophy generation
│   └── themes.js          # Theme definitions and color schemes
├── server.js              # Local development server
├── package.json           # Project dependencies and scripts
├── vercel.json            # Vercel deployment configuration
├── nodemon.json           # Nodemon configuration for auto-reload
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 18.x
- **Dependencies**:
  - `node-fetch` (^2.7.0) - HTTP client for GitHub API requests
  - `dotenv` (^17.2.3) - Environment variable management
- **Dev Dependencies**:
  - `nodemon` (^3.1.11) - Auto-reload development server
- **Deployment**: Vercel (Serverless Functions)
- **Output Format**: SVG (Scalable Vector Graphics)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- (Optional) GitHub Personal Access Token for higher API rate limits

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-profile-panels.git
   cd github-profile-panels
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional but recommended)
   
   Create a `.env` file in the root directory:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```
   
   To create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with `public_repo` scope (and `repo` scope for private repos)
   - Copy the token and add it to your `.env` file

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000`

5. **Test the endpoint**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000/api/panels?username=your-github-username
   ```

## 📖 Usage

### Basic Usage

Simply add the following to your GitHub profile README:

**Option 1: Markdown (may have spacing issues)**
```markdown
![GitHub Profile Panels](https://your-vercel-app.vercel.app/api/panels?username=your-username)
```

**Option 2: HTML (Recommended - eliminates spacing)**
```html
<div style="line-height: 0; margin: 0; padding: 0; display: block;">
  <img src="https://your-vercel-app.vercel.app/api/panels?username=your-username" alt="GitHub Trophies" style="display: block; margin: 0; padding: 0; vertical-align: bottom; line-height: 0; border: 0;" />
</div>
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `username` | string | **required** | GitHub username to generate panels for |
| `theme` | string | `dracula` | Theme name (see available themes below) |
| `column` | number | `6` | Number of columns (use `-1` for auto) |
| `row` | number | `3` | Number of rows |
| `margin-w` | number | `10` | Horizontal margin between cards (in pixels) |
| `margin-h` | number | `10` | Vertical margin between cards (in pixels) |
| `no-bg` | boolean | `false` | Remove background (transparent) |
| `no-frame` | boolean | `false` | Remove card frames/borders |

### Examples

**Basic usage with default theme:**
```
/api/panels?username=varchasvakhare2022
```

**Custom theme:**
```
/api/panels?username=varchasvakhare2022&theme=vampire
```

**Custom layout:**
```
/api/panels?username=varchasvakhare2022&column=3&row=2
```

**Transparent background:**
```
/api/panels?username=varchasvakhare2022&no-bg=true&no-frame=true
```

## 🏆 Grade Thresholds

The trophy system uses the following thresholds to determine your grade:

### Stars
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 1000 |
| S | ≥ 500 |
| A+ | ≥ 250 |
| A | ≥ 100 |
| B+ | ≥ 50 |
| B | ≥ 25 |
| C+ | ≥ 10 |
| C | ≥ 1 |
| D | < 1 |

### Commits
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 10,000 |
| S | ≥ 5,000 |
| A+ | ≥ 2,500 |
| A | ≥ 1,000 |
| B+ | ≥ 500 |
| B | ≥ 250 |
| C+ | ≥ 100 |
| C | ≥ 1 |
| D | < 1 |

### Pull Requests
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 500 |
| S | ≥ 250 |
| A+ | ≥ 100 |
| A | ≥ 50 |
| B+ | ≥ 25 |
| B | ≥ 10 |
| C+ | ≥ 5 |
| C | ≥ 1 |
| D | < 1 |

### Issues
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 500 |
| S | ≥ 250 |
| A+ | ≥ 100 |
| A | ≥ 50 |
| B+ | ≥ 25 |
| B | ≥ 10 |
| C+ | ≥ 5 |
| C | ≥ 1 |
| D | < 1 |

### Repositories
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 100 |
| S | ≥ 50 |
| A+ | ≥ 25 |
| A | ≥ 10 |
| B+ | ≥ 5 |
| B | ≥ 2 |
| C+ | ≥ 1 |
| C | ≥ 0 |
| D | < 0 |

### Followers
| Grade | Threshold |
|-------|-----------|
| S+ | ≥ 1,000 |
| S | ≥ 500 |
| A+ | ≥ 250 |
| A | ≥ 100 |
| B+ | ≥ 50 |
| B | ≥ 25 |
| C+ | ≥ 10 |
| C | ≥ 1 |
| D | < 1 |

## 🎨 Available Themes

The project includes 30+ themes. Here are some popular ones:

- `vampire` - Dark purple background with red accents
- `dracula` - Purple and pink theme (default)
- `onedark` - Dark theme with red accents
- `gruvbox` - Warm dark theme
- `monokai` - Vibrant dark theme
- `nord` - Arctic, north-bluish color palette
- `darkhub` - GitHub dark theme
- `matrix` - Green on black (Matrix style)
- `tokyonight` - Tokyo Night color scheme
- `flat` - Light, minimal theme

**Full list of themes:**
`flat`, `onedark`, `gruvbox`, `dracula`, `monokai`, `chalk`, `nord`, `alduin`, `darkhub`, `juicyfresh`, `buddhism`, `oldie`, `radical`, `onestar`, `discord`, `algolia`, `gitdimmed`, `tokyonight`, `matrix`, `apprentice`, `dark_dimmed`, `dark_lover`, `kimbie_dark`, `aura`, `vampire`

## 🔧 How It Works

1. **API Request**: When you request `/api/panels?username=xxx`, the server receives the request
2. **GitHub API Fetching**: The `github.js` module fetches user data from GitHub API:
   - User profile information
   - Repository statistics (stars, forks)
   - Commits (using Search API with fallback to repository-based counting)
   - Pull requests (using Search API)
   - Issues (using Search API)
3. **Rank Calculation**: The `render.js` module calculates grades based on thresholds
4. **SVG Generation**: Trophy icons, progress bars, and text are rendered as SVG
5. **Response**: The generated SVG is returned with appropriate headers and caching

### Data Fetching Strategy

- **Stars & Forks**: Aggregated from all user repositories
- **Commits**: 
  - Primary: GitHub Search API (requires authentication for higher limits)
  - Fallback: Iterates through repositories and counts commits per repo
- **Pull Requests & Issues**: GitHub Search API
- **Rate Limits**: 
  - Without token: 60 requests/hour
  - With token: 5,000 requests/hour

## 🚢 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   
   In Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your token value

4. **Update your README**
   
   Replace the URL in your GitHub profile README:
   ```markdown
   ![GitHub Profile Panels](https://your-app.vercel.app/api/panels?username=your-username)
   ```

### Manual Deployment

The project is configured for Vercel serverless functions. The `vercel.json` file specifies:
- Runtime: Node.js 18.x
- Function directory: `api/`

## 📝 Development

### Scripts

- `npm run dev` - Start development server with auto-reload (nodemon)
- `npm start` - Start production server

### File Structure Details

- **`api/panels.js`**: Main API endpoint handler
- **`src/github.js`**: Handles all GitHub API interactions
- **`src/render.js`**: SVG generation and trophy rendering logic
- **`src/themes.js`**: Theme color definitions
- **`server.js`**: Local development server that mimics Vercel functions

### Customization

To customize trophy thresholds, edit the `thresholds` object in `src/render.js`:

```javascript
{
  title: "Stars",
  value: Number(user.totalStars) || 0,
  thresholds: { SPlus: 1000, S: 500, APlus: 250, A: 100, BPlus: 50, B: 25, CPlus: 10, C: 1 }
}
```

To add a new theme, edit `src/themes.js`:

```javascript
mytheme: {
  background: "#ffffff",
  cardBg: "#f3f4f6",
  text: "#111827",
  accent: "#2563eb",
  border: "#e5e7eb"
}
```

## 🐛 Troubleshooting

### Rate Limit Exceeded

- **Solution**: Add a `GITHUB_TOKEN` to your `.env` file
- Ensure the token has the `public_repo` scope (and `repo` scope if needed)

### Commits Not Showing

- The commits counter uses GitHub Search API which requires authentication
- If Search API fails, it falls back to repository-based counting
- Ensure your `GITHUB_TOKEN` has proper scopes

### Server Not Starting

- Check if port 3000 is already in use
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18.x or higher)

## 📄 License

MIT License - feel free to use this project for your own GitHub profile!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add new themes

## 🙏 Acknowledgments

- Inspired by [ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy)
- Built with ❤️ for the GitHub community

---

**Made with ❤️ by the GitHub Profile Panels community**

