import React from "react";
import { Plus, Leaf, Flame } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useRegion } from "../../context/RegionContext";
import type { MenuItem } from "../../data/mockData";

interface DishCardProps {
  item: MenuItem;
}

const DishCard: React.FC<DishCardProps> = ({ item }) => {
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const { formatPrice } = useRegion();
  const inCart = isInCart(item.id);
  const qty = getQuantity(item.id);

  return (
    <div className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-orange-100 transition-all duration-300">
      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {item.isBestSeller && (
          <div className="absolute top-1.5 left-1.5">
            <span className="flex items-center gap-0.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              <Flame className="w-2.5 h-2.5" /> Best
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start gap-2">
            {/* Veg / Non-veg indicator */}
            <div
              className={`mt-0.5 flex-shrink-0 w-4 h-4 border-2 rounded flex items-center justify-center ${
                item.isVeg
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
            <h4 className="font-bold text-gray-900 text-sm leading-snug truncate">
              {item.name}
            </h4>
            {item.isVeg && <Leaf className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />}
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-extrabold text-gray-900">
            {formatPrice(item.price)}
          </span>

          {!inCart ? (
            <button
              onClick={() => addItem(item)}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 shadow-sm shadow-orange-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
              <button
                onClick={() => updateQuantity(item.id, qty - 1)}
                className="w-6 h-6 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-100 rounded-lg text-lg leading-none transition-colors"
              >
                −
              </button>
              <span className="text-sm font-bold text-orange-700 min-w-[16px] text-center">
                {qty}
              </span>
              <button
                onClick={() => addItem(item)}
                className="w-6 h-6 flex items-center justify-center text-orange-600 font-bold hover:bg-orange-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
