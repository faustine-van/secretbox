import { createSupabaseServerClient } from '@/lib/server/supabase';
import { UpdateKeySchema, KeyRevealSchema } from '@/lib/validations';
import { encrypt, decrypt } from '@/lib/server/encryption';
import { validateMasterPassword } from '@/lib/server/auth';
import { audit } from '@/lib/server/audit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: key, error } = await supabase
    .from('keys')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  return NextResponse.json(key);
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, value, collectionId, type, expiresAt } = await request.json();

  const { error: validationError } = UpdateKeySchema.safeParse({ name, value, collectionId, type, expiresAt });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { encryptedValue, iv, authTag, salt } = await encrypt(value, user.id);

  const { data: updatedKey, error: updateError } = await supabase
    .from('keys')
    .update({
      name,
      encrypted_value: encryptedValue,
      iv, // Changed from encryption_iv to iv
      auth_tag: authTag,
      salt, // Added missing salt field
      collection_id: collectionId,
      key_type: type,
      expires_at: expiresAt,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await audit({ 
    action: 'update_key', 
    success: true, 
    duration: 0, 
    user_id: user.id, 
    resource_id: updatedKey.id, 
    resource_type: 'key', 
    ip_address: request.headers.get('x-forwarded-for'), 
    user_agent: request.headers.get('user-agent'), 
    metadata: {} 
  });

  return NextResponse.json(updatedKey);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await audit({ 
    action: 'delete_key', 
    success: true, 
    duration: 0, 
    user_id: user.id, 
    resource_id: id, 
    resource_type: 'key', // Fixed: was 'collection', should be 'key'
    ip_address: request.headers.get('x-forwarded-for'), 
    user_agent: request.headers.get('user-agent'), 
    metadata: {} 
  });

  return NextResponse.json({ message: 'Key deleted successfully' });
}