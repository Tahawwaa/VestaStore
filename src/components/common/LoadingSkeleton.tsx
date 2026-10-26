export function LoadingSkeleton() {
  return (
    <div className="container section" role="status" aria-label="در حال بارگذاری">
      <div className="skeleton h-10 w-48 mb-8" />
      <div className="product-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[3/4]" />
            <div className="skeleton h-5 w-2/3 mt-4" />
          </div>
        ))}
      </div>
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
