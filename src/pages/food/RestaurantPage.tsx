import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  ShoppingCart,
  BadgeCheck,
  Info,
} from "lucide-react";
import Navbar from "../../components/food/Navbar";
import MenuSection from "../../components/food/MenuSection";
import CartPanel from "../../components/food/CartPanel";
import { restaurants, menuItems } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import { useRegion } from "../../context/RegionContext";

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useCart();
  const { formatPrice } = useRegion();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "info">("menu");

  const restaurant = restaurants.find((r) => r.id === id);
  const menu = useMemo(() => menuItems.filter((m) => m.restaurantId === id), [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <span className="text-7xl">🍽️</span>
          <h2 className="text-2xl font-bold text-gray-700">Restaurant not found</h2>
          <p className="text-gray-400">This restaurant doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/food")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-colors" />
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:bg-white transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          {totalItems > 0 && (
            <span className="text-sm font-bold text-gray-700">{formatPrice(totalPrice)}</span>
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-2">
              {restaurant.isFeatured && (
                <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> Featured
                </span>
              )}
              {!restaurant.isOpen && (
                <span className="bg-gray-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  ⛔ Closed Now
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold text-sm">{restaurant.rating}</span>
                <span className="text-white/70 text-xs">({restaurant.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Clock className="w-3.5 h-3.5" /> {restaurant.deliveryTime}
              </div>
              <div className="flex items-center gap-1 text-white/80 text-xs">
                <Bike className="w-3.5 h-3.5" />
                {restaurant.deliveryFee === null ? "Free delivery" : `${formatPrice(restaurant.deliveryFee)} delivery`}
              </div>
              <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                {restaurant.priceCategory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.tags.map((tag) => (
            <span key={tag} className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
          {restaurant.description}
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
          {(["menu", "info"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "menu" ? <ShoppingCart className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "menu" && <MenuSection items={menu} />}

        {activeTab === "info" && (
          <div className="max-w-lg space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-base">Restaurant Details</h3>
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Cuisine", value: restaurant.cuisine },
                  { label: "Price Range", value: restaurant.priceCategory },
                  { label: "Delivery Time", value: restaurant.deliveryTime },
                  { label: "Delivery Fee", value: restaurant.deliveryFee === null ? "Free" : formatPrice(restaurant.deliveryFee) },
                  { label: "Status", value: restaurant.isOpen ? "Open Now 🟢" : "Closed 🔴" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-semibold text-gray-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <p className="text-sm text-orange-700 leading-relaxed">{restaurant.description}</p>
            </div>
          </div>
        )}

        <div className="pb-24" />
      </div>

      {/* Floating Cart CTA */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-30">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setCartOpen(true)}
              className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-orange-200 active:scale-[0.98]"
            >
              <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs font-bold">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
              <span>View Cart</span>
              <span>{formatPrice(totalPrice)}</span>
            </button>
          </div>
        </div>
      )}

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantPage;
