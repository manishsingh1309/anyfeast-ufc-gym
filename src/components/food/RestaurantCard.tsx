import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Bike, BadgeCheck } from "lucide-react";
import type { Restaurant } from "../../data/mockData";
import { useRegion } from "../../context/RegionContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { formatPrice } = useRegion();
  return (
    <Link
      to={`/food/restaurant/${restaurant.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {restaurant.isFeatured && (
            <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              <BadgeCheck className="w-3 h-3" />
              Featured
            </span>
          )}
          {!restaurant.isOpen && (
            <span className="bg-gray-700/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Closed
            </span>
          )}
        </div>

        {/* Price category */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            {restaurant.priceCategory}
          </span>
        </div>

        {/* Delivery fee badge */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              restaurant.deliveryFee === null
                ? "bg-green-500 text-white"
                : "bg-white/90 text-gray-700"
            }`}
          >
            {restaurant.deliveryFee === null
              ? "🄓 Free delivery"
              : `🚴 ${formatPrice(restaurant.deliveryFee)}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-orange-600 transition-colors truncate">
          {restaurant.name}
        </h3>

        {/* Cuisine tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-800">{restaurant.rating}</span>
            <span className="text-gray-400 text-xs">({restaurant.reviewCount.toLocaleString()})</span>
          </div>

          {/* Delivery time */}
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{restaurant.deliveryTime}</span>
          </div>

          {/* Delivery fee */}
          <div className="flex items-center gap-1 text-gray-500">
            <Bike className="w-3.5 h-3.5" />
            <span
              className={`text-xs font-medium ${
                restaurant.deliveryFee === null ? "text-green-600" : ""
              }`}
            >
              {restaurant.deliveryFee === null ? "Free" : formatPrice(restaurant.deliveryFee)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
