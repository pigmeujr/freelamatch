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

export default function CadastroEmpresaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waitingConfirmation, setWaitingConfirmation] = useState(false);

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
      const endereco = (form.elements.namedItem("endereco") as HTMLInputElement).value.trim();
      const bairro = (form.elements.namedItem("bairro") as HTMLInputElement).value.trim();
      const numero = (form.elements.namedItem("numero") as HTMLInputElement).value.trim();
      const whatsapp = (form.elements.namedItem("whatsapp") as HTMLInputElement).value.trim();

      if (!USE_SUPABASE) {
        router.push("/dashboard/empresa");
        return;
      }

      const supabase = createClient();

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard/empresa`,
        },
      });

      if (signUpError) {
        const msg = signUpError.message;
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

      // 2. Inserir profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email,
        role: "empresa" as const,
      });

      if (profileError && !profileError.message.includes("duplicate")) {
        console.error("Profile insert error:", profileError);
      }

      // 3. Inserir empresa
      const { error: empresaError } = await supabase.from("empresas").insert({
        id: user.id,
        nome,
        cnpj,
        cep: cep || null,
        endereco: endereco || null,
        bairro: bairro || null,
        numero: numero || null,
        whatsapp: whatsapp || null,
        plano_ativo: false,
      });

      if (empresaError) {
        console.error("Empresa insert error:", empresaError);
        if (empresaError.message.includes("unique") || empresaError.message.includes("duplicate")) {
          setError("CNPJ já cadastrado. Tente fazer login ou use outro CNPJ.");
        } else {
          setError("Conta criada, mas houve erro ao salvar dados. Faça login e complete seu perfil.");
        }
        return;
      }

      // Se retornou sessão (email confirmation desabilitado): redireciona direto
      if (authData.session) {
        router.push("/dashboard/empresa");
        router.refresh();
      } else {
        setWaitingConfirmation(true);
      }
    } catch {
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

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">CEP</span>
              <Input name="cep" type="text" placeholder="00000-000" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Número</span>
              <Input name="numero" type="text" placeholder="123" />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Endereço</span>
            <Input name="endereco" type="text" placeholder="Rua das Flores" />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Bairro</span>
            <Input name="bairro" type="text" placeholder="Centro" />
          </label>

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
