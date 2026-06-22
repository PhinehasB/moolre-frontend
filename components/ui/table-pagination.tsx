"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalItems: number;
  /** Label for the item type, e.g. "employees", "transactions" */
  itemLabel?: string;
}

export function TablePagination<TData>({
  table,
  totalItems,
  itemLabel = "items",
}: TablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  if (totalItems === 0) return null;

  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (pageCount <= maxVisible + 2) {
      // Show all pages
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (pageIndex > 2) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(1, pageIndex - 1);
      const end = Math.min(pageCount - 2, pageIndex + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pageIndex < pageCount - 3) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(pageCount - 1);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 select-none">
      {/* Items range info */}
      <span className="text-sm text-gray-500 font-medium">
        Showing {startItem}-{endItem} of {totalItems} {itemLabel}
      </span>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex items-center justify-center size-9 text-gray-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => table.setPageIndex(page)}
              className={`flex items-center justify-center size-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                pageIndex === page
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {page + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
