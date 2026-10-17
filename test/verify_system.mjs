import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('🏛️ Verification 1: Asset Pipeline & Scraped Imagery', () => {
  const productImgDir = path.join(rootDir, 'public/assets/products');
  const ytThumbDir = path.join(rootDir, 'public/assets/youtube');
  const logoPath = path.join(rootDir, 'public/assets/branding/logo_transparent.png');

  assert.ok(fs.existsSync(productImgDir), 'Product images directory exists');
  assert.ok(fs.existsSync(ytThumbDir), 'YouTube thumbnails directory exists');
  assert.ok(fs.existsSync(logoPath), 'Branded transparent logo exists in branding directory');

  const productImages = fs.readdirSync(productImgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  const ytThumbs = fs.readdirSync(ytThumbDir).filter(f => f.endsWith('.jpg') || f.endsWith('.webp'));

  assert.ok(productImages.length >= 60, `Expected at least 60 product images, found: ${productImages.length}`);
  assert.ok(ytThumbs.length >= 10, `Expected at least 10 video thumbnails, found: ${ytThumbs.length}`);
  console.log(`  ✓ Verified ${productImages.length} scraped apparel assets and ${ytThumbs.length} YouTube thumbnails`);
});

test('🏛️ Verification 2: Catalogs & High-Margin Financial Models', () => {
  const catalogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/catalog.json'), 'utf8'));
  const rebuiltData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/rebuilt_ecosystem.json'), 'utf8'));
  const ytData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/youtube_catalog.json'), 'utf8'));

  assert.equal(catalogData.length, 46, 'Legacy Shopify catalog preserves all 46 products');
  assert.ok(ytData.length >= 20, 'YouTube catalog contains top episodes');
  assert.ok(rebuiltData.collections.length >= 3, 'Rebuilt ecosystem collections configured');

  const drops = rebuiltData.collections.find(c => c.id === 'streetwear_drops');
  const vault = rebuiltData.collections.find(c => c.id === 'digital_vault');
  const b2b = rebuiltData.collections.find(c => c.id === 'commercial_services');

  assert.ok(drops && drops.items.length >= 3, 'Streetwear drops batch configured');
  assert.ok(vault && vault.items.length >= 3, 'Vault memberships properly tiered');
  assert.ok(b2b && b2b.items.length >= 2, 'B2B commercial services defined');

  // Verify financial margin calculations
  for (const item of drops.items) {
    const margin = (item.price - item.cost_to_produce) / item.price;
    assert.ok(margin >= 0.70, `Item ${item.title} has margin >= 70% (actual: ${(margin * 100).toFixed(1)}%)`);
  }
  console.log(`  ✓ Verified 46 catalog items, ${ytData.length} indexed episodes, and 70%+ gross margin on all rebuilt drops`);
});

test('🏛️ Verification 3: Hono Edge API Endpoints', async () => {
  // Test /api/health
  const healthRes = await app.request('/api/health');
  assert.equal(healthRes.status, 200);
  const healthJson = await healthRes.json();
  assert.equal(healthJson.status, 'online');
  assert.equal(healthJson.subscribers, '1.53M+');

  // Test /api/catalog
  const catRes = await app.request('/api/catalog');
  assert.equal(catRes.status, 200);
  const catJson = await catRes.json();
  assert.equal(catJson.raw_products_count, 46);

  // Test /api/youtube
  const ytRes = await app.request('/api/youtube');
  assert.equal(ytRes.status, 200);
  const ytJson = await ytRes.json();
  assert.ok(ytJson.total_episodes_indexed >= 20);

  // Test /api/vault/checkout
  const checkoutRes = await app.request('/api/vault/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier: 'annual_99_00', email: 'test@reallyfe.com', name: 'Test Fan' })
  });
  assert.equal(checkoutRes.status, 200);
  const checkoutJson = await checkoutRes.json();
  assert.equal(checkoutJson.success, true);
  assert.ok(checkoutJson.vault_token.startsWith('vlt_'));

  // Test /api/leads/banned-vault
  const leadRes = await app.request('/api/leads/banned-vault', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fan@reallyfe.com', phone: '214-555-0199' })
  });
  assert.equal(leadRes.status, 200);
  const leadJson = await leadRes.json();
  assert.equal(leadJson.success, true);

  // Test /api/sponsors/inquire
  const sponsorRes = await app.request('/api/sponsors/inquire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: 'Apex Energy',
      contact_name: 'Jordan Cole',
      email: 'jordan@apexenergy.com',
      package_type: 'monthly_title_sponsor',
      budget: 7500
    })
  });
  assert.equal(sponsorRes.status, 200);
  const sponsorJson = await sponsorRes.json();
  assert.equal(sponsorJson.success, true);

  console.log('  ✓ All 6 Hono Edge API endpoints verified with 200 OK responses and valid JSON payloads');
});

test('🏛️ Verification 4: Executive Deliverables & PDF Compilation', () => {
  const proposalHtml = path.join(rootDir, 'client-deliverables/reallyfe_executive_scaling_proposal.html');
  const proposalPdf = path.join(rootDir, 'client-deliverables/reallyfe_executive_scaling_proposal.pdf');

  assert.ok(fs.existsSync(proposalHtml), 'Executive scaling proposal HTML exists');
  assert.ok(fs.existsSync(proposalPdf), 'Compiled standalone PDF exists');
  
  const pdfStats = fs.statSync(proposalPdf);
  assert.ok(pdfStats.size > 200000, `PDF size is valid and substantial: ${pdfStats.size} bytes`);
  console.log(`  ✓ Verified Executive Scaling Proposal HTML and Standalone PDF (${(pdfStats.size / 1024).toFixed(1)} KB)`);
});

test('🏛️ Verification 5: Multi-Page Architecture & Commercial Ad Units', () => {
  const pages = [
    'public/index.html',
    'public/episodes.html',
    'public/vault.html',
    'public/store.html',
    'public/sponsors.html',
    'public/about.html',
    'public/admin.html'
  ];

  for (const page of pages) {
    const fullPath = path.join(rootDir, page);
    assert.ok(fs.existsSync(fullPath), `Page exists: ${page}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.length > 3000, `Page ${page} has substantial production content (${content.length} chars)`);
    assert.ok(content.includes('Dallas Justice Defense Group') || content.includes('RealLyfe') || content.includes('Oyeneye'), `Page ${page} includes brand/sponsor content`);
  }

  // Verify ads configuration file
  const adsPath = path.join(rootDir, 'public/data/ads.json');
  assert.ok(fs.existsSync(adsPath), 'Ads configuration json exists');
  const adsData = JSON.parse(fs.readFileSync(adsPath, 'utf8'));
  assert.ok(adsData.ad_units.length >= 4, 'At least 4 active ad units configured');

  console.log(`  ✓ Verified all 7 multi-page routes and ${adsData.ad_units.length} active monetization ad units`);
});

test('🏛️ Verification 6: High-Fidelity Branding & Universal Admin Navigation', () => {
  const pages = [
    'public/index.html',
    'public/episodes.html',
    'public/vault.html',
    'public/store.html',
    'public/sponsors.html',
    'public/about.html',
    'public/admin.html'
  ];

  const brandFiles = [
    'public/assets/branding/logo_transparent.png',
    'public/assets/branding/logo_white_tight.png',
    'public/assets/branding/logo_black_tight.png',
    'public/assets/branding/logo_icon_dark.png',
    'public/assets/branding/logo_icon_light.png',
    'public/assets/branding/favicon.png'
  ];

  for (const bFile of brandFiles) {
    const fullPath = path.join(rootDir, bFile);
    assert.ok(fs.existsSync(fullPath), `Brand asset exists: ${bFile}`);
  }

  for (const page of pages) {
    const fullPath = path.join(rootDir, page);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Verify favicon link exists
    assert.ok(content.includes('favicon.png'), `Page ${page} contains favicon.png link`);

    // Verify official tight logo is used
    assert.ok(
      content.includes('logo_white_tight.png') || content.includes('logo_black_tight.png'),
      `Page ${page} embeds official RealLyfe Street Starz logo image`
    );

    // Verify admin command desk link or page title exists
    if (page !== 'public/admin.html') {
      assert.ok(
        content.includes('/admin.html') || content.includes('admin.html'),
        `Page ${page} includes direct navigation link to executive Command Desk (/admin.html)`
      );
    }
  }

  console.log(`  ✓ Verified official RealLyfe Street Starz logo, favicon, and bi-directional admin navigation across all 7 pages`);
});

test('🏛️ Verification 7: Mobile Responsiveness, Touch Optimization & Universal Mobile Navigation', () => {
  const pages = [
    'public/index.html',
    'public/episodes.html',
    'public/vault.html',
    'public/store.html',
    'public/sponsors.html',
    'public/about.html',
    'public/admin.html'
  ];

  for (const page of pages) {
    const fullPath = path.join(rootDir, page);
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Mobile viewport meta tag
    assert.ok(content.includes('name="viewport"'), `Page ${page} must contain responsive viewport meta tag`);
    assert.ok(content.includes('width=device-width'), `Page ${page} viewport must set width=device-width`);

    // 2. Mobile navigation drawer element
    assert.ok(content.includes('id="mobile-menu-drawer"'), `Page ${page} must contain id="mobile-menu-drawer" container`);

    // 3. Mobile hamburger trigger button
    assert.ok(content.includes('id="mobile-menu-toggle-btn"'), `Page ${page} must contain id="mobile-menu-toggle-btn"`);
    assert.ok(content.includes('toggleMobileMenu()'), `Page ${page} must invoke toggleMobileMenu()`);

    // 4. Toggle helper JavaScript
    assert.ok(content.includes('function toggleMobileMenu()'), `Page ${page} must include toggleMobileMenu implementation`);

    // 5. Check all main routes linked in mobile menu
    assert.ok(content.includes('href="/episodes.html"'), `Page ${page} mobile drawer links to episodes`);
    assert.ok(content.includes('href="/vault.html"'), `Page ${page} mobile drawer links to vault`);
    assert.ok(content.includes('href="/store.html"'), `Page ${page} mobile drawer links to store`);
    assert.ok(content.includes('href="/sponsors.html"'), `Page ${page} mobile drawer links to sponsors`);
    assert.ok(content.includes('href="/about.html"'), `Page ${page} mobile drawer links to about`);
  }

  console.log(`  ✓ Verified full mobile optimization, hamburger controls, responsive drawers, and touch navigation across all 7 pages`);
});

