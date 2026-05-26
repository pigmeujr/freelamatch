type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ eyebrow, title, description, children, footer }: AuthCardProps) {
  return (
    <section className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
      <span className="inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
        {eyebrow}
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-4 text-slate-600">{description}</p>
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </section>
  );
}