/**
 * Database Types
 * These types represent the database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          tenant_id: string | null
          full_name: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id?: string | null
          full_name?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          full_name?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          status: string | null
          service_type: string[] | null
          location: Json | null
          progress: number | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          status?: string | null
          service_type?: string[] | null
          location?: Json | null
          progress?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          status?: string | null
          service_type?: string[] | null
          location?: Json | null
          progress?: number | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          project_id: string
          tenant_id: string
          name: string
          file_path: string
          file_type: string | null
          file_size: number | null
          version: number | null
          parent_file_id: string | null
          uploaded_by: string | null
          is_starred: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tenant_id: string
          name: string
          file_path: string
          file_type?: string | null
          file_size?: number | null
          version?: number | null
          parent_file_id?: string | null
          uploaded_by?: string | null
          is_starred?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tenant_id?: string
          name?: string
          file_path?: string
          file_type?: string | null
          file_size?: number | null
          version?: number | null
          parent_file_id?: string | null
          uploaded_by?: string | null
          is_starred?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          project_id: string
          tenant_id: string
          sender_id: string
          content: string
          read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tenant_id: string
          sender_id: string
          content: string
          read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tenant_id?: string
          sender_id?: string
          content?: string
          read?: boolean | null
          created_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          project_id: string
          tenant_id: string
          file_id: string | null
          approver_id: string
          status: string | null
          comments: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          tenant_id: string
          file_id?: string | null
          approver_id: string
          status?: string | null
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          tenant_id?: string
          file_id?: string | null
          approver_id?: string
          status?: string | null
          comments?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          tenant_id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

