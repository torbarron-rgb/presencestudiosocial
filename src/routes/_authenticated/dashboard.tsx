import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  addSale,
  createLink,
  deleteLink,
  deleteSale,
  getDashboard,
  setLinkActive,
  updateSaleStatus,
} from "@/lib/tracking.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Referral dashboard — Presence Studio" },
      { name: "description", content: "Track referral links, clicks and commissions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const fetchDashboard = useServerFn(getDashboard);
  const create = useServerFn(createLink);
  const toggle = useServerFn(setLinkActive);
  const removeLink = useServerFn(deleteLink);
  const newSale = useServerFn(addSale);
  const saleStatus = useServerFn(updateSaleStatus);
  const removeSale = useServerFn(deleteSale);

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["dashboard"] });
  const m = <T,>(fn: (v: T) => Promise<unknown>) =>
    useMutation({ mutationFn: fn, onSuccess: invalidate });

  const createMut = m(create);
  const toggleMut = m(toggle);
  const deleteLinkMut = m(removeLink);
  const saleMut = m(newSale);
  const statusMut = m(saleStatus);
  const deleteSaleMut = m(removeSale);

  const [form, setForm] = useState({
    business_name: "",
    product_name: "",
    destination_url: "",
    commission_rate: "10",
    notes: "",
  });

  const [sale, setSale] = useState({
    link_id: "",
    amount: "",
    commission: "",
    customer_name: "",
    note: "",
    occurred_on: new Date().toISOString().slice(0, 10),
  });

  const links = data?.links ?? [];
  const clicks = data?.clicks ?? [];
  const sales = data?.sales ?? [];

  const clicksFor = (id: string) => clicks.filter((c) => c.link_id === id).length;
  const salesFor = (id: string) => sales.filter((s) => s.link_id === id);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const totalEarned = sales.reduce((sum, s) => sum + Number(s.commission), 0);
  const totalSales = sales.reduce((sum, s) => sum + Number(s.amount), 0);

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            Presence<span className="text-accent">.</span>Studio
          </Link>
          <button
            onClick={signOut}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Referral tracking</h1>
          <p className="mt-2 text-muted-foreground">
            Create a tracked link for each business, put it in the page bio, and log the sales you earn on.
          </p>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {(error as Error).message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Links", value: String(links.length) },
            { label: "Clicks", value: String(clicks.length) },
            { label: "Sales value", value: money(totalSales) },
            { label: "Your commission", value: money(totalEarned) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* New link */}
        <section className="rounded-3xl border border-border bg-card p-8">
          <h2 className="font-display text-xl font-semibold">New tracked link</h2>
          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMut.mutate(
                {
                  data: {
                    business_name: form.business_name,
                    product_name: form.product_name || undefined,
                    destination_url: form.destination_url,
                    commission_rate: Number(form.commission_rate || 0),
                    notes: form.notes || undefined,
                  },
                } as never,
                {
                  onSuccess: () =>
                    setForm({
                      business_name: "",
                      product_name: "",
                      destination_url: "",
                      commission_rate: "10",
                      notes: "",
                    }),
                },
              );
            }}
          >
            <Field label="Business" value={form.business_name} required
              onChange={(v) => setForm({ ...form, business_name: v })} />
            <Field label="Product (optional)" value={form.product_name}
              onChange={(v) => setForm({ ...form, product_name: v })} />
            <Field label="Where the link goes" type="url" placeholder="https://" required
              value={form.destination_url} onChange={(v) => setForm({ ...form, destination_url: v })} />
            <Field label="Commission %" type="number" value={form.commission_rate}
              onChange={(v) => setForm({ ...form, commission_rate: v })} />
            <div className="md:col-span-2">
              <Field label="Notes (optional)" value={form.notes}
                onChange={(v) => setForm({ ...form, notes: v })} />
            </div>
            <div>
              <button
                type="submit"
                disabled={createMut.isPending}
                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {createMut.isPending ? "Creating…" : "Create link"}
              </button>
            </div>
          </form>
        </section>

        {/* Links */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Your links</h2>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && links.length === 0 && (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          )}
          {links.map((l) => {
            const ls = salesFor(l.id);
            const earned = ls.reduce((sum, s) => sum + Number(s.commission), 0);
            return (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {l.business_name}
                      {l.product_name ? ` — ${l.product_name}` : ""}
                    </p>
                    <button
                      onClick={() => navigator.clipboard?.writeText(`${origin}/r/${l.slug}`)}
                      className="mt-1 text-sm text-accent hover:underline"
                    >
                      {origin}/r/{l.slug} — copy
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {clicksFor(l.id)} clicks · {ls.length} sales · {money(earned)} earned ·{" "}
                      {Number(l.commission_rate)}% commission
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleMut.mutate({ data: { id: l.id, is_active: !l.is_active } } as never)}
                      className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
                    >
                      {l.is_active ? "Pause" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this link and its history?"))
                          deleteLinkMut.mutate({ data: { id: l.id } } as never);
                      }}
                      className="rounded-full border border-border px-4 py-2 text-xs text-destructive hover:bg-secondary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Log a sale */}
        <section className="rounded-3xl border border-border bg-card p-8">
          <h2 className="font-display text-xl font-semibold">Log a sale</h2>
          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              saleMut.mutate(
                {
                  data: {
                    link_id: sale.link_id,
                    amount: Number(sale.amount || 0),
                    commission: Number(sale.commission || 0),
                    customer_name: sale.customer_name || undefined,
                    note: sale.note || undefined,
                    status: "pending" as const,
                    occurred_on: sale.occurred_on,
                  },
                } as never,
                {
                  onSuccess: () =>
                    setSale({
                      link_id: "",
                      amount: "",
                      commission: "",
                      customer_name: "",
                      note: "",
                      occurred_on: new Date().toISOString().slice(0, 10),
                    }),
                },
              );
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium">Link</label>
              <select
                required
                value={sale.link_id}
                onChange={(e) => {
                  const link = links.find((l) => l.id === e.target.value);
                  const rate = link ? Number(link.commission_rate) : 0;
                  const amount = Number(sale.amount || 0);
                  setSale({
                    ...sale,
                    link_id: e.target.value,
                    commission: amount ? ((amount * rate) / 100).toFixed(2) : sale.commission,
                  });
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                <option value="">Select a link</option>
                {links.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.business_name}
                    {l.product_name ? ` — ${l.product_name}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Sale date" type="date" required value={sale.occurred_on}
              onChange={(v) => setSale({ ...sale, occurred_on: v })} />
            <Field
              label="Sale amount"
              type="number"
              required
              value={sale.amount}
              onChange={(v) => {
                const link = links.find((l) => l.id === sale.link_id);
                const rate = link ? Number(link.commission_rate) : 0;
                setSale({
                  ...sale,
                  amount: v,
                  commission: v ? ((Number(v) * rate) / 100).toFixed(2) : "",
                });
              }}
            />
            <Field label="Your commission" type="number" required value={sale.commission}
              onChange={(v) => setSale({ ...sale, commission: v })} />
            <Field label="Customer (optional)" value={sale.customer_name}
              onChange={(v) => setSale({ ...sale, customer_name: v })} />
            <Field label="Note (optional)" value={sale.note}
              onChange={(v) => setSale({ ...sale, note: v })} />
            <div>
              <button
                type="submit"
                disabled={saleMut.isPending}
                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saleMut.isPending ? "Saving…" : "Add sale"}
              </button>
            </div>
          </form>
        </section>

        {/* Sales */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Sales</h2>
          {sales.length === 0 && <p className="text-sm text-muted-foreground">No sales logged yet.</p>}
          <div className="space-y-3">
            {sales.map((s) => {
              const link = links.find((l) => l.id === s.link_id);
              return (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {money(Number(s.amount))} · {money(Number(s.commission))} to you
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.occurred_on} · {link?.business_name ?? "Deleted link"}
                      {s.customer_name ? ` · ${s.customer_name}` : ""}
                      {s.note ? ` · ${s.note}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        statusMut.mutate({ data: { id: s.id, status: e.target.value } } as never)
                      }
                      className="rounded-full border border-border bg-background px-3 py-2 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="paid">Paid</option>
                    </select>
                    <button
                      onClick={() => deleteSaleMut.mutate({ data: { id: s.id } } as never)}
                      className="rounded-full border border-border px-3 py-2 text-xs text-destructive hover:bg-secondary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
