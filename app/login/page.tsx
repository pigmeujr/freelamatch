"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Role = "empresa" | "freelancer";

const USE_SUPABASE = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsCompany, loginAsFreelancer } = useDashboardStore();
  const [role, setRole] = useState<Role>("empresa");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "confirmacao-email") {
      setError("Falha na confirmação do e-mail. O link pode ter expirado. Tente fazer login ou cadastre-se novamente.");
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!USE_SUPABASE) {
        // Mock mode — mantém comportamento original
        if (role === "empresa") {
          loginAsCompany();
          router.push(searchParams.get("next") ?? "/dashboard/empresa");
        } else {
          loginAsFreelancer();
          router.push(searchParams.get("next") ?? "/dashboard/freelancer");
        }
        return;
      }

      const form = event.currentTarget;
      const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
      const password = (form.elements.namedItem("password") as HTMLInputElement).value;

      const supabase = createClient();
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        console.error("Login error:", signInError);
        const msg = signInError.message.toLowerCase();
        const code = (signInError as { code?: string }).code ?? "";

        if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
          setError("Verifique seu e-mail antes de fazer login. Clique no link de confirmação que enviamos.");
        } else if (code === "invalid_credentials" || msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
          setError("E-mail ou senha incorretos. Verifique os dados e tente novamente.");
        } else if (msg.includes("user not found") || msg.includes("no user found")) {
          setError("Usuário não encontrado. Verifique o e-mail ou crie uma conta.");
        } else if (msg.includes("too many requests") || msg.includes("rate limit")) {
          setError("Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.");
        } else {
          setError(signInError.message || "Erro ao fazer login. Tente novamente.");
        }
        return;
      }

      const user = signInData.user;

      if (!user) {
        setError("Erro ao obter dados do usuário. Tente novamente.");
        return;
      }

      // Busca o perfil para saber o role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role ?? "freelancer";
      const next = searchParams.get("next");
      const destination = next ?? (userRole === "empresa" ? "/dashboard/empresa" : "/dashboard/freelancer");

      console.log("Login sucesso, redirecionando para:", destination);
      // Hard redirect garante que o middleware leia os cookies de sessão corretamente
      window.location.href = destination;
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AuthCard
        eyebrow="Acesse sua conta"
        title="Entrar no FreelaMatch"
        description={
          USE_SUPABASE
            ? "Entre com seu e-mail e senha para acessar o painel."
            : "Login de demonstração. Escolha seu perfil e clique em entrar para acessar o painel."
        }
        footer={
          <p className="text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link className="font-semibold text-brand-700" href="/cadastro/freelancer">
              Freelancer
            </Link>{" "}
            ou{" "}
            <Link className="font-semibold text-brand-700" href="/cadastro/empresa">
              Empresa
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!USE_SUPABASE && (
            <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold transition",
                  role === "empresa" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
                onClick={() => setRole("empresa")}
                type="button"
              >
                Empresa
              </button>
              <button
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold transition",
                  role === "freelancer" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-700",
                )}
                onClick={() => setRole("freelancer")}
                type="button"
              >
                Freelancer
              </button>
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <Input
              key={!USE_SUPABASE ? role : "supabase"}
              defaultValue={
                !USE_SUPABASE
                  ? role === "empresa"
                    ? "empresa@freelamatch.com"
                    : "freelancer@freelamatch.com"
                  : ""
              }
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <Input
              defaultValue={!USE_SUPABASE ? "123456" : ""}
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>

          {!USE_SUPABASE && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
              {role === "empresa"
                ? "Login demo para a empresa Studio Aurora. Basta clicar em entrar."
                : "Login demo para o freelancer Mariana Costa. Basta clicar em entrar."}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
