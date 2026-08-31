"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured-product-slider.css";
import { Product } from "@/types/product";
import FeaturedProductCard from "./FeaturedProductCard";
import Link from "next/link";

interface FeaturedProductSliderProps {
  products: Product[];
}

function getSlideGapWidth() {
  if (typeof window === "undefined") return 380;
  if (window.innerWidth >= 1024) return 380;
  if (window.innerWidth >= 640) return 280;
  return 200;
}

export default function FeaturedProductSlider({ products }: FeaturedProductSliderProps) {
  const [slideGapWidth, setSlideGapWidth] = useState<number | null>(null);

  useEffect(() => {
    setSlideGapWidth(getSlideGapWidth());
    const onResize = () => setSlideGapWidth(getSlideGapWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-base text-muted pc:text-[20px]">
        세도어뮤즈먼트의 제품을 확인해보세요. <Link href="/products" className="underline">전체 제품 보기</Link>
      </div>
    );
  }

  if (slideGapWidth === null) {
    return <div className="h-103" aria-hidden="true" />;
  }

  const settings = {
    dots: false,
    arrows: false,
    infinite: products.length > 1,
    variableWidth: true,
    speed: 600,
    slidesToScroll: 1,
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="featured-product-slider relative">
      <Slider key={slideGapWidth} {...settings}>
        {products.map((product) => (
          <div key={product.id} style={{ width: slideGapWidth }}>
            <div className="w-45 sm:w-65 pc:w-90">
              <FeaturedProductCard product={product} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
