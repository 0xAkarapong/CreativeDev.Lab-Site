import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function PaginationControls({
  currentPage,
  hasPrevious,
  hasNext,
}: PaginationControlsProps) {
  const getHref = (page: number) => (page === 1 ? "/blog" : `/blog?page=${page}`);

  return (
    <div className="flex items-center justify-between border-t pt-6 mt-6">
      {hasPrevious ? (
        <Button asChild variant="outline">
          <Link href={getHref(currentPage - 1)}>← Newer posts</Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          ← Newer posts
        </Button>
      )}
      <p className="text-sm text-muted-foreground">Page {currentPage}</p>
      {hasNext ? (
        <Button asChild variant="outline">
          <Link href={getHref(currentPage + 1)}>Older posts →</Link>
        </Button>
      ) : (
        <Button variant="outline" disabled>
          Older posts →
        </Button>
      )}
    </div>
  );
}
