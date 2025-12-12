# Blowtorch XML Importer - Next.js Web App

A modern web application that allows users to import Blowtorch MUD client configurations (aliases and triggers) from XML files into SQLite databases. All processing happens **client-side in the browser** - no data is uploaded to any server.

## 🌟 Features

- **100% Client-Side Processing** - Your files never leave your browser
- **Drag & Drop Interface** - Easy file upload
- **Automatic ID Management** - Automatically finds next available IDs
- **Real-time Feedback** - See import progress and results
- **Instant Download** - Get your updated database immediately
- **Privacy-First** - No server storage, no data collection
- **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **sql.js** - SQLite in the browser (WebAssembly)
- **Vercel** - Deployment platform

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Vercel account (for deployment)

## 🛠️ Installation

```bash
# Clone or extract the project
cd blowtorch-importer

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

## 🏃 Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎯 How It Works

1. **User uploads two files:**
   - Blowtorch XML configuration file
   - SQLite database file (.db)

2. **Client-side processing:**
   - Parse XML to extract aliases and triggers
   - Load SQLite database in browser memory (using sql.js)
   - Query for next available IDs
   - Insert new records with proper escaping

3. **Download updated database:**
   - Export modified database
   - Trigger automatic download
   - Original files remain unchanged

## 🔒 Privacy & Security

- **No Server Processing** - All operations happen in your browser
- **No File Upload** - Files are processed locally using FileReader API
- **No Data Storage** - Nothing is saved on any server
- **Open Source** - Full transparency of code

## 📊 Database Schema

The app expects these tables in your SQLite database:

```sql
CREATE TABLE Alias (
    id INTEGER PRIMARY KEY,
    connection_id INTEGER,
    name TEXT,
    todo TEXT,
    partialMatch INTEGER
);

CREATE TABLE Trigger (
    id INTEGER PRIMARY KEY,
    connection_id INTEGER,
    name TEXT,
    enabled INTEGER,
    regexp TEXT,
    todo TEXT,
    use_regexp INTEGER
);
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

### Modify Connection ID Default

Edit `app/lib/importer.ts`:

```typescript
export async function importToDatabase(
  dbBuffer: ArrayBuffer,
  aliases: Alias[],
  triggers: Trigger[],
  connectionId: number = 5  // Change default here
)
```

## 🐛 Troubleshooting

### SQL.js Loading Issues

If you see errors loading sql.js, ensure you have internet connection as it loads the WASM file from CDN.

### Large File Processing

Very large files (>50MB) may cause browser memory issues. Consider processing in chunks or increasing Node memory:

```bash
NODE_OPTIONS='--max-old-space-size=4096' npm run dev
```

### TypeScript Errors

Ensure all dependencies are installed:

```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## 📝 Project Structure

```
blowtorch-importer/
├── app/
│   ├── components/
│   │   ├── FileUploader.tsx    # File upload component
│   │   └── ImportResults.tsx   # Results display
│   ├── lib/
│   │   └── importer.ts         # Core import logic
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page
├── public/                     # Static assets
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- sql.js for bringing SQLite to the browser
- Next.js team for the amazing framework
- Vercel for hosting and deployment platform

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for the MUD gaming community
