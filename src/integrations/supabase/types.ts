export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      article_authors: {
        Row: {
          affiliation: string | null
          article_id: string
          author_order: number
          contact_email: string | null
          created_at: string
          full_name: string
          id: string
          is_corresponding: boolean
          orcid_id: string | null
        }
        Insert: {
          affiliation?: string | null
          article_id: string
          author_order?: number
          contact_email?: string | null
          created_at?: string
          full_name: string
          id?: string
          is_corresponding?: boolean
          orcid_id?: string | null
        }
        Update: {
          affiliation?: string | null
          article_id?: string
          author_order?: number
          contact_email?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_corresponding?: boolean
          orcid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_authors_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_keywords: {
        Row: {
          article_id: string
          id: string
          keyword: string
        }
        Insert: {
          article_id: string
          id?: string
          keyword: string
        }
        Update: {
          article_id?: string
          id?: string
          keyword?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_keywords_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_metrics: {
        Row: {
          altmetric_score: number | null
          article_id: string
          downloads: number
          id: string
          updated_at: string
          views: number
        }
        Insert: {
          altmetric_score?: number | null
          article_id: string
          downloads?: number
          id?: string
          updated_at?: string
          views?: number
        }
        Update: {
          altmetric_score?: number | null
          article_id?: string
          downloads?: number
          id?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "article_metrics_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: true
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_purchases: {
        Row: {
          amount_cents: number
          article_id: string
          id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          amount_cents?: number
          article_id: string
          id?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          article_id?: string
          id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_purchases_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_versions: {
        Row: {
          article_id: string
          created_at: string
          id: string
          notes: string | null
          pdf_url: string | null
          version_number: number
          version_type: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          notes?: string | null
          pdf_url?: string | null
          version_number?: number
          version_type?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          pdf_url?: string | null
          version_number?: number
          version_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_versions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          abstract: string | null
          access_type: string
          article_type: string
          authors: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          decided_at: string | null
          decision: string | null
          doi: string | null
          editor_id: string | null
          editor_notes: string | null
          full_text_html: string | null
          id: string
          is_locked: boolean
          issue: number | null
          journal_id: string | null
          keywords: string[] | null
          pdf_url: string | null
          price_cents: number | null
          published_date: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string | null
          submitted_by: string | null
          title: string
          volume: number | null
        }
        Insert: {
          abstract?: string | null
          access_type?: string
          article_type?: string
          authors: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: string | null
          doi?: string | null
          editor_id?: string | null
          editor_notes?: string | null
          full_text_html?: string | null
          id?: string
          is_locked?: boolean
          issue?: number | null
          journal_id?: string | null
          keywords?: string[] | null
          pdf_url?: string | null
          price_cents?: number | null
          published_date?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title: string
          volume?: number | null
        }
        Update: {
          abstract?: string | null
          access_type?: string
          article_type?: string
          authors?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: string | null
          doi?: string | null
          editor_id?: string | null
          editor_notes?: string | null
          full_text_html?: string | null
          id?: string
          is_locked?: boolean
          issue?: number | null
          journal_id?: string | null
          keywords?: string[] | null
          pdf_url?: string | null
          price_cents?: number | null
          published_date?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          title?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
        ]
      }
      citations: {
        Row: {
          cited_article_id: string | null
          cited_authors: string | null
          cited_doi: string | null
          cited_journal: string | null
          cited_title: string | null
          cited_year: number | null
          citing_article_id: string
          created_at: string
          id: string
        }
        Insert: {
          cited_article_id?: string | null
          cited_authors?: string | null
          cited_doi?: string | null
          cited_journal?: string | null
          cited_title?: string | null
          cited_year?: number | null
          citing_article_id: string
          created_at?: string
          id?: string
        }
        Update: {
          cited_article_id?: string | null
          cited_authors?: string | null
          cited_doi?: string | null
          cited_journal?: string | null
          cited_title?: string | null
          cited_year?: number | null
          citing_article_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "citations_cited_article_id_fkey"
            columns: ["cited_article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citations_citing_article_id_fkey"
            columns: ["citing_article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          subject?: string
        }
        Relationships: []
      }
      editorial_board_members: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      institutional_access: {
        Row: {
          contact_email: string | null
          created_at: string
          expires_at: string | null
          id: string
          institution_name: string
          ip_range_end: unknown
          ip_range_start: unknown
          subscription_active: boolean
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          institution_name: string
          ip_range_end: unknown
          ip_range_start: unknown
          subscription_active?: boolean
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          institution_name?: string
          ip_range_end?: unknown
          ip_range_start?: unknown
          subscription_active?: boolean
        }
        Relationships: []
      }
      journals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          impact_factor: number | null
          issn: string | null
          publisher: string | null
          subject_category: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          impact_factor?: number | null
          issn?: string | null
          publisher?: string | null
          subject_category?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          impact_factor?: number | null
          issn?: string | null
          publisher?: string | null
          subject_category?: string
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          institution: string | null
          is_approved: boolean
          last_name: string | null
          marketing_opt_out: boolean
          state_province: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          institution?: string | null
          is_approved?: boolean
          last_name?: string | null
          marketing_opt_out?: boolean
          state_province?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          institution?: string | null
          is_approved?: boolean
          last_name?: string | null
          marketing_opt_out?: boolean
          state_province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_admins: { Args: never; Returns: number }
      count_editors: { Args: never; Returns: number }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_approved: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "reviewer" | "publisher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "reviewer", "publisher"],
    },
  },
} as const
