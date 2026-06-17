import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import type { ApiResponse, Listing } from "@farma/shared";
import { ListingCard } from "../components/ListingCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { demoListings } from "../data/demo";
import { useI18n } from "../i18n";

export function ListingsPage({ type }: { type?: string }) {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [search, setSearch] = useState(initialQ);
  const query = useQuery({
    queryKey: ["listings", type, initialQ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (type) queryParams.set("type", type);
      if (initialQ) queryParams.set("q", initialQ);
      const suffix = queryParams.toString() ? `?${queryParams.toString()}` : "";
      return (await api<ApiResponse<Listing[]>>(`/listings${suffix}`)).data;
    },
    retry: 1
  });
  const listings = query.data?.length ? query.data : demoListings.filter((listing) => {
    const matchesType = !type || listing.type === type;
    const text = `${listing.title} ${listing.description} ${listing.category} ${listing.location}`.toLowerCase();
    return matchesType && (!initialQ || text.includes(initialQ.toLowerCase()));
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params);
    const value = search.trim();
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <form className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]" onSubmit={submit}>
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} />
        <select className="h-10 rounded-md border border-border bg-white px-3 text-sm"><option>All cities</option><option>Sarajevo</option><option>Tuzla</option></select>
        <select className="h-10 rounded-md border border-border bg-white px-3 text-sm"><option>All categories</option><option>CATTLE</option><option>TRACTORS</option><option>FARMS</option></select>
        <Button>{t.search}</Button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </main>
  );
}
