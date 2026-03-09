import React from "react";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useRegion } from "../../context/RegionContext";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { items, totalPrice, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { formatPrice, freeDeliveryThreshold, deliveryFeeAmount } = useRegion();
  const navigate = useNavigate();

  const deliveryFee = totalPrice > 0 ? (totalPrice >= freeDeliveryThreshold ? 0 : deliveryFeeAmount) : 0;
  const taxes = totalPrice * 0.08;
  const grandTotal = totalPrice + deliveryFee + taxes;

  const handleCheckout = () => {
    onClose();
    navigate("/food/cart");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Your Cart</h2>
              <p className="text-xs text-gray-500">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 pb-16">
              <div className="text-7xl mb-4">🛒</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6">
                Add items from a restaurant to get started
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="px-5 py-4 divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(item.price)} each
                    </p>

                    {/* Qty control */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-800 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary & checkout */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-gray-100 bg-gray-50/50">
            {/* Promo banner */}
            {totalPrice >= freeDeliveryThreshold && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 mb-4">
                <span className="text-green-600 text-sm">🎉</span>
                <p className="text-xs text-green-700 font-medium">
                  You qualify for <strong>free delivery!</strong>
                </p>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
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
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-orange-200"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartPanel;
