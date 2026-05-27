export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "empresa" | "freelancer";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "empresa" | "freelancer";
          created_at?: string;
        };
        Update: {
          email?: string;
          role?: "empresa" | "freelancer";
          created_at?: string;
        };
        Relationships: [];
      };
      empresas: {
        Row: {
          id: string;
          nome: string;
          cnpj: string;
          cep: string | null;
          endereco: string | null;
          bairro: string | null;
          numero: string | null;
          whatsapp: string | null;
          logo_url: string | null;
          descricao: string | null;
          plano_ativo: boolean;
        };
        Insert: {
          id: string;
          nome: string;
          cnpj: string;
          cep?: string | null;
          endereco?: string | null;
          bairro?: string | null;
          numero?: string | null;
          whatsapp?: string | null;
          logo_url?: string | null;
          descricao?: string | null;
          plano_ativo?: boolean;
        };
        Update: {
          nome?: string;
          cnpj?: string;
          cep?: string | null;
          endereco?: string | null;
          bairro?: string | null;
          numero?: string | null;
          whatsapp?: string | null;
          logo_url?: string | null;
          descricao?: string | null;
          plano_ativo?: boolean;
        };
        Relationships: [];
      };
      freelancers: {
        Row: {
          id: string;
          nome_completo: string;
          cpf: string;
          cidade: string;
          estado: string;
          telefone: string | null;
          habilidades: string[] | null;
          bio: string | null;
        };
        Insert: {
          id: string;
          nome_completo: string;
          cpf: string;
          cidade: string;
          estado: string;
          telefone?: string | null;
          habilidades?: string[] | null;
          bio?: string | null;
        };
        Update: {
          nome_completo?: string;
          cpf?: string;
          cidade?: string;
          estado?: string;
          telefone?: string | null;
          habilidades?: string[] | null;
          bio?: string | null;
        };
        Relationships: [];
      };
      vagas: {
        Row: {
          id: string;
          empresa_id: string;
          titulo: string;
          descricao: string;
          valor: number | null;
          tipo_valor: "dia" | "hora" | "projeto" | null;
          horario: string | null;
          cidade: string;
          estado: string;
          bairro: string | null;
          requisitos: string | null;
          ativa: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          empresa_id: string;
          titulo: string;
          descricao: string;
          valor?: number | null;
          tipo_valor?: "dia" | "hora" | "projeto" | null;
          horario?: string | null;
          cidade: string;
          estado: string;
          bairro?: string | null;
          requisitos?: string | null;
          ativa?: boolean;
          created_at?: string;
        };
        Update: {
          empresa_id?: string;
          titulo?: string;
          descricao?: string;
          valor?: number | null;
          tipo_valor?: "dia" | "hora" | "projeto" | null;
          horario?: string | null;
          cidade?: string;
          estado?: string;
          bairro?: string | null;
          requisitos?: string | null;
          ativa?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      candidaturas: {
        Row: {
          id: string;
          vaga_id: string;
          freelancer_id: string;
          mensagem: string | null;
          status: "pendente" | "aceita" | "recusada";
          created_at: string;
        };
        Insert: {
          id?: string;
          vaga_id: string;
          freelancer_id: string;
          mensagem?: string | null;
          status?: "pendente" | "aceita" | "recusada";
          created_at?: string;
        };
        Update: {
          vaga_id?: string;
          freelancer_id?: string;
          mensagem?: string | null;
          status?: "pendente" | "aceita" | "recusada";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      check_cpf_available: {
        Args: { p_cpf: string };
        Returns: boolean;
      };
      check_cnpj_available: {
        Args: { p_cnpj: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "empresa" | "freelancer";
      tipo_valor_vaga: "dia" | "hora" | "projeto";
      status_candidatura: "pendente" | "aceita" | "recusada";
    };
    CompositeTypes: Record<string, never>;
  };
};