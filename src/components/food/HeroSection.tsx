import React, { useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-rose-500 min-h-[520px] flex items-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&auto=format&fit=crop&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-orange-800/70 to-rose-900/80" />

      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-yellow-300 text-sm">🌍</span>
            <span className="text-white/90 text-sm font-medium">
              Available in UK &amp; India
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
            World Flavours
            <br />
            <span className="text-yellow-300">Delivered to Your Door</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
            Kitchen convenience guaranteed. Explore Indian, British, Italian, Korean,
            Japanese and more — from the best restaurants near you.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-black/20 max-w-xl"
          >
            <Search className="ml-2 w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Pizza, sushi, burgers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 outline-none bg-transparent min-w-0"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-white/60 text-sm">Popular:</span>
            {["� Biryani", "🫖 British", "🍕 Italian", "🍜 Korean", "🍱 Sushi", "🥗 Healthy"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  const q = tag.replace(/^.\s/, "");
                  setQuery(q);
                  onSearch?.(q);
                }}
                className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded-full transition-colors backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-12">
          {[
            { value: "2 Markets", label: "India & UK" },
            { value: "30 min", label: "Avg. Delivery" },
            { value: "4.8★", label: "Average Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-white/60 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
