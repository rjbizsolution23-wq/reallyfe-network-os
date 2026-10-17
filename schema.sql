-- 🏛️ RealLyfe Productions / Street Starz Media Operating System
-- Cloudflare D1 Relational Schema
-- Architecture: Rick Jefferson | Lead Enterprise Architect @ RJ Business Solutions

-- 1. Vault Subscriptions & VIP Memberships
CREATE TABLE IF NOT EXISTS vault_memberships (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  tier TEXT NOT NULL CHECK(tier IN ('monthly_9_99', 'annual_99_00', 'boxset_29_99')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'past_due', 'canceled', 'trialing')),
  vault_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vault_email ON vault_memberships(email);
CREATE INDEX IF NOT EXISTS idx_vault_token ON vault_memberships(vault_token);

-- 2. Lead Captures (Banned Vault Funnel)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  lead_magnet TEXT NOT NULL DEFAULT 'banned_vault_3_pack',
  utm_source TEXT DEFAULT 'youtube_pinned_comment',
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted_to_vault INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- 3. High-Margin Merch Orders & Box Sets
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  shipping_address TEXT,
  subtotal REAL NOT NULL,
  gross_margin_est REAL NOT NULL,
  items_json TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK(fulfillment_status IN ('unfulfilled', 'in_production', 'shipped', 'delivered')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- 4. B2B Commercial Sponsorship & Sit-down Inquiries
CREATE TABLE IF NOT EXISTS sponsorship_inquiries (
  id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package_type TEXT NOT NULL CHECK(package_type IN ('in_studio_interview', 'monthly_title_sponsor', 'digital_overlay_pack', 'custom_enterprise')),
  budget REAL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'contract_sent', 'closed_won', 'closed_lost')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sponsors_status ON sponsorship_inquiries(status);

-- 5. Broadcast Episodes & Archival Catalog Cache
CREATE TABLE IF NOT EXISTS episodes (
  id TEXT PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  duration TEXT,
  view_count_approx TEXT,
  category TEXT DEFAULT 'Dallas Underground / Street Documentary',
  vault_exclusive INTEGER DEFAULT 0,
  published_date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_episodes_yt_id ON episodes(youtube_id);
