function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="h-2 w-10 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-2 h-4 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-1 h-3 w-20 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="h-2 w-10 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-1 h-3 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-4/6 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 flex justify-between border-t border-slate-100 pt-5">
        <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
      </div>
    </div>
  );
}

export default function VagasLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header skeleton */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>

      {/* Hero skeleton */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-11 w-48 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-11 w-36 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-11 w-32 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-32 animate-pulse rounded-2xl bg-slate-200" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
