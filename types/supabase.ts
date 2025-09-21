
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: AuditEvent;
        Insert: Omit<AuditEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditEvent, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      keys: {
        Row: {
          id: string;
          collection_id: string;
          user_id: string;
          name: string;
          encrypted_value: string;
          iv: string; // Changed from encryption_iv
          auth_tag: string;
          salt: string; // Added this field
          description: string | null;
          key_type: string;
          tags: string[] | null;
          url: string | null;
          username: string | null;
          expires_at: string | null;
          is_favorite: boolean;
          last_accessed_at: string | null;
          access_count: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          collection_id: string;
          user_id: string;
          name: string;
          value: string;
          iv: string;
          auth_tag: string;
          created_at?: string;
          key_type: string;
          last_accessed_at?: string | null;
        };
        Update: {
          id?: string;
          collection_id?: string;
          user_id?: string;
          name?: string;
          value?: string;
          iv?: string;
          auth_tag?: string;
          created_at?: string;
          key_type?: string;
          last_accessed_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
    
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Collection = Database['public']['Tables']['collections']['Row'];
export type Key = Database['public']['Tables']['keys']['Row'];

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface EncryptionResult {
  encryptedValue: string;
  iv: string;
  authTag: string;
  salt: string;
}

export interface CryptoError extends Error {
  code?: string;
}

export interface AuditEvent {
  id: number;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
  success: boolean;
  duration: number;
  error?: Error;
}

export type KeyType = "api_key" | "secret" | "token" | "credential";

export interface KeyFormData {
  name: string;
  value: string;
  collectionId: string;
  type: KeyType;
  expiresAt?: Date;
}

export interface KeySearchParams {
  query?: string;
  collectionId?: string;
  type?: KeyType;
  sortBy?: "name" | "createdAt" | "lastAccessedAt";
  page?: number;
}

export interface KeyRevealRequest {
  masterPassword: string;
}

export interface CollectionFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}
