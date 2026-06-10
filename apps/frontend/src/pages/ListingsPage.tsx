import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, Listing } from "@farma/shared";
import { ListingCard } from "../components/ListingCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { demoListings } from "../data/demo";

export function ListingsPage({ type }: { type?: string }) {
  const query = useQuery({
    queryKey: ["listings", type],
    queryFn: async () => (await api<ApiResponse<Listing[]>>(`/listings${type ? `?type=${type}` : ""}`)).data,
    retry: 1
  });
  const listings = query.data?.length ? query.data : demoListings.filter((listing) => !type || listing.type === type);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <Input placeholder="Search marketplace" />
        <select className="h-10 rounded-md border border-border bg-white px-3 text-sm"><option>All cities</option><option>Sarajevo</option><option>Tuzla</option></select>
        <select className="h-10 rounded-md border border-border bg-white px-3 text-sm"><option>All categories</option><option>CATTLE</option><option>TRACTORS</option><option>FARMS</option></select>
        <Button>Apply filters</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </main>
  );
}
