import "./Pagination.css";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  function onPageIncrement() {
    if (currentPage >= totalPages) return;
    onPageChange(currentPage + 1);
  }

  function onPageDecrement() {
    if (currentPage <= 1) return;
    onPageChange(currentPage - 1);
  }

  return (
    <div className="pagination">
      <button onClick={onPageDecrement} disabled={currentPage <= 1}>
        ←
      </button>
      <div className="page-label">
        Page {currentPage} of {totalPages}
      </div>
      <button onClick={onPageIncrement} disabled={currentPage >= totalPages}>
        →
      </button>
    </div>
  );
}
