// ─── Types ────────────────────────────────────────────────────────────────────

export type Region = "IN" | "UK";

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number | null; // null = free
  priceCategory: string; // "$" | "$$" | "$$$"
  cuisine: string;
  tags: string[];
  description: string;
  isOpen: boolean;
  isFeatured?: boolean;
  region: Region;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isBestSeller?: boolean;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export interface TrendingDish {
  id: string;
  name: string;
  image: string;
  restaurant: string;
  price: number;
  rating: number;
  region: Region;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: "pizza",    label: "Pizza",    emoji: "🍕", color: "bg-orange-100 text-orange-600" },
  { id: "burgers",  label: "Burgers",  emoji: "🍔", color: "bg-yellow-100 text-yellow-700" },
  { id: "healthy",  label: "Healthy",  emoji: "🥗", color: "bg-green-100  text-green-700"  },
  { id: "asian",    label: "Asian",    emoji: "🍜", color: "bg-red-100    text-red-600"    },
  { id: "indian",   label: "Indian",   emoji: "🍛", color: "bg-amber-100  text-amber-700"  },
  { id: "desserts", label: "Desserts", emoji: "🍰", color: "bg-pink-100   text-pink-600"   },
  { id: "drinks",   label: "Drinks",   emoji: "🧃", color: "bg-blue-100   text-blue-600"   },
  { id: "sushi",    label: "Sushi",    emoji: "🍱", color: "bg-teal-100   text-teal-600"   },
  { id: "tacos",    label: "Tacos",    emoji: "🌮", color: "bg-lime-100   text-lime-700"   },
  { id: "pasta",    label: "Pasta",    emoji: "🍝", color: "bg-purple-100 text-purple-600" },
];

// ─── Restaurants ──────────────────────────────────────────────────────────────

export const restaurants: Restaurant[] = [
  {
    id: "r1",
    name: "The Rustic Kitchen",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 1240,
    deliveryTime: "25–35 min",
    deliveryFee: 1.99,
    priceCategory: "$$",
    cuisine: "Italian",
    tags: ["Italian", "Pasta", "Pizza"],
    description:
      "Authentic Italian cuisine crafted from family recipes passed down for generations. Fresh pasta, wood-fired pizzas, and rich sauces that transport you straight to Rome.",
    isOpen: true,
    isFeatured: true,
    region: "IN",
  },
  {
    id: "r2",
    name: "Sakura Garden",
    image:
      "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 980,
    deliveryTime: "30–45 min",
    deliveryFee: 2.49,
    priceCategory: "$$$",
    cuisine: "Japanese",
    tags: ["Japanese", "Sushi", "Ramen"],
    description:
      "Tokyo-inspired sushi bar and ramen house. Premium fish flown in daily, slow-cooked broths, and an experience that celebrates Japanese culinary artistry.",
    isOpen: true,
    isFeatured: true,
    region: "UK",
  },
  {
    id: "r3",
    name: "Spice Route",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 2100,
    deliveryTime: "20–30 min",
    deliveryFee: null,
    priceCategory: "$$",
    cuisine: "Indian",
    tags: ["Indian", "Curry", "Biryani"],
    description:
      "A celebration of India's diverse culinary landscape — from buttery Punjabi classics to fragrant South Indian curries, every dish is a symphony of spices.",
    isOpen: true,
    isFeatured: true,
    region: "IN",
  },
  {
    id: "r4",
    name: "Burger Republic",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 3400,
    deliveryTime: "15–25 min",
    deliveryFee: 0.99,
    priceCategory: "$",
    cuisine: "American",
    tags: ["Burgers", "American", "Fries"],
    description:
      "Smash burgers, gourmet toppings, and hand-cut fries that redefine what a burger joint can be. Juicy, crispy, and absolutely craveable — every single time.",
    isOpen: true,
    isFeatured: true,
    region: "IN",
  },
  {
    id: "r5",
    name: "Green Bowl",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    rating: 4.4,
    reviewCount: 760,
    deliveryTime: "20–35 min",
    deliveryFee: 1.49,
    priceCategory: "$$",
    cuisine: "Healthy",
    tags: ["Healthy", "Salads", "Bowls", "Vegan"],
    description:
      "Nourishing bowls, vibrant salads, and cold-pressed juices packed with superfoods. Good food that makes you feel good — inside and out.",
    isOpen: true,
    isFeatured: false,
    region: "UK",
  },
  {
    id: "r6",
    name: "Pizzeria Napoli",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 1850,
    deliveryTime: "30–40 min",
    deliveryFee: 2.00,
    priceCategory: "$$",
    cuisine: "Italian",
    tags: ["Pizza", "Italian", "Calzone"],
    description:
      "Neapolitan-style pies baked at 900°F in a hand-built stone oven. San Marzano tomatoes, buffalo mozzarella, and toppings sourced straight from Italy.",
    isOpen: false,
    isFeatured: true,
    region: "UK",
  },
  {
    id: "r7",
    name: "Seoul Station",
    image:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 1120,
    deliveryTime: "25–40 min",
    deliveryFee: 1.75,
    priceCategory: "$$",
    cuisine: "Korean",
    tags: ["Korean", "BBQ", "Asian"],
    description:
      "Korean BBQ, kimchi jjigae, bibimbap and Korean fried chicken —  Seoul Station brings the vibrant flavors of Korean street food culture right to your door.",
    isOpen: true,
    isFeatured: true,
    region: "IN",
  },
  {
    id: "r8",
    name: "Taco Loco",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    rating: 4.3,
    reviewCount: 540,
    deliveryTime: "15–25 min",
    deliveryFee: null,
    priceCategory: "$",
    cuisine: "Mexican",
    tags: ["Mexican", "Tacos", "Burritos"],
    description:
      "Street-style tacos, loaded burritos, and house-made guacamole with a kick. Authentic Mexican flavors using traditional family recipes.",
    isOpen: true,
    region: "IN",
  },
];

// ─── Menu Items ───────────────────────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  // The Rustic Kitchen (r1)
  {
    id: "m1",
    restaurantId: "r1",
    name: "Truffle Pasta",
    description: "Hand-rolled tagliatelle with black truffle, parmesan, and aged butter",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=80",
    category: "Pasta",
    isVeg: true,
    isBestSeller: true,
  },
  {
    id: "m2",
    restaurantId: "r1",
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh basil, buffalo mozzarella on a thin crust",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    category: "Pizza",
    isVeg: true,
  },
  {
    id: "m3",
    restaurantId: "r1",
    name: "Chicken Parmigiana",
    description: "Crispy breaded chicken breast, marinara sauce, melted mozzarella",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600&auto=format&fit=crop&q=80",
    category: "Mains",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m4",
    restaurantId: "r1",
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1584985269927-a2c8ce4fae13?w=600&auto=format&fit=crop&q=80",
    category: "Desserts",
    isVeg: true,
  },

  // Sakura Garden (r2)
  {
    id: "m5",
    restaurantId: "r2",
    name: "Tonkotsu Ramen",
    description: "Rich pork bone broth, chashu pork, soft-boiled egg, nori, and scallions",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    category: "Ramen",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m6",
    restaurantId: "r2",
    name: "Salmon Sashimi (8 pcs)",
    description: "Premium Atlantic salmon sliced to order, served with pickled ginger and wasabi",
    price: 22.99,
    image:
      "https://images.unsplash.com/photo-1617196034096-84e957e7c195?w=600&auto=format&fit=crop&q=80",
    category: "Sashimi",
    isVeg: false,
  },
  {
    id: "m7",
    restaurantId: "r2",
    name: "Rainbow Roll",
    description: "California roll topped with salmon, tuna, avocado, and sliced cucumber",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop&q=80",
    category: "Sushi Rolls",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m8",
    restaurantId: "r2",
    name: "Matcha Mochi Ice Cream",
    description: "Soft mochi rice cake filled with premium green tea ice cream",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1631204353684-72c032abe45d?w=600&auto=format&fit=crop&q=80",
    category: "Desserts",
    isVeg: true,
  },

  // Spice Route (r3)
  {
    id: "m9",
    restaurantId: "r3",
    name: "Chicken Biryani",
    description: "Slow-cooked basmati rice with spiced chicken, saffron, caramelized onions",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    category: "Rice",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m10",
    restaurantId: "r3",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, velvety tomato-butter sauce with warm spices",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
    category: "Curries",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m11",
    restaurantId: "r3",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a spiced tomato-cream curry",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    category: "Curries",
    isVeg: true,
  },
  {
    id: "m12",
    restaurantId: "r3",
    name: "Garlic Naan (3 pcs)",
    description: "Soft tandoor-baked flatbread brushed with garlic butter and fresh coriander",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
    category: "Breads",
    isVeg: true,
  },

  // Burger Republic (r4)
  {
    id: "m13",
    restaurantId: "r4",
    name: "Double Smash Burger",
    description: "Two smashed beef patties, American cheese, pickles, onions, special sauce",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    category: "Burgers",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m14",
    restaurantId: "r4",
    name: "Crispy Chicken Sandwich",
    description: "Buttermilk fried chicken, coleslaw, pickled jalapeños, honey mustard",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop&q=80",
    category: "Burgers",
    isVeg: false,
  },
  {
    id: "m15",
    restaurantId: "r4",
    name: "Loaded Cheese Fries",
    description: "Hand-cut fries smothered in cheddar sauce, bacon bits, and chipotle mayo",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80",
    category: "Sides",
    isVeg: false,
    isBestSeller: true,
  },

  // Green Bowl (r5)
  {
    id: "m16",
    restaurantId: "r5",
    name: "Buddha Power Bowl",
    description: "Quinoa, roasted chickpeas, avocado, sweet potato, kale, tahini dressing",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    category: "Bowls",
    isVeg: true,
    isBestSeller: true,
  },
  {
    id: "m17",
    restaurantId: "r5",
    name: "Acai Berry Smoothie Bowl",
    description: "Blended acai, banana, and almond milk topped with granola, fruits, seeds",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80",
    category: "Breakfast",
    isVeg: true,
  },

  // Pizzeria Napoli (r6)
  {
    id: "m18",
    restaurantId: "r6",
    name: "Prosciutto e Rucola Pizza",
    description: "Thin crust with prosciutto crudo, arugula, parmesan shavings, olive oil",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
    category: "Pizza",
    isVeg: false,
    isBestSeller: true,
  },

  // Seoul Station (r7)
  {
    id: "m19",
    restaurantId: "r7",
    name: "Korean Fried Chicken",
    description: "Double-fried chicken glazed in gochujang sauce, served with pickled daikon",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600&auto=format&fit=crop&q=80",
    category: "Chicken",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m20",
    restaurantId: "r7",
    name: "Beef Bibimbap",
    description: "Mixed rice with bulgogi beef, assorted vegetables, fried egg, and gochujang",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop&q=80",
    category: "Rice",
    isVeg: false,
  },

  // Taco Loco (r8)
  {
    id: "m21",
    restaurantId: "r8",
    name: "Street Taco Trio",
    description: "Three corn tortillas with carne asada, onion, cilantro, salsa verde",
    price: 10.99,
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    category: "Tacos",
    isVeg: false,
    isBestSeller: true,
  },
  {
    id: "m22",
    restaurantId: "r8",
    name: "Loaded Burrito",
    description: "Grilled chicken, Spanish rice, black beans, cheese, guacamole, pico de gallo",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80",
    category: "Burritos",
    isVeg: false,
  },
];

// ─── Trending Dishes ──────────────────────────────────────────────────────────

export const trendingDishes: TrendingDish[] = [
  {
    id: "t1",
    name: "Margherita Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
    restaurant: "Pizzeria Napoli",
    price: 14.99,
    rating: 4.9,
    region: "UK",
  },
  {
    id: "t2",
    name: "Tonkotsu Ramen",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    restaurant: "Sakura Garden",
    price: 16.99,
    rating: 4.8,
    region: "UK",
  },
  {
    id: "t3",
    name: "Chicken Biryani",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    restaurant: "Spice Route",
    price: 17.99,
    rating: 4.7,
    region: "IN",
  },
  {
    id: "t4",
    name: "Pasta Alfredo",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&auto=format&fit=crop&q=80",
    restaurant: "The Rustic Kitchen",
    price: 15.99,
    rating: 4.6,
    region: "IN",
  },
  {
    id: "t5",
    name: "Rainbow Sushi Roll",
    image:
      "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop&q=80",
    restaurant: "Sakura Garden",
    price: 18.99,
    rating: 4.8,
    region: "UK",
  },
  {
    id: "t6",
    name: "Double Smash Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    restaurant: "Burger Republic",
    price: 12.99,
    rating: 4.7,
    region: "IN",
  },
  {
    id: "t7",
    name: "BBQ Tacos",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    restaurant: "Taco Loco",
    price: 9.99,
    rating: 4.5,
    region: "IN",
  },
  {
    id: "t8",
    name: "Buddha Power Bowl",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    restaurant: "Green Bowl",
    price: 14.99,
    rating: 4.6,
    region: "UK",
  },
];
