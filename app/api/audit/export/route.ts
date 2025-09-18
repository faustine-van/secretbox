
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: audit_logs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = [
    'id,created_at,action,resource_type,resource_id,ip_address,user_agent,metadata',
    ...audit_logs.map(log => `${log.id},${log.created_at},${log.action},${log.resource_type},${log.resource_id},${log.ip_address},${log.user_agent},${JSON.stringify(log.metadata)}`)
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="audit_logs.csv"',
    },
  });
}
