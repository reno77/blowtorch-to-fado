# Vercel Deployment Guide

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Fastest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/blowtorch-importer.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel auto-detects Next.js - no configuration needed!
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd blowtorch-importer
vercel

# For production deployment
vercel --prod
```

## Environment Variables

This app doesn't require any environment variables! Everything runs client-side.

## Configuration

### Custom Domain

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Build Settings

Vercel automatically detects:
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

You don't need to change these!

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster cold starts, you can enable Edge Runtime:

Add to `app/page.tsx`:
```typescript
export const runtime = 'edge'
```

### Enable Caching

sql.js WASM file is cached by default via CDN.

## Monitoring

### View Deployment Logs

```bash
vercel logs YOUR_DEPLOYMENT_URL
```

### Real-time Logs

```bash
vercel logs YOUR_DEPLOYMENT_URL --follow
```

## Troubleshooting

### Build Fails

**Check Node Version:**
```bash
# In vercel.json, add:
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "build": {
    "env": {
      "NODE_VERSION": "18.x"
    }
  }
}
```

### sql.js Not Loading

The app loads sql.js from CDN. Ensure:
1. Your deployment has internet access
2. CDN is not blocked in your region
3. Try using a different CDN if needed

### Large File Uploads

Vercel has a **4.5MB** request body limit for serverless functions.

**Solution:** This app processes files client-side, so there's no limit! Files are processed in the browser.

## Updating Your Deployment

### Automatic Updates (Recommended)

Every git push to main branch auto-deploys:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys!
```

### Manual Deploy

```bash
vercel --prod
```

## Security Best Practices

1. **Enable HTTPS** (Default on Vercel)
2. **Add Security Headers** (Optional):

Create `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## Cost

- **Hobby Plan:** FREE
  - 100 GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for personal projects

- **Pro Plan:** $20/month
  - 1 TB bandwidth
  - Team collaboration
  - Advanced analytics

This app is perfect for the **free tier**!

## Post-Deployment Checklist

- [ ] Test file upload functionality
- [ ] Verify XML parsing works
- [ ] Test database download
- [ ] Check mobile responsiveness
- [ ] Test with large files
- [ ] Monitor initial load time
- [ ] Set up custom domain (optional)
- [ ] Add to README: your live URL

## Example .env.local (Optional)

If you want to add analytics later:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics (Free!)
# Just install: npm i @vercel/analytics
```

Then in `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel Support: support@vercel.com

## Success! 🎉

Your app should now be live at:
`https://YOUR_PROJECT.vercel.app`

Share the link with your MUD gaming community!
