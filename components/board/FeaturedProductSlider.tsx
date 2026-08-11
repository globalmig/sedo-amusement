"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured-product-slider.css";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface FeaturedProductSliderProps {
  products: Product[];
}

interface ArrowProps {
  onClick?: () => void;
}

function PrevArrow({ onClick }: ArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="이전 제품"
      className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-md transition-opacity hover:opacity-90 pc:h-12 pc:w-12"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 pc:h-5 pc:w-5" aria-hidden="true">
        <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function NextArrow({ onClick }: ArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="다음 제품"
      className="absolute right-0 top-1/2 z-10 flex h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white shadow-md transition-opacity hover:opacity-90 pc:h-12 pc:w-12"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 pc:h-5 pc:w-5" aria-hidden="true">
        <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function FeaturedProductSlider({ products }: FeaturedProductSliderProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        세도어뮤즈먼트의 제품을 확인해보세요. <Link href="/products" className="underline">전체 제품 보기</Link>
      </div>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
    {
      breakpoint: 1024, // 1024px 이하 (태블릿)
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640, // 640px 이하 (모바일)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
  };

  return (
    <div className="featured-product-slider relative">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-2 pb-10">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
