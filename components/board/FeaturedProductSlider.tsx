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

function getCardWidth() {
  if (typeof window === "undefined") return 360;
  if (window.innerWidth >= 1024) return 360; 
  if (window.innerWidth >= 640) return 260;
  return 180;
}

export default function FeaturedProductSlider({ products }: FeaturedProductSliderProps) {
  const [cardWidth, setCardWidth] = useState<number | null>(null);

  useEffect(() => {
    setCardWidth(getCardWidth());
    const onResize = () => setCardWidth(getCardWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted">
        세도어뮤즈먼트의 제품을 확인해보세요. <Link href="/products" className="underline">전체 제품 보기</Link>
      </div>
    );
  }

  if (cardWidth === null) {
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
      <Slider key={cardWidth} {...settings}>
        {products.map((product) => (
          <div key={product.id} style={{ width: cardWidth + 20 }}>
            <div style={{ width: cardWidth }}>
              <FeaturedProductCard product={product} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
