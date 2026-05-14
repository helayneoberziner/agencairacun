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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          service: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          service?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
        }
        Relationships: []
      }
      lgpd_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          mensagem: string
          nome: string
          status: string
          telefone: string | null
          tipo_solicitacao: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          mensagem: string
          nome: string
          status?: string
          telefone?: string | null
          tipo_solicitacao: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          mensagem?: string
          nome?: string
          status?: string
          telefone?: string | null
          tipo_solicitacao?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          actions: string | null
          category: string
          client_name: string | null
          context: string | null
          created_at: string
          deliveries: string[] | null
          description: string | null
          display_order: number | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          results: string | null
          seo_description: string | null
          slug: string | null
          subcategory: string | null
          testimonial_author: string | null
          testimonial_text: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          actions?: string | null
          category: string
          client_name?: string | null
          context?: string | null
          created_at?: string
          deliveries?: string[] | null
          description?: string | null
          display_order?: number | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          results?: string | null
          seo_description?: string | null
          slug?: string | null
          subcategory?: string | null
          testimonial_author?: string | null
          testimonial_text?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          actions?: string | null
          category?: string
          client_name?: string | null
          context?: string | null
          created_at?: string
          deliveries?: string[] | null
          description?: string | null
          display_order?: number | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          results?: string | null
          seo_description?: string | null
          slug?: string | null
          subcategory?: string | null
          testimonial_author?: string | null
          testimonial_text?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      proposal_suggestions: {
        Row: {
          category: string
          created_at: string
          id: string
          text: string
          usage_count: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          text: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          text?: string
          usage_count?: number
        }
        Relationships: []
      }
      proposals: {
        Row: {
          audiovisual_bonus: string[]
          audiovisual_differentials: string[]
          audiovisual_includes: string[]
          audiovisual_price: string
          client_name: string
          complete_bonus: string[]
          complete_differentials: string[]
          complete_includes: string[]
          complete_price: string
          created_at: string
          id: string
          is_active: boolean
          marketing_bonus: string[]
          marketing_differentials: string[]
          marketing_includes: string[]
          marketing_price: string
          slug: string
          updated_at: string
          validity_days: number
          whatsapp_number: string
        }
        Insert: {
          audiovisual_bonus?: string[]
          audiovisual_differentials?: string[]
          audiovisual_includes?: string[]
          audiovisual_price?: string
          client_name?: string
          complete_bonus?: string[]
          complete_differentials?: string[]
          complete_includes?: string[]
          complete_price?: string
          created_at?: string
          id?: string
          is_active?: boolean
          marketing_bonus?: string[]
          marketing_differentials?: string[]
          marketing_includes?: string[]
          marketing_price?: string
          slug: string
          updated_at?: string
          validity_days?: number
          whatsapp_number?: string
        }
        Update: {
          audiovisual_bonus?: string[]
          audiovisual_differentials?: string[]
          audiovisual_includes?: string[]
          audiovisual_price?: string
          client_name?: string
          complete_bonus?: string[]
          complete_differentials?: string[]
          complete_includes?: string[]
          complete_price?: string
          created_at?: string
          id?: string
          is_active?: boolean
          marketing_bonus?: string[]
          marketing_differentials?: string[]
          marketing_includes?: string[]
          marketing_price?: string
          slug?: string
          updated_at?: string
          validity_days?: number
          whatsapp_number?: string
        }
        Relationships: []
      }
      segment_pages: {
        Row: {
          content: Json
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          og_image_url: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: Json
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          photo_url: string | null
          role: string
          social_links: Json
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          photo_url?: string | null
          role: string
          social_links?: Json
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          photo_url?: string | null
          role?: string
          social_links?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
