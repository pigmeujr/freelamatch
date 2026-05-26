"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Role = "empresa" | "freelancer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsCompany, loginAsFreelancer } = useDashboardStore();
  const [role, setRole] = useState<Role>("empresa");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (role === "empresa") {
      loginAsCompany();
      router.push(searchParams.get("next") ?? "/dashboard/empresa");
    } else {
      loginAsFreelancer();
      router.push(searchParams.get("next") ?? "/dashboard/freelancer");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AuthCard
        eyebrow="Acesse sua conta"
        title="Entrar no FreelaMatch"
        description="Login mock local. Escolha seu perfil e clique em entrar para acessar o painel correspondente."
        footer={
          <p className="text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link className="font-semibold text-brand-700" href="/cadastro/freelancer">
              Cadastre-se como freelancer
            </Link>
          </p>
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              className={cn(
                "flex-1 rounded-xl py-2.5 text-sm font-semibold transition",
                role === "empresa"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
              onClick={() => setRole("empresa")}
              type="button"
            >
              Empresa
            </button>
            <button
              className={cn(
                "flex-1 rounded-xl py-2.5 text-sm font-semibold transition",
                role === "freelancer"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
              onClick={() => setRole("freelancer")}
              type="button"
            >
              Freelancer
            </button>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <Input
              key={role}
              defaultValue={role === "empresa" ? "empresa@freelamatch.com" : "freelancer@freelamatch.com"}
              name="email"
              type="email"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <Input defaultValue="123456" name="password" type="password" />
          </label>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            {role === "empresa"
              ? "Login mock para a empresa demo (Studio Aurora). Basta clicar em entrar."
              : "Login mock para o freelancer demo (Mariana Costa). Basta clicar em entrar."}
          </div>

          <Button className="w-full" type="submit">
            Entrar como {role === "empresa" ? "empresa" : "freelancer"}
          </Button>
        </form>
      </AuthCard>
    </main>
  );
}
