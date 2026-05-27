"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const USE_SUPABASE = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

type AddressFromViaCep = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export default function CadastroEmpresaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);

  // CEP auto-fill state
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  async function handleCepChange(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      if (digits.length === 0) setCepError(null);
      return;
    }

    setCepLoading(true);
    setCepError(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: AddressFromViaCep = await res.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      setEndereco(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setEstado(data.uf || "");
    } catch {
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const form = event.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;
      const nome = (form.elements.namedItem("nome") as HTMLInputElement).value.trim();
      const cnpj = (form.elements.namedItem("cnpj") as HTMLInputElement).value.trim();
      const cep = (form.elements.namedItem("cep") as HTMLInputElement).value.trim();
      const enderecoVal = (form.elements.namedItem("endereco") as HTMLInputElement).value.trim();
      const bairroVal = (form.elements.namedItem("bairro") as HTMLInputElement).value.trim();
      const numero = (form.elements.namedItem("numero") as HTMLInputElement).value.trim();
      const whatsapp = (form.elements.namedItem("whatsapp") as HTMLInputElement).value.trim();

      if (!USE_SUPABASE) {
        router.push("/dashboard/empresa");
        return;
      }

      const supabase = createClient();

      // Verificar se CNPJ já está em uso
      const { data: cnpjDisponivel, error: cnpjCheckError } = await supabase.rpc("check_cnpj_available", {
        p_cnpj: cnpj,
      });
      if (cnpjCheckError) {
        console.error("Erro ao verificar CNPJ:", cnpjCheckError);
      } else if (cnpjDisponivel === false) {
        setError("CNPJ já cadastrado. Tente fazer login ou use outro CNPJ.");
        return;
      }

      // 1. Criar usuário com metadados completos
      // O trigger 'on_auth_user_created' cria automaticamente profile + empresa
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard/empresa`,
          data: {
            role: "empresa",
            nome,
            cnpj,
            cep: cep || null,
            endereco: enderecoVal || null,
            bairro: bairroVal || null,
            numero: numero || null,
            whatsapp: whatsapp || null,
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message;
        console.error("SignUp error:", signUpError);
        if (msg.includes("already registered") || msg.includes("already in use") || msg.includes("User already registered")) {
          setError("Este e-mail já está cadastrado. Tente fazer login.");
        } else if (msg.includes("Password should be at least") || msg.includes("password")) {
          setError("A senha deve ter pelo menos 6 caracteres.");
        } else {
          setError(msg);
        }
        return;
      }

      const user = authData.user;
      if (!user) {
        setError("Erro ao criar conta. Tente novamente.");
        return;
      }

      // 2. Se há sessão (confirmação desabilitada): garantir dados corretos via upsert
      if (authData.session) {
        const { error: empresaError } = await supabase.from("empresas").upsert(
          {
            id: user.id,
            nome,
            cnpj,
            cep: cep || null,
            endereco: enderecoVal || null,
            bairro: bairroVal || null,
            numero: numero || null,
            whatsapp: whatsapp || null,
            plano_ativo: false,
          },
          { onConflict: "id" },
        );

        if (empresaError) {
          console.error("Empresa upsert error:", empresaError);
          await supabase.auth.signOut();
          if (empresaError.message.includes("unique") || empresaError.message.includes("duplicate")) {
            setError("CNPJ já cadastrado. Tente fazer login ou use outro CNPJ.");
          } else {
            setError(`Erro ao salvar dados da empresa: ${empresaError.message}. Tente novamente.`);
          }
          return;
        }

        router.push("/dashboard/empresa");
        router.refresh();
      } else {
        // Email confirmation habilitado: trigger já criou profile + empresa com os metadados
        setWaitingConfirmation(true);
      }
    } catch (err) {
      console.error("Erro inesperado no cadastro:", err);
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  if (waitingConfirmation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <AuthCard
          eyebrow="Quase lá!"
          title="Confirme seu e-mail"
          description="Enviamos um e-mail de confirmação. Verifique sua caixa de entrada e clique no link para ativar sua conta."
          footer={
            <p className="text-sm text-slate-600">
              Já confirmou?{" "}
              <Link className="font-semibold text-brand-700" href="/login">
                Faça login
              </Link>
            </p>
          }
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Verifique sua caixa de entrada (e a pasta de spam).
          </div>
        </AuthCard>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AuthCard
        eyebrow="Cadastro para empresas"
        title="Crie sua conta empresarial"
        description="Publique vagas freelancer por cidade e encontre profissionais rapidamente."
        footer={
          <p className="text-sm text-slate-600">
            Já tem conta?{" "}
            <Link className="font-semibold text-brand-700" href="/login">
              Faça login
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Nome da empresa</span>
            <Input name="nome" type="text" placeholder="Ex.: Studio Criativo" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">CNPJ</span>
            <Input name="cnpj" type="text" placeholder="00.000.000/0001-00" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <Input name="email" type="email" placeholder="contato@empresa.com" required autoComplete="email" />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <Input
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
          </label>

          {/* CEP com busca automática */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">CEP</span>
              <div className="relative">
                <Input
                  name="cep"
                  type="text"
                  placeholder="00000-000"
                  maxLength={9}
                  onChange={(e) => handleCepChange(e.target.value)}
                />
                {cepLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    Buscando...
                  </span>
                )}
              </div>
              {cepError && <p className="text-xs text-red-600">{cepError}</p>}
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Número</span>
              <Input name="numero" type="text" placeholder="123" />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Endereço</span>
            <Input
              name="endereco"
              type="text"
              placeholder="Rua das Flores"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Bairro</span>
            <Input
              name="bairro"
              type="text"
              placeholder="Centro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cidade</span>
              <Input
                name="cidade_empresa"
                type="text"
                placeholder="São Paulo"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Estado (UF)</span>
              <Input
                name="estado_empresa"
                type="text"
                placeholder="SP"
                maxLength={2}
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">WhatsApp</span>
            <Input name="whatsapp" type="tel" placeholder="(11) 99999-9999" />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta de empresa"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
