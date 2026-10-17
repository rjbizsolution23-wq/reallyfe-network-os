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
