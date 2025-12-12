# Quick Fix for Vercel Deployment

If you encounter TypeScript errors about `sql.js` during Vercel deployment, here are the solutions:

## Solution 1: Install Type Definitions (Recommended)

The package.json already includes `@types/sql.js`. Just make sure to run:

```bash
npm install
```

This should automatically install the types.

## Solution 2: Type Declaration File (Backup)

A `types/sql.js.d.ts` file is included in the project. This provides TypeScript definitions for sql.js.

The `tsconfig.json` is configured to pick this up automatically with:
```json
"typeRoots": ["./node_modules/@types", "./"]
```

## Solution 3: Skip Type Checking (Not Recommended)

If you need to deploy quickly and skip type checking:

1. Add to `next.config.js`:
```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
}
```

## Verifying the Fix

After deploying, test locally first:

```bash
npm install
npm run build
```

If it builds successfully locally, it will build on Vercel.

## Common Issues

### Issue: `Cannot find module 'sql.js'`
**Solution:** Run `npm install sql.js @types/sql.js`

### Issue: Type errors persist
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Issue: Vercel build fails but local works
**Solution:** Check that all files are committed to git:
```bash
git add types/
git add tsconfig.json
git add package.json
git commit -m "Add TypeScript types for sql.js"
git push
```

## Testing Before Deploy

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# Test dev server
npm run dev
```

If all these work, Vercel deployment should succeed!
