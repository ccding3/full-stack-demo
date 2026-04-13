export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          avatar_url: string | null;
          role: "admin" | "user";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "user";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "user";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          signed_in_at: string;
          signed_out_at: string | null;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          signed_in_at?: string;
          signed_out_at?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          signed_in_at?: string;
          signed_out_at?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      dashboard_stats: {
        Row: {
          total_users: number | null;
          active_users: number | null;
          online_users: number | null;
          new_users_30d: number | null;
        };
        Relationships: [];
      };
      registration_trend: {
        Row: {
          date: string | null;
          count: number | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type DashboardStats = Database["public"]["Views"]["dashboard_stats"]["Row"];
export type RegistrationTrend = Database["public"]["Views"]["registration_trend"]["Row"];
