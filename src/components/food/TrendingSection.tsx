import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { trendingDishes } from "../../data/mockData";
import { useRegion } from "../../context/RegionContext";

const TrendingSection: React.FC = () => {
  const { region, formatPrice } = useRegion();
  const dishes = trendingDishes.filter((d) => d.region === region);
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">🔥 Trending Dishes</h2>
          <p className="text-gray-500 text-sm mt-1">What everyone's ordering right now</p>
        </div>
        <button className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors group">
          See all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Horizontal scroll on mobile, grid on wider screens */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:-mx-0 sm:px-0">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="flex-shrink-0 w-44 sm:w-auto group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-orange-100 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            {/* Dish image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Rating pill */}
              <div className="absolute bottom-2 left-2">
                <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-800">{dish.rating}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h4 className="font-bold text-gray-900 text-sm leading-snug mb-0.5 truncate group-hover:text-orange-600 transition-colors">
                {dish.name}
              </h4>
              <p className="text-xs text-gray-500 truncate mb-2">{dish.restaurant}</p>
              <span className="text-sm font-extrabold text-orange-500">
                {formatPrice(dish.price)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
