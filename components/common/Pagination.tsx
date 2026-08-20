import { useState } from "react";

interface IPaginationProps {
  totalCount: number;
  itemsPerPage: number;
  pagesPerGroup?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalCount, // 총 데이터 수
  itemsPerPage, // 페이지 당 데이터 수
  pagesPerGroup = 5, // 페이지 그룹
  onPageChange, // 페이지 변경
}: IPaginationProps) {

  const pageCount = Math.ceil(totalCount / itemsPerPage); // 페이지 수
  const [currentPage, setCurrentPage] = useState(1);
  const [groupStart, setGroupStart] = useState(1);

  const pages = Array.from(
    { length: pagesPerGroup },
    (_, i) => i + groupStart
  ).filter((page) => page <= pageCount);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrev = () => {
    if (currentPage <= 1) return;
    const newPage = currentPage - 1;
    if (newPage < groupStart) setGroupStart(groupStart - pagesPerGroup);
    handlePageClick(newPage);
  };

  const handleNext = () => {
    if (currentPage >= pageCount) return;
    const newPage = currentPage + 1;
    if (newPage >= groupStart + pagesPerGroup) setGroupStart(groupStart + pagesPerGroup);
    handlePageClick(newPage);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 pc:gap-1">
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-base text-body hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer pc:w-8 pc:h-8 pc:text-sm"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-base font-medium transition-colors cursor-pointer pc:w-8 pc:h-8 pc:text-sm ${
            currentPage === page
              ? "bg-primary text-white"
              : "text-body hover:bg-surface"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage >= pageCount}
        className="w-10 h-10 flex items-center justify-center rounded-lg text-base text-body hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer pc:w-8 pc:h-8 pc:text-sm"
      >
        ›
      </button>
    </div>
  );
}
