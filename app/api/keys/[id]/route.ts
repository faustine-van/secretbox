
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { UpdateKeySchema, KeyRevealSchema } from '@/lib/validations';
import { encrypt, decrypt } from '@/lib/server/encryption';
import { validateMasterPassword } from '@/lib/server/auth';
import { auditEncryption } from '@/lib/server/audit';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: key, error } = await supabase
    .from('keys')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 });
  }

  // Decrypting the key value requires master password
  const { masterPassword } = await request.json();
  const { error: validationError } = KeyRevealSchema.safeParse({ masterPassword });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const isMasterPasswordValid = await validateMasterPassword(session.user.id, masterPassword);
  if (!isMasterPasswordValid) {
    return NextResponse.json({ error: 'Invalid master password' }, { status: 401 });
  }

  const decryptedValue = await decrypt(key.value, key.iv, key.auth_tag, key.salt, session.user.id);

  await supabase
    .from('keys')
    .update({ last_accessed_at: new Date().toISOString(), access_count: key.access_count + 1 })
    .eq('id', params.id);

  return NextResponse.json({ ...key, value: decryptedValue });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, value, collectionId, type, expiresAt } = await request.json();

  const { error: validationError } = UpdateKeySchema.safeParse({ name, value, collectionId, type, expiresAt });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { encryptedValue, iv, authTag, salt } = await encrypt(value, session.user.id);

  const { data: updatedKey, error: updateError } = await supabase
    .from('keys')
    .update({
      name,
      value: encryptedValue,
      iv,
      auth_tag: authTag,
      collection_id: collectionId,
      key_type: type,
      expires_at: expiresAt,
    })
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await auditEncryption({ action: 'update_key', success: true, duration: 0, user_id: session.user.id, resource_id: updatedKey.id });

  return NextResponse.json(updatedKey);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('keys')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditEncryption({ action: 'delete_key', success: true, duration: 0, user_id: session.user.id, resource_id: params.id });

  return NextResponse.json({ message: 'Key deleted successfully' });
}
