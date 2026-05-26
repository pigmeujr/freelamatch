import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export default function CadastroEmpresaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AuthCard
        eyebrow="Cadastro para empresas"
        title="Crie sua conta empresarial"
        description="Publique vagas freelancer por cidade e encontre profissionais rapidamente."
      >
        <AuthForm
          submitLabel="Criar conta de empresa"
          fields={[
            { name: "nome", label: "Nome da empresa", placeholder: "Ex.: Studio Criativo" },
            { name: "cnpj", label: "CNPJ", placeholder: "00.000.000/0001-00" },
            { name: "email", label: "E-mail", type: "email", placeholder: "contato@empresa.com" },
            { name: "password", label: "Senha", type: "password", placeholder: "Crie uma senha" },
            { name: "cidade", label: "Cidade", placeholder: "São Paulo" },
            { name: "estado", label: "Estado", placeholder: "SP" },
          ]}
        />
      </AuthCard>
    </main>
  );
}