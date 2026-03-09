import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Region = "IN" | "UK";

export interface LocationOption {
  region: Region;
  flag: string;
  country: string;
  cities: string[];
}

export const LOCATIONS: LocationOption[] = [
  {
    region: "IN",
    flag: "🇮🇳",
    country: "India",
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"],
  },
  {
    region: "UK",
    flag: "🇬🇧",
    country: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham", "Bristol", "Edinburgh", "Leeds", "Glasgow"],
  },
];

interface RegionContextValue {
  region: Region;
  city: string;
  flag: string;
  currency: "₹" | "£";
  /** Format a raw price number into the correct currency string */
  formatPrice: (price: number) => string;
  /** Free delivery threshold in local currency units */
  freeDeliveryThreshold: number;
  /** Delivery fee in local currency units */
  deliveryFeeAmount: number;
  setLocation: (region: Region, city: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const RegionContext = createContext<RegionContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [region, setRegion] = useState<Region>("IN");
  const [city, setCity] = useState("Mumbai");

  const setLocation = useCallback((r: Region, c: string) => {
    setRegion(r);
    setCity(c);
  }, []);

  const currency = region === "IN" ? "₹" : "£";
  const flag = region === "IN" ? "🇮🇳" : "🇬🇧";

  const formatPrice = useCallback(
    (price: number) => {
      if (region === "IN") return `₹${Math.round(price)}`;
      return `£${price.toFixed(2)}`;
    },
    [region]
  );

  const freeDeliveryThreshold = region === "IN" ? 999 : 30;
  const deliveryFeeAmount = region === "IN" ? 49 : 1.99;

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      city,
      flag,
      currency,
      formatPrice,
      freeDeliveryThreshold,
      deliveryFeeAmount,
      setLocation,
    }),
    [region, city, flag, currency, formatPrice, freeDeliveryThreshold, deliveryFeeAmount, setLocation]
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useRegion = (): RegionContextValue => {
  const ctx = useContext(RegionContext);
  if (!ctx) throw new Error("useRegion must be used inside <RegionProvider>");
  return ctx;
};
