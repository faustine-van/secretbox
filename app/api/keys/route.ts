
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { CreateKeySchema } from '@/lib/validations';
import { encrypt } from '@/lib/server/encryption';
import { auditEncryption } from '@/lib/server/audit';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: keys, error, count } = await supabase
    .from('keys')
    .select('*', { count: 'exact' })
    .eq('user_id', session.user.id)
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys, count });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, value, collectionId, type, expiresAt } = await request.json();

  const { error: validationError } = CreateKeySchema.safeParse({ name, value, collectionId, type, expiresAt });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { encryptedValue, iv, authTag, salt } = await encrypt(value, session.user.id);

  const { data: newKey, error: insertError } = await supabase
    .from('keys')
    .insert({
      name,
      value: encryptedValue,
      iv,
      auth_tag: authTag,
      collection_id: collectionId,
      user_id: session.user.id,
      key_type: type,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await auditEncryption({ action: 'create_key', success: true, duration: 0, user_id: session.user.id, resource_id: newKey.id });

  return NextResponse.json(newKey);
}
