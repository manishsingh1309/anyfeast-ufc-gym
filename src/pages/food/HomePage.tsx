import React, { useState } from "react";
import Navbar from "../../components/food/Navbar";
import HeroSection from "../../components/food/HeroSection";
import CategorySlider from "../../components/food/CategorySlider";
import RestaurantGrid from "../../components/food/RestaurantGrid";
import TrendingSection from "../../components/food/TrendingSection";
import CartPanel from "../../components/food/CartPanel";
import { restaurants, categories } from "../../data/mockData";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useRegion } from "../../context/RegionContext";

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { region } = useRegion();

  const regionRestaurants = restaurants.filter((r) => r.region === region);

  const filteredRestaurants = regionRestaurants.filter((r) => {
    const matchesCategory =
      activeCategory === "all" ||
      r.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase()) ||
      r.cuisine.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredRestaurants = filteredRestaurants.filter((r) => r.isFeatured);
  const allOpen = filteredRestaurants.filter((r) => r.isOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        onSearch={(q) => {
          setSearchQuery(q);
          setActiveCategory("all");
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <section className="py-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5">
            What are you craving?
          </h2>
          <CategorySlider
            activeCategory={activeCategory}
            onSelect={(id) => {
              setActiveCategory(id);
              setSearchQuery("");
            }}
          />
        </section>

        {/* Featured restaurants */}
        {featuredRestaurants.length > 0 && !searchQuery && activeCategory === "all" && (
          <section className="pb-10">
            <RestaurantGrid
              restaurants={featuredRestaurants}
              title="⭐ Featured Restaurants"
              subtitle="Handpicked for you based on quality and popularity"
            />
          </section>
        )}

        {/* Trending Dishes */}
        {!searchQuery && activeCategory === "all" && (
          <section className="pb-10">
            <TrendingSection />
          </section>
        )}

        {/* All restaurants */}
        <section className="pb-16">
          {searchQuery ? (
            <RestaurantGrid
              restaurants={filteredRestaurants}
              title={`Search results for "${searchQuery}"`}
              subtitle={`${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? "s" : ""} found`}
            />
          ) : (
            <RestaurantGrid
              restaurants={activeCategory === "all" ? allOpen : filteredRestaurants}
              title={
                activeCategory === "all"
                  ? "🏪 All Restaurants"
                  : `${categories.find((c) => c.id === activeCategory)?.emoji ?? ""} ${
                      categories.find((c) => c.id === activeCategory)?.label ?? "Results"
                    } Restaurants`
              }
              subtitle={
                activeCategory === "all"
                  ? `${allOpen.length} restaurants open now`
                  : `${filteredRestaurants.length} result${filteredRestaurants.length !== 1 ? "s" : ""}`
              }
            />
          )}
        </section>
      </main>

      {/* Floating cart button (mobile) */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-30 flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3.5 rounded-2xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="font-bold text-sm">View Cart</span>
        </button>
      )}

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">🍽</span>
            </div>
            <span className="text-white font-extrabold text-lg">
              Any<span className="text-orange-500">feast</span>
            </span>
          </div>
          <p className="text-sm">© 2026 AnyFeast™. World flavours delivered, kitchen convenience guaranteed.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
