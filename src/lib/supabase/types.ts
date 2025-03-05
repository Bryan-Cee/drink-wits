export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          content: string;
          type: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          content: string;
          type: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          content?: string;
          type?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          card_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          card_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          card_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'favorites_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      game_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          join_code: string;
          creator_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          join_code: string;
          creator_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          join_code?: string;
          creator_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'game_sessions_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_game_sessions: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          session_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          session_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_game_sessions_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_game_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          display_name: string | null;
          avatar_url: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
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
}
