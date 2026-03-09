import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, MapPin, Bell, ChevronDown, X, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useRegion, LOCATIONS } from "../../context/RegionContext";

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { region, city, flag, setLocation } = useRegion();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — uses /public/anyfeast-logo.svg */}
          <Link to="/food" className="flex-shrink-0">
            <img
              src="/anyfeast-logo.svg"
              alt="AnyFeast"
              className="h-9 w-auto object-contain"
              draggable={false}
            />
          </Link>

          {/* Location picker */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              onClick={() => setLocationOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50"
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{flag} {city}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${locationOpen ? "rotate-180" : ""}`} />
            </button>

            {locationOpen && (
              <>
                {/* Backdrop to close */}
                <div className="fixed inset-0 z-40" onClick={() => setLocationOpen(false)} />
                <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Select your location</p>
                </div>
                {LOCATIONS.map((loc) => (
                  <div key={loc.region}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50">
                      <span className="text-base">{loc.flag}</span>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{loc.country}</span>
                      {region === loc.region && <Check className="w-3.5 h-3.5 text-orange-500 ml-auto" />}
                    </div>
                    <div className="px-2 py-1">
                      {loc.cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setLocation(loc.region, c); setLocationOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            city === c && region === loc.region
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </div>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="md:hidden p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="hidden sm:flex p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/food/cart")}
              className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md shadow-orange-200 hover:shadow-orange-300 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search expanded */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
