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

// 메인페이지 전용: 관리자가 지정한 주요 상품을 ProductCard 단위로 자동 슬라이드
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
    arrows: false,
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
    <div className="featured-product-slider">
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
