import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
};

function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): number[] {
  if (totalPages <= 0) return [];

  const visibleCount = Math.min(maxVisible, totalPages);
  let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
  let end = start + visibleCount - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleCount + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const pages = getVisiblePages(page, totalPages, maxVisible);
  // disabled:cursor-not-allowed cursor-pointer disabled:opacity-40
  const buttonClass =
    "flex items-center gap-1 rounded-md text-white px-3 py-1 disabled:cursor-not-allowed cursor-pointer disabled:opacity-40";

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className={`${buttonClass} bg-gray-900`}
      >
        <ChevronLeft size={20} />
        Prev
      </button>
      <div className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${buttonClass} ${page === pageNumber ? "bg-gray-900 cursor-not-allowed!" : "bg-gray-200 text-black!"}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className={`${buttonClass} bg-gray-900`}
      >
        Next
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
