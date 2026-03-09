import React from "react";
import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "../../data/mockData";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  title?: string;
  subtitle?: string;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  title,
  subtitle,
}) => {
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🍽️</span>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No restaurants found</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Try adjusting your search or explore a different category.
        </p>
      </div>
    );
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantGrid;
