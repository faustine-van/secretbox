export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          theme_preference: string | null;
          master_password_hash: string | null;
          two_factor_enabled: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          theme_preference?: string | null;
          master_password_hash?: string | null;
          two_factor_enabled?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          theme_preference?: string | null;
          master_password_hash?: string | null;
          two_factor_enabled?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string | null;
          icon: string | null;
          is_archived: boolean;
          sort_order: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_archived?: boolean;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string | null;
          icon?: string | null;
          is_archived?: boolean;
          sort_order?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      keys: {
        Row: {
          id: string;
          user_id: string;
          collection_id: string | null;
          name: string;
          encrypted_value: string;
          iv: string;
          auth_tag: string;
          salt: string;
          description: string | null;
          key_type: key_type | null;
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
          user_id: string;
          collection_id?: string | null;
          name: string;
          encrypted_value: string;
          iv: string;
          auth_tag: string;
          salt: string;
          description?: string | null;
          key_type?: key_type | null;
          tags?: string[] | null;
          url?: string | null;
          username?: string | null;
          expires_at?: string | null;
          is_favorite?: boolean;
          last_accessed_at?: string | null;
          access_count?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          collection_id?: string | null;
          name?: string;
          encrypted_value?: string;
          iv?: string;
          auth_tag?: string;
          salt?: string;
          description?: string | null;
          key_type?: key_type | null;
          tags?: string[] | null;
          url?: string | null;
          username?: string | null;
          expires_at?: string | null;
          is_favorite?: boolean;
          last_accessed_at?: string | null;
          access_count?: number;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: number;
          user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          ip_address: any | null; // INET type
          user_agent: string | null;
          metadata: Json | null;
          success: boolean;
          duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          ip_address?: any | null;
          user_agent?: string | null;
          metadata?: Json | null;
          success?: boolean;
          duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          ip_address?: any | null;
          user_agent?: string | null;
          metadata?: Json | null;
          success?: boolean;
          duration?: number | null;
          created_at?: string;
        };
      };
    };
    Views: { [_in in never]: never };
    Functions: { [_in in never]: never };
    Enums: {
      key_type: "api_key" | "secret" | "token" | "credential";
    };
    CompositeTypes: { [_in in never]: never };
  };
};

export type key_type = Database["public"]["Enums"]["key_type"];

export type Profile = Database['public']['Tables']['user_profiles']['Row'];
export type Collection = Database['public']['Tables']['collections']['Row'];
export type Key = Database['public']['Tables']['keys']['Row'];
export type AuditEvent = Database['public']['Tables']['audit_logs']['Row'];

export interface KeyFormData {
  name: string;
  value: string;
  collectionId: string;
  key_type: key_type;
  expiresAt?: Date;
  
}

export interface CollectionFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_archived?: boolean;
  
}

export interface EncryptionResult {
  encryptedValue: string;
  iv: string;
  authTag: string;
  salt: string;
}