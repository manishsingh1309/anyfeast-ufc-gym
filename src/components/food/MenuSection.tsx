import React from "react";
import DishCard from "./DishCard";
import type { MenuItem } from "../../data/mockData";

interface MenuSectionProps {
  items: MenuItem[];
}

/** Groups items by category and renders them with DishCard */
const MenuSection: React.FC<MenuSectionProps> = ({ items }) => {
  // group by category
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  if (categories.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">No menu items available.</p>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((cat) => (
        <section key={cat}>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-extrabold text-gray-900">{cat}</h3>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">
              {grouped[cat].length} item{grouped[cat].length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grouped[cat].map((item) => (
              <DishCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuSection;
