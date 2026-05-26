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

export default function CadastroFreelancerPage() {
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
      const nome_completo = (form.elements.namedItem("nome_completo") as HTMLInputElement).value.trim();
      const cpf = (form.elements.namedItem("cpf") as HTMLInputElement).value.trim();
      const cidade = (form.elements.namedItem("cidade") as HTMLInputElement).value.trim();
      const estado = (form.elements.namedItem("estado") as HTMLInputElement).value.trim().toUpperCase();
      const telefone = (form.elements.namedItem("telefone") as HTMLInputElement).value.trim();

      if (!USE_SUPABASE) {
        router.push("/dashboard/freelancer");
        return;
      }

      const supabase = createClient();

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/freelancer`,
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
        role: "freelancer" as const,
      });

      if (profileError && !profileError.message.includes("duplicate")) {
        console.error("Profile insert error:", profileError);
      }

      // 3. Inserir freelancer
      const { error: freelancerError } = await supabase.from("freelancers").insert({
        id: user.id,
        nome_completo,
        cpf,
        cidade,
        estado,
        telefone: telefone || null,
      });

      if (freelancerError) {
        console.error("Freelancer insert error:", freelancerError);
        if (freelancerError.message.includes("unique") || freelancerError.message.includes("duplicate")) {
          setError("CPF já cadastrado. Tente fazer login ou use outro CPF.");
        } else {
          setError("Conta criada, mas houve erro ao salvar dados. Faça login e complete seu perfil.");
        }
        return;
      }

      // Se retornou sessão (email confirmation desabilitado): redireciona direto
      if (authData.session) {
        router.push("/dashboard/freelancer");
        router.refresh();
      } else {
        // Email confirmation habilitado: mostra aviso
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
          description="Enviamos um link de confirmação para o seu e-mail. Clique no link para ativar sua conta."
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
        eyebrow="Cadastro para freelancers"
        title="Crie sua conta gratuita"
        description="Busque vagas por cidade, monte seu perfil e candidate-se rapidamente."
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
            <span className="text-sm font-medium text-slate-700">Nome completo</span>
            <Input name="nome_completo" type="text" placeholder="Seu nome completo" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">CPF</span>
            <Input name="cpf" type="text" placeholder="000.000.000-00" required />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <Input name="email" type="email" placeholder="voce@exemplo.com" required autoComplete="email" />
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
              <span className="text-sm font-medium text-slate-700">Cidade</span>
              <Input name="cidade" type="text" placeholder="Belo Horizonte" required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Estado (UF)</span>
              <Input name="estado" type="text" placeholder="MG" maxLength={2} required />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Telefone / WhatsApp</span>
            <Input name="telefone" type="tel" placeholder="(11) 99999-9999" />
          </label>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta de freelancer"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
