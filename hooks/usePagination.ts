"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number; // 시작 페이지 번호 (기본값: 1)
  resetOnDataChange?: boolean; // 데이터(data) 변경 시, initialPage로 리셋할지 여부 (기본값: true)
  onPageChange?: (page: number) => void; // 페이지 변경 콜백 함수
}

export function usePagination<T>( //<T>: 어떤 형태의 배열
  data: T[],
  dataPerPage: number, // 페이지 당 데이터 수
  options: UsePaginationOptions = {}
) {
  const { initialPage = 1, resetOnDataChange = true, onPageChange: onChange } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 검색어나 카테고리 변경 등으로 data 배열이 새로 들어왔을 때 첫페이지로 되돌림
  useEffect(() => {
    if (resetOnDataChange) setCurrentPage(initialPage);
  }, [data, initialPage, resetOnDataChange]);

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / dataPerPage));

  // 현재 페이지에 해당하는 데이터들
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * dataPerPage;
    return data.slice(startIndex, startIndex + dataPerPage);
  }, [currentPage, data, dataPerPage]);

  // 페이지 변경 콜백 함수
  const onPageChange = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, Math.min(totalPages, page));
      if (nextPage === currentPage) return;
      setCurrentPage(nextPage);
      onChange?.(nextPage);
    },
    [currentPage, onChange, totalPages]
  );

  return {
    currentPage,
    currentItems,
    totalCount,
    totalPages,
    onPageChange,
    setCurrentPage,
  };
}
