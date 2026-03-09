import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "../../data/mockData";

interface CategorySliderProps {
  activeCategory?: string;
  onSelect?: (id: string) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  activeCategory,
  onSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 240;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors -ml-4"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <button
          onClick={() => onSelect?.("all")}
          className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-200 min-w-[80px] ${
            activeCategory === "all" || !activeCategory
              ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
              : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
          }`}
        >
          <span className="text-2xl">🍽️</span>
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">All</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all duration-200 hover:scale-105 min-w-[80px] ${
                isActive
                  ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  isActive ? "text-orange-600" : "text-gray-700"
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-lg border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors -mr-4"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategorySlider;
