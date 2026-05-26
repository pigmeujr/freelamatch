type DashboardStatCardProps = {
  label: string;
  value: string | number;
  helper: string;
};

export function DashboardStatCard({ label, value, helper }: DashboardStatCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 text-sm text-slate-600">{helper}</p>
    </div>
  );
}