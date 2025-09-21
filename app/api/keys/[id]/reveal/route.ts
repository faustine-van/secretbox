import { createSupabaseServerClient } from '@/lib/server/supabase';
import { KeyRevealSchema } from '@/lib/validations';
import { decrypt } from '@/lib/server/encryption';
import { validateMasterPassword } from '@/lib/server/auth';
import { audit } from '@/lib/server/audit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  // Await params before using its properties (Next.js 15 requirement)
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

  // Debug: Log what fields are actually returned
  console.log('Key fields:', Object.keys(key));
  console.log('Key data:', {
    hasValue: !!key.value,
    hasEncryptedValue: !!key.encrypted_value,
    hasIv: !!key.iv,
    hasAuthTag: !!key.auth_tag,
    hasSalt: !!key.salt
  });

  // Debug: Log what we actually received from the database
  console.log('Retrieved key from database:', {
    id: key.id,
    hasEncryptedValue: !!key.encrypted_value,
    encryptedValueLength: key.encrypted_value?.length || 0,
    hasIv: !!key.iv,
    ivLength: key.iv?.length || 0,
    hasAuthTag: !!key.auth_tag,
    authTagLength: key.auth_tag?.length || 0,
    hasSalt: !!key.salt,
    saltLength: key.salt?.length || 0,
    allKeys: Object.keys(key)
  });

  // Validate that all required encryption fields are present
  // Note: Database uses 'iv' instead of 'iv', and may not have 'salt'
  if (!key.encrypted_value || !key.iv || !key.auth_tag) {
    console.error('Missing encryption fields:', {
      encrypted_value: key.encrypted_value,
      iv: key.iv,
      auth_tag: key.auth_tag,
      salt: key.salt || 'N/A'
    });
    
    await audit({
      action: 'reveal_key_failed',
      success: false,
      duration: 0,
      user_id: user.id,
      resource_id: id,
      resource_type: 'key',
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
      metadata: { 
        error: 'Missing encryption data', 
        received_fields: Object.keys(key),
        field_values: {
          encrypted_value: !!key.encrypted_value,
          iv: !!key.iv,
          auth_tag: !!key.auth_tag,
          salt: !!key.salt
        }
      }
    });
    return NextResponse.json({ error: 'Key data is corrupted' }, { status: 500 });
  }

  const body = await request.json();
  const { masterPassword } = body;
  
  const validation = KeyRevealSchema.safeParse({ masterPassword });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const isMasterPasswordValid = await validateMasterPassword(user.id, masterPassword);
  if (!isMasterPasswordValid) {
    await audit({
      action: 'reveal_key_failed',
      success: false,
      duration: 0,
      user_id: user.id,
      resource_id: id,
      resource_type: 'key',
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
      metadata: {}
    });
    return NextResponse.json({ error: 'Invalid master password' }, { status: 401 });
  }

  try {
    const decryptedValue = await decrypt(
      key.encrypted_value,
      key.iv,
      key.auth_tag,
      key.salt,
      user.id
    );

    await supabase
      .from('keys')
      .update({
        last_accessed_at: new Date().toISOString(),
        access_count: key.access_count + 1
      })
      .eq('id', id);

    await audit({
      action: 'reveal_key',
      success: true,
      duration: 0,
      user_id: user.id,
      resource_id: id,
      resource_type: 'key',
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
      metadata: {}
    });

    return NextResponse.json({ value: decryptedValue });
  } catch (error) {
    await audit({
      action: 'reveal_key_failed',
      success: false,
      duration: 0,
      user_id: user.id,
      resource_id: id,
      resource_type: 'key',
      ip_address: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
      metadata: { error: (error as Error).message }
    });
    return NextResponse.json({ error: 'Failed to decrypt key' }, { status: 500 });
  }
}