
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { CreateCollectionSchema } from '@/lib/validations';
import { audit } from '@/lib/server/audit';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

  const supabase = await createSupabaseServerClient();
  const { data: { user: session } } = await supabase.auth.getUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: collections, error } = await supabase
    .from('collections')
    .select('*, keys(count)')
    .eq('user_id', session.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user: session } } = await supabase.auth.getUser();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description } = await request.json();

  const { error: validationError } = CreateCollectionSchema.safeParse({ name, description });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { data: newCollection, error: insertError } = await supabase
    .from('collections')
    .insert({
      name,
      description,
      user_id: session.id,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await audit({ action: 'create_collection', success: true, duration: 0, user_id: session.id, resource_id: newCollection.id, resource_type: 'collection', ip_address: request.headers.get('x-forwarded-for'), user_agent: request.headers.get('user-agent'), metadata: {} });

  return NextResponse.json(newCollection);
}
