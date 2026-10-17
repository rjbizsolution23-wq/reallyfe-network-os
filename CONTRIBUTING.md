# Contributing to Reallyfe Street Starz Media Operating System

Thank you for contributing to the **Reallyfe Street Starz Media OS**, engineered for **RealLyfe Productions LLC** by **RJ Business Solutions**.

## Development Workflow

### 1. Prerequisites
- **Node.js** v22+
- **npm** or **pnpm**
- **Wrangler** CLI (`npm install -g wrangler`) for Cloudflare edge deployment

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/rjbizsolution23-wq/reallyfe-network-os.git
cd reallyfe-network-os

# Install dependencies
npm install

# Run static asset preview
npm run build
python3 -m http.server 8989 --directory public
```

### 3. Verification & Testing
Before submitting any changes or opening a pull request, you must execute the automated verification test suite:
```bash
# Run TypeScript compilation check
npm run build

# Run automated system verification
npm test
```
All tests must pass with 0 errors.

## Code Standards
- **Cloudflare-First**: Prefer lightweight edge primitives, Hono routing, and Cloudflare D1 SQL.
- **Brand Standards**: Adhere strictly to RJ Business Solutions design principles. No sci-fi/cyan palettes.
- **Data Integrity**: Never hardcode temporary values. Maintain backwards compatibility with legacy Shopify catalog items.
