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

  return (
    <nav>
      <ul className="m-0 mt-4 flex list-none gap-4 p-0 text-lg font-semibold">
        <li
          className="cursor-pointer rounded bg-black/10 px-2"
          onClick={() => onPageChange(1)}
        >{`<<`}</li>
        {pages.map((page) => (
          <li
            className={`${
              page === currentPage ? "bg-black text-white" : ""
            } cursor-pointer rounded bg-black/10 px-2 transition-all`}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </li>
        ))}
        <li
          className="cursor-pointer rounded bg-black/10 px-2"
          onClick={() => onPageChange(lastPage)}
        >{`>>`}</li>
      </ul>
    </nav>
  );
}
