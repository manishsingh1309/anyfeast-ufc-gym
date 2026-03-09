import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Tag,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "../../components/food/Navbar";
import { useCart } from "../../context/CartContext";
import { useRegion } from "../../context/RegionContext";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { formatPrice, freeDeliveryThreshold, deliveryFeeAmount } = useRegion();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryFee = totalPrice > 0 ? (totalPrice >= freeDeliveryThreshold ? 0 : deliveryFeeAmount) : 0;
  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const taxes = (totalPrice - discount) * 0.08;
  const grandTotal = totalPrice - discount + deliveryFee + taxes;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "FEAST10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try FEAST10!");
    }
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-3 leading-relaxed">
            Your food is being prepared. Estimated delivery in{" "}
            <strong className="text-gray-800">30–45 minutes</strong>.
          </p>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl px-6 py-4 mb-8 w-full">
            <p className="text-sm text-orange-700 font-medium">
              Order ID: <strong>#AF{Math.floor(100000 + Math.random() * 900000)}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate("/food")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-orange-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Add some delicious food from a restaurant and come back here to checkout!
          </p>
          <button
            onClick={() => navigate("/food")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-colors shadow-lg shadow-orange-200"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-orange-500 hover:border-orange-300 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-orange-500" /> Your Cart
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center flex-shrink-0 ${item.isVeg ? "border-green-500" : "border-red-500"}`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-base truncate">{item.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-extrabold text-orange-500">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-1.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-gray-800 min-w-[20px] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo code */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" /> Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-gray-400"
                />
                <button
                  onClick={applyPromo}
                  disabled={!promoCode}
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-green-600 text-xs font-medium mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 10% discount applied!
                </p>
              )}
              {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
              {!promoApplied && !promoError && (
                <p className="text-gray-400 text-xs mt-2">Hint: try FEAST10</p>
              )}
            </div>

            {/* Delivery info */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛵</span>
                <div>
                  <p className="text-sm font-bold text-orange-800">
                    {deliveryFee === 0
                      ? "You qualify for free delivery!"
                      : `Add ${formatPrice(freeDeliveryThreshold - totalPrice)} more for free delivery`}
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5">Orders over {formatPrice(freeDeliveryThreshold)} get free delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
              <h2 className="font-extrabold text-gray-900 text-base mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Promo (FEAST10)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee</span>
                  <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes (8%)</span>
                  <span>{formatPrice(taxes)}</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between font-extrabold text-gray-900 text-lg">
                    <span>Total</span>
                    <span className="text-orange-500">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-gray-500 mb-2 font-medium">We accept</p>
                <div className="flex gap-2">
                  {["💳 Card", "🍎 Pay", "📱 UPI"].map((p) => (
                    <span key={p} className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-lg">{p}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold px-5 py-4 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-orange-200 group"
              >
                <span>Place Order</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                By placing the order, you agree to our{" "}
                <a href="#" className="text-orange-500 underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
