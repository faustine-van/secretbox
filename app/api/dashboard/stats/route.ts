import { createSupabaseServerClient } from '@/lib/server/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

  // Fetch counts in parallel
  const [
    { count: totalSecrets, error: secretsError },
    { count: totalCollections, error: collectionsError }
  ] = await Promise.all([
    supabase.from('keys').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('collections').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  if (secretsError || collectionsError) {
    return NextResponse.json({ 
      error: secretsError?.message || collectionsError?.message 
    }, { status: 500 });
  }

  // Placeholder for team members and security score
  const teamMembers = 1; 
  const securityScore = 98;

  return NextResponse.json({
    totalSecrets: totalSecrets ?? 0,
    totalCollections: totalCollections ?? 0,
    teamMembers,
    securityScore,
  });
}
