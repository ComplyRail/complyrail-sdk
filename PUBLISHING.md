# Publishing ComplyRail SDK to npm

The SDK is ready to publish! Choose one of these methods:

## Method 1: Automatic Publishing (Recommended)

Uses GitHub Actions to publish automatically when you create a release.

### Setup (One-time)

1. Get npm token from https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Create a "Publish" token (not "Read-only")

2. Add to GitHub repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token

3. Update package.json if needed:
   - Change `"version": "0.1.0"` to your desired version
   - Update registry scope if using `@org/complyrail-sdk`

### Publishing

```bash
# Create a release on GitHub
git tag v0.1.0
git push origin v0.1.0

# Or use GitHub CLI:
gh release create v0.1.0 --generate-notes
```

The workflow will automatically:
- Install dependencies
- Run tests
- Build the package
- Publish to npm

## Method 2: Manual Publishing

### Setup

```bash
npm login
# Enter your npm username, password, and OTP (if enabled)
```

### Publishing

```bash
# Verify version in package.json
npm run build
npm test -- --run

# Publish to npm
npm publish
```

## Method 3: Using .npmrc

Create `.npmrc` from `.npmrc.example`:

```bash
cp .npmrc.example .npmrc
# Add your NPM_TOKEN to .npmrc
npm publish
```

## After Publishing

### Update App Dependency

Change in `complyrail-app/package.json`:

```json
{
  "dependencies": {
    "complyrail-sdk": "^0.1.0"
  }
}
```

Then update app lock file:

```bash
cd complyrail-app
npm install
```

### Tag Release

```bash
gh release create v0.1.0 --title "SDK v0.1.0" --notes "Initial SDK release"
```

## Testing Published Package

```bash
npm install complyrail-sdk
```

Verify in Node:
```javascript
const { IVMS101Builder, ComplyRailClient } = require('complyrail-sdk');
console.log('SDK loaded successfully!');
```
