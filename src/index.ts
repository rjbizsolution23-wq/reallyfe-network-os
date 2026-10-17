import { Hono } from 'hono';
import { cors } from 'hono/cors';
import catalogData from '../data/catalog.json' with { type: 'json' };
import youtubeData from '../data/youtube_catalog.json' with { type: 'json' };
import rebuiltData from '../data/rebuilt_ecosystem.json' with { type: 'json' };

type Bindings = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());

// API Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'online',
    network: 'Reallyfe Street Starz Media Operating System',
    founder: 'Jeff Oyeneye',
    subscribers: '1.53M+',
    engine: 'Cloudflare Workers (Hono runtime)',
    timestamp: new Date().toISOString()
  });
});

// Catalog Endpoints
app.get('/api/catalog', (c) => {
  return c.json({
    rebuilt_ecosystem: rebuiltData,
    raw_products_count: catalogData.length,
    raw_products: catalogData.slice(0, 20)
  });
});

// YouTube Catalog
app.get('/api/youtube', (c) => {
  return c.json({
    channel: '@RealLyfeProductions',
    total_episodes_indexed: youtubeData.length,
    episodes: youtubeData
  });
});

// Vault Membership Checkout Simulation
app.post('/api/vault/checkout', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { tier, email, phone, name } = body;
  
  if (!email || !tier) {
    return c.json({ error: 'Email and membership tier are required' }, 400);
  }

  return c.json({
    success: true,
    message: `Successfully provisioned ${tier} membership for ${email}`,
    vault_token: `vlt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
    unlocked_features: [
      '100% Uncut, unbleeped interviews',
      '48-Hour early access before YouTube',
      'Unredacted court and street files',
      'Exclusive post-interview discussions'
    ],
    customer: { name, email, phone, tier }
  });
});

// Lead Magnet Capture (Banned Vault)
app.post('/api/leads/banned-vault', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { email, phone, name } = body;

  if (!email && !phone) {
    return c.json({ error: 'Valid email or phone number is required' }, 400);
  }

  return c.json({
    success: true,
    message: 'Access granted to The Banned Vault',
    lead_id: `lead_${Date.now()}`,
    vault_url: '/#vault',
    banned_files_unlocked: 3
  });
});

// B2B Sponsor & Interview Intake
app.post('/api/sponsors/inquire', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { brand_name, contact_name, email, phone, package_type, budget, notes } = body;

  return c.json({
    success: true,
    inquiry_id: `spn_${Date.now()}`,
    message: 'Sponsorship inquiry received. Executive team will respond within 24 hours.',
    details: {
      brand_name,
      contact_name,
      package_type,
      estimated_reach: '1.53M+ Subscribers'
    }
  });
});

// Fallback to static assets
app.all('*', (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
