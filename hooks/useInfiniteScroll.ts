"use client";
import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>(data: T[], itemsPerPage: number) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 검색어나 카테고리 변경 등으로 data 배열이 새로 들어왔을 때 처음 개수로 되돌림
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [data, itemsPerPage]);

  // 하단 감지 영역이 화면에 들어오면 다음 묶음을 노출
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + itemsPerPage, data.length));
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [data.length, itemsPerPage]);

  const visibleItems = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return { visibleItems, hasMore, observerTarget };
}
