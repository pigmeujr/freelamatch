-- Trigger que cria automaticamente o perfil (e registro freelancer/empresa)
-- quando um novo usuário é cadastrado no Supabase Auth.
-- Usa SECURITY DEFINER para contornar RLS sem precisar de sessão autenticada.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_role  public.user_role;
  v_meta  jsonb;
BEGIN
  v_meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  BEGIN
    v_role := (v_meta->>'role')::public.user_role;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'freelancer';
  END;

  -- Cria o profile; ignora se já existir (re-trigger ou duplicado)
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, v_role)
  ON CONFLICT (id) DO NOTHING;

  -- Cria o registro específico da role a partir dos metadados
  BEGIN
    IF v_role = 'freelancer' THEN
      INSERT INTO public.freelancers (id, nome_completo, cpf, cidade, estado, telefone)
      VALUES (
        NEW.id,
        COALESCE(NULLIF(v_meta->>'nome_completo', ''), 'Usuário'),
        COALESCE(NULLIF(v_meta->>'cpf', ''), 'PENDENTE-' || NEW.id::text),
        COALESCE(NULLIF(v_meta->>'cidade', ''), ''),
        COALESCE(NULLIF(v_meta->>'estado', ''), ''),
        NULLIF(v_meta->>'telefone', '')
      )
      ON CONFLICT (id) DO NOTHING;
    ELSIF v_role = 'empresa' THEN
      INSERT INTO public.empresas (id, nome, cnpj, cep, endereco, bairro, numero, whatsapp, plano_ativo)
      VALUES (
        NEW.id,
        COALESCE(NULLIF(v_meta->>'nome', ''), 'Empresa'),
        COALESCE(NULLIF(v_meta->>'cnpj', ''), 'PENDENTE-' || NEW.id::text),
        NULLIF(v_meta->>'cep', ''),
        NULLIF(v_meta->>'endereco', ''),
        NULLIF(v_meta->>'bairro', ''),
        NULLIF(v_meta->>'numero', ''),
        NULLIF(v_meta->>'whatsapp', ''),
        false
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Não falha o cadastro por erro em tabelas secundárias (ex: CPF duplicado)
    RAISE WARNING 'handle_new_user: erro ao criar registro de role para %, erro: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Remove trigger anterior se existir e recria
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Funções SECURITY DEFINER para verificar unicidade de CPF/CNPJ sem sessão
CREATE OR REPLACE FUNCTION public.check_cpf_available(p_cpf text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.freelancers WHERE cpf = p_cpf AND cpf NOT LIKE 'PENDENTE-%');
$$;

CREATE OR REPLACE FUNCTION public.check_cnpj_available(p_cnpj text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.empresas WHERE cnpj = p_cnpj AND cnpj NOT LIKE 'PENDENTE-%');
$$;

GRANT EXECUTE ON FUNCTION public.check_cpf_available  TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_cnpj_available TO anon, authenticated;
