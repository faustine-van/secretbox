// lib/server/audit.ts
import { createSupabaseServerClient } from '@/lib/server/supabase';

import type { Database } from '@/types/supabase';

type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

/**
 * Logs an audit event with IP and user agent information.
 */
export async function auditLog(
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId: string | null,
  request: Request,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();  
    
    // Extract IP address from request headers
    const ip = getIpAddress(request);
    
    // Extract user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    // Calculate basic risk score
    const riskScore = calculateRiskScore(action, ip);
    
    const auditEvent: AuditLogInsert = {
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      ip_address: ip,
      user_agent: userAgent,
      metadata: {
        ...metadata,
        risk_score: riskScore,
        timestamp: new Date().toISOString(),
      },
      success: true,
      duration: 0,
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert([auditEvent]);

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

/**
 * Alternative audit function with event object
 */
export async function audit(
  event: AuditLogInsert & { 
    ip?: string; 
    userAgent?: string; 
  }
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { ip, userAgent, ...eventData } = event;
    
    const riskScore = calculateRiskScore(event.action, ip || '');
    
    const auditEvent: AuditLogInsert = {
      ...eventData,
      ip_address: ip || null,
      user_agent: userAgent || null,
      metadata: {
        ...eventData.metadata,
        risk_score: riskScore,
      }
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert([auditEvent]);

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

/**
 * Extract IP address from request headers
 */
function getIpAddress(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return 'unknown';
}

/**
 * Calculate basic risk score without external dependencies
 */
function calculateRiskScore(action: string, ip?: string): number {
  let score = 0;
  
  if (action.includes('delete')) score += 10;
  if (action.includes('update')) score += 5;
  if (action.includes('login_fail')) score += 20;
  if (action.includes('master_password')) score += 15;
  if (action.includes('export')) score += 8;
  
  if (ip === 'unknown') score += 5;
  
  return Math.min(score, 100);
}