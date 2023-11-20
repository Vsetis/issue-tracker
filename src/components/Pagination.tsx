import { IconChevronsRight, IconChevronsLeft } from "@tabler/icons-react";

export default function Pagination({
  lastPage,
  currentPage,
  totalPages,
  onPageChange,
}: {
  lastPage: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalPages === 1) return null;

  return (
    <nav>
      <ul className="m-0 mt-4 flex list-none flex-wrap gap-4 p-0 text-lg font-semibold">
        <li
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border"
          onClick={() => onPageChange(1)}
        >
          <IconChevronsLeft className="w-4" />
        </li>
        {pages.map((page) => (
          <li
            className={`${
              page === currentPage ? "bg-[#5B5BD6] text-white" : ""
            } flex h-8 w-8 cursor-pointer items-center justify-center rounded border text-sm transition-all`}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        ))}
        <li
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border"
          onClick={() => onPageChange(lastPage)}
        >
          <IconChevronsRight className="w-4" />
        </li>
      </ul>
    </nav>
  );
}
