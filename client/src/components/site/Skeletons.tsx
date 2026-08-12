import { cn } from "@/lib/utils";

function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-muted", className)} />;
}

export function PackageCardSkeleton() {
  return (
    <div className="flex h-full flex-col border border-border bg-card">
      <Shimmer className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-4 p-8">
        <Shimmer className="h-2 w-20" />
        <Shimmer className="h-6 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="mt-4 space-y-2 border-t border-border pt-6">
          <Shimmer className="h-3 w-full" />
          <Shimmer className="h-3 w-5/6" />
          <Shimmer className="h-3 w-2/3" />
        </div>
        <Shimmer className="mt-auto h-11 w-full" />
      </div>
    </div>
  );
}

export function PackageGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-12 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GalleryGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer
          key={i}
          className={cn("mb-4 w-full", i % 3 === 0 ? "h-72" : i % 3 === 1 ? "h-56" : "h-96")}
        />
      ))}
    </div>
  );
}
