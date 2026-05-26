import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export default function CadastroFreelancerPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AuthCard
        eyebrow="Cadastro para freelancers"
        title="Crie sua conta gratuita"
        description="Busque vagas por cidade, monte seu perfil e candidate-se rapidamente."
      >
        <AuthForm
          submitLabel="Criar conta de freelancer"
          fields={[
            { name: "nome_completo", label: "Nome completo", placeholder: "Seu nome" },
            { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
            { name: "email", label: "E-mail", type: "email", placeholder: "voce@exemplo.com" },
            { name: "password", label: "Senha", type: "password", placeholder: "Crie uma senha" },
            { name: "cidade", label: "Cidade", placeholder: "Belo Horizonte" },
            { name: "estado", label: "Estado", placeholder: "MG" },
          ]}
        />
      </AuthCard>
    </main>
  );
}