-- ============================================
-- Advertising Agency Platform - SQL Schema
-- Database: PostgreSQL 15+
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255),
    "role" VARCHAR(50) DEFAULT 'viewer' CHECK ("role" IN ('admin', 'manager', 'analyst', 'viewer')),
    "avatar_url" VARCHAR(500),
    "is_active" BOOLEAN DEFAULT true,
    "last_login_at" TIMESTAMP,
    "email_verified_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX "idx_users_email" ON "users" ("email");
CREATE INDEX "idx_users_is_active" ON "users" ("is_active");
CREATE INDEX "idx_users_deleted_at" ON "users" ("deleted_at");

-- ============================================
-- REFRESH TOKENS TABLE (for blacklist)
-- ============================================
CREATE TABLE "refresh_tokens" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP NOT NULL,
    "revoked_at" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "ip_address" INET,
    "user_agent" TEXT
);

CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" ("user_id");
CREATE INDEX "idx_refresh_tokens_token_hash" ON "refresh_tokens" ("token_hash");
CREATE INDEX "idx_refresh_tokens_expires_at" ON "refresh_tokens" ("expires_at");

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE "clients" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "industry" VARCHAR(100),
    "website" VARCHAR(500),
    "notes" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX "idx_clients_email" ON "clients" ("email");
CREATE INDEX "idx_clients_company" ON "clients" ("company");
CREATE INDEX "idx_clients_is_active" ON "clients" ("is_active");
CREATE INDEX "idx_clients_deleted_at" ON "clients" ("deleted_at");
CREATE INDEX "idx_clients_name_search" ON "clients" USING gin ("name" gin_trgm_ops);

-- ============================================
-- CAMPAIGNS TABLE
-- ============================================
CREATE TABLE "campaigns" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id"),
    "client_id" UUID REFERENCES "clients"("id"),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(50) DEFAULT 'draft' CHECK ("status" IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    "budget" DECIMAL(12, 2) NOT NULL CHECK ("budget" >= 0),
    "spent" DECIMAL(12, 2) DEFAULT 0 CHECK ("spent" >= 0),
    "start_date" TIMESTAMP NOT NULL,
    "end_date" TIMESTAMP,
    "platform" VARCHAR(50) NOT NULL CHECK ("platform" IN ('google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'multi')),
    "targeting" JSONB DEFAULT '{}',
    "creative" JSONB DEFAULT '{}',
    "objective" VARCHAR(50) NOT NULL CHECK ("objective" IN ('awareness', 'traffic', 'engagement', 'leads', 'conversions')),
    "metrics" JSONB DEFAULT '{"impressions":0,"clicks":0,"conversions":0,"ctr":0,"conversion_rate":0,"cpc":0,"cpa":0}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX "idx_campaigns_user_id" ON "campaigns" ("user_id");
CREATE INDEX "idx_campaigns_client_id" ON "campaigns" ("client_id");
CREATE INDEX "idx_campaigns_status" ON "campaigns" ("status");
CREATE INDEX "idx_campaigns_platform" ON "campaigns" ("platform");
CREATE INDEX "idx_campaigns_start_date" ON "campaigns" ("start_date");
CREATE INDEX "idx_campaigns_deleted_at" ON "campaigns" ("deleted_at");
CREATE INDEX "idx_campaigns_name_search" ON "campaigns" USING gin ("name" gin_trgm_ops);
CREATE INDEX "idx_campaigns_status_deleted" ON "campaigns" ("status", "deleted_at") WHERE "deleted_at" IS NULL;

-- ============================================
-- CREATIVES TABLE
-- ============================================
CREATE TABLE "creatives" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id"),
    "campaign_id" UUID REFERENCES "campaigns"("id"),
    "prompt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('text', 'image', 'video')),
    "tone" VARCHAR(50) NOT NULL CHECK ("tone" IN ('professional', 'casual', 'humorous', 'urgent')),
    "platform" VARCHAR(50) NOT NULL CHECK ("platform" IN ('google', 'facebook', 'instagram', 'linkedin', 'tiktok')),
    "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected', 'revised')),
    "version" INTEGER DEFAULT 1,
    "feedback" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX "idx_creatives_user_id" ON "creatives" ("user_id");
CREATE INDEX "idx_creatives_campaign_id" ON "creatives" ("campaign_id");
CREATE INDEX "idx_creatives_status" ON "creatives" ("status");
CREATE INDEX "idx_creatives_type" ON "creatives" ("type");
CREATE INDEX "idx_creatives_deleted_at" ON "creatives" ("deleted_at");

-- ============================================
-- ANALYTICS TABLE
-- ============================================
CREATE TABLE "analytics" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "campaign_id" UUID NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
    "date" DATE NOT NULL,
    "impressions" INTEGER DEFAULT 0 CHECK ("impressions" >= 0),
    "clicks" INTEGER DEFAULT 0 CHECK ("clicks" >= 0),
    "conversions" INTEGER DEFAULT 0 CHECK ("conversions" >= 0),
    "spend" DECIMAL(12, 2) DEFAULT 0 CHECK ("spend" >= 0),
    "ctr" DECIMAL(5, 4) DEFAULT 0,
    "conversion_rate" DECIMAL(5, 4) DEFAULT 0,
    "cpc" DECIMAL(10, 4) DEFAULT 0,
    "cpa" DECIMAL(10, 4) DEFAULT 0,
    "demographics" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_analytics_campaign_id" ON "analytics" ("campaign_id");
CREATE INDEX "idx_analytics_date" ON "analytics" ("date");
CREATE UNIQUE INDEX "idx_analytics_campaign_date" ON "analytics" ("campaign_id", "date");

-- ============================================
-- INVOICES TABLE
-- ============================================
CREATE TABLE "invoices" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "client_id" UUID NOT NULL REFERENCES "clients"("id"),
    "number" VARCHAR(50) UNIQUE NOT NULL,
    "amount" DECIMAL(12, 2) NOT NULL CHECK ("amount" >= 0),
    "status" VARCHAR(50) DEFAULT 'pending' CHECK ("status" IN ('pending', 'paid', 'overdue', 'cancelled')),
    "issue_date" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "paid_at" TIMESTAMP,
    "description" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_invoices_client_id" ON "invoices" ("client_id");
CREATE INDEX "idx_invoices_number" ON "invoices" ("number");
CREATE INDEX "idx_invoices_status" ON "invoices" ("status");
CREATE INDEX "idx_invoices_due_date" ON "invoices" ("due_date");

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE "audit_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES "users"("id"),
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "changes" JSONB DEFAULT '{}',
    "ip_address" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" ("user_id");
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs" ("entity_type", "entity_id");
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" ("action");
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" ("created_at");

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE "notifications" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "campaign_id" UUID REFERENCES "campaigns"("id") ON DELETE SET NULL,
    "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('ctr_low', 'budget_high', 'campaign_ended', 'milestone', 'custom')),
    "severity" VARCHAR(50) DEFAULT 'info' CHECK ("severity" IN ('info', 'warning', 'critical')),
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}',
    "is_read" BOOLEAN DEFAULT false,
    "read_at" TIMESTAMP,
    "triggered_by" VARCHAR(100),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX "idx_notifications_user_id" ON "notifications" ("user_id");
CREATE INDEX "idx_notifications_campaign_id" ON "notifications" ("campaign_id");
CREATE INDEX "idx_notifications_type" ON "notifications" ("type");
CREATE INDEX "idx_notifications_is_read" ON "notifications" ("is_read");
CREATE INDEX "idx_notifications_user_read" ON "notifications" ("user_id", "is_read");
CREATE INDEX "idx_notifications_created_at" ON "notifications" ("created_at");
CREATE INDEX "idx_notifications_deleted_at" ON "notifications" ("deleted_at");

-- ============================================
-- ALERT RULES TABLE
-- ============================================
CREATE TABLE "alert_rules" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('ctr_low', 'budget_high', 'spend_rate', 'impressions_drop', 'custom')),
    "condition" JSONB NOT NULL,
    "severity" VARCHAR(50) DEFAULT 'warning' CHECK ("severity" IN ('info', 'warning', 'critical')),
    "is_enabled" BOOLEAN DEFAULT true,
    "cooldown_minutes" INTEGER DEFAULT 60,
    "last_triggered_at" TIMESTAMP,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_alert_rules_user_id" ON "alert_rules" ("user_id");
CREATE INDEX "idx_alert_rules_type" ON "alert_rules" ("type");
CREATE INDEX "idx_alert_rules_enabled" ON "alert_rules" ("user_id", "is_enabled");

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_clients_updated_at" BEFORE UPDATE ON "clients"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_campaigns_updated_at" BEFORE UPDATE ON "campaigns"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_creatives_updated_at" BEFORE UPDATE ON "creatives"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_analytics_updated_at" BEFORE UPDATE ON "analytics"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_invoices_updated_at" BEFORE UPDATE ON "invoices"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
