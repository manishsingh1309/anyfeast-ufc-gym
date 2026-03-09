import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, Copy, Plus, Tag } from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { useGym } from "../../context/GymContext";
import { useToast } from "../../context/ToastContext";
import { getCouponsByGym, generateCoupons } from "../../services/couponService";
import { getOwnerLicenseStats } from "../../services/gymService";
import type { Coupon, CouponStatus } from "../../types";

function relativeDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export const TrainerCouponsPage: React.FC = () => {
  const { selectedGym } = useGym();
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<Coupon[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

  // Form state
  const [count, setCount] = useState(1);
  const [couponType, setCouponType] = useState<"basic" | "standard" | "premium">("standard");
  const [expiryDate, setExpiryDate] = useState("");
  const [singleUse, setSingleUse] = useState(true);

  useEffect(() => {
    if (!selectedGym) return;
    Promise.all([getCouponsByGym(selectedGym.id), getOwnerLicenseStats()]).then(([c, stats]) => {
      setCoupons(c as Coupon[]);
      const s = stats as { totalPurchased: number; totalUsed: number; totalAvailable: number };
      setRemaining(s.totalAvailable);
      setLoading(false);
    });
  }, [selectedGym]);

  const handleGenerate = useCallback(async () => {
    if (!selectedGym) return;
    setGenerating(true);
    try {
      const newCoupons = await generateCoupons(selectedGym.id, count);
      setGenerated(newCoupons as Coupon[]);
      setCoupons((prev) => [...(newCoupons as Coupon[]), ...prev]);
      setRemaining((r) => r - count);
      toast.success(`${count} coupon${count > 1 ? 's' : ''} generated successfully!`);
    } finally {
      setGenerating(false);
    }
  }, [selectedGym, count]);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      toast.info(`Code ${code} copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const openModal = () => { setGenerated([]); setModalOpen(true); };

  if (loading) return <Spinner fullPage label="Loading coupons…" />;

  const unusedCount = coupons.filter((c) => c.status === "unused").length;
  const usedCount = coupons.filter((c) => c.status === "used").length;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header
        title="Coupons"
        subtitle={selectedGym?.name}
        actions={
          <button
            onClick={openModal}
            disabled={remaining <= 0}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" />
            Generate Coupons
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Licenses Remaining", value: remaining, color: remaining > 5 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400" },
            { label: "Unused Coupons", value: unusedCount, color: "text-brand-600 dark:text-brand-400" },
            { label: "Used Coupons", value: usedCount, color: "text-gray-700 dark:text-slate-300" },
          ].map((s) => (
            <Card key={s.label} padding="md">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{s.label}</p>
              <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {remaining <= 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            No licenses remaining. Contact your gym owner to purchase more.
          </div>
        )}

        <Card padding="none">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Coupon List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Code", "Status", "Assigned To", "Expires", ""].map((h, i) => (
                    <th key={i} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono font-semibold text-gray-800 dark:text-slate-200">{c.code}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={c.status as CouponStatus}>{c.status}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400">{c.assignedTo ?? "—"}</td>
                    <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400">{relativeDate(c.expiresAt)}</td>
                    <td className="px-6 py-3.5">
                      {c.status === "unused" && (
                        <button
                          onClick={() => copyCode(c.id, c.code)}
                          className="flex items-center gap-1.5 text-xs text-brand-600 hover:underline dark:text-brand-400"
                        >
                          {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedId === c.id ? "Copied" : "Copy"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-400 dark:text-slate-500">No coupons yet. Generate your first batch.</p>
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate Coupons"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300">
              Cancel
            </button>
            {generated.length === 0 ? (
              <button
                onClick={handleGenerate}
                disabled={generating || remaining <= 0}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {generating ? "Generating…" : <><Tag className="h-4 w-4" /> Generate</>}
              </button>
            ) : (
              <button onClick={() => setModalOpen(false)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Done</button>
            )}
          </div>
        }
      >
        {generated.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-brand-50 px-4 py-2 text-sm dark:bg-brand-600/10">
              <span className="font-medium text-brand-700 dark:text-brand-400">{remaining} licenses</span>
              <span className="text-brand-500 dark:text-brand-500"> remaining</span>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Number of Coupons</label>
              <input type="number" min={1} max={Math.min(remaining, 50)} value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(remaining, Number(e.target.value))))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Coupon Type</label>
              <select value={couponType} onChange={(e) => setCouponType(e.target.value as typeof couponType)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Expiry Date</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Single Use Only</span>
              <button onClick={() => setSingleUse(!singleUse)}
                className={`relative h-6 w-11 rounded-full transition-colors ${singleUse ? "bg-brand-600 dark:bg-brand-500" : "bg-gray-200 dark:bg-slate-600"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${singleUse ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-400">{generated.length} coupon(s) generated successfully!</p>
            {generated.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{c.code}</span>
                <button onClick={() => copyCode(c.id, c.code)} className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400">
                  {copiedId === c.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === c.id ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};
