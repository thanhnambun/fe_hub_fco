export default function Loading() {
  return (
    <main className="min-h-screen bg-fco-navy px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass h-40 animate-pulse rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="glass h-72 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
