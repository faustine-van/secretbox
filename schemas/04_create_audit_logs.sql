
-- 04_create_audit_logs.sql

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  success BOOLEAN DEFAULT TRUE,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments to audit_logs table
COMMENT ON TABLE public.audit_logs IS 'Tracks user actions for security and auditing.';

-- Add indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);
