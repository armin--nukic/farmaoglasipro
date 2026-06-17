import { BadgeCheck, Clock3, Eye, Heart, MapPin } from "lucide-react";
import type { Listing } from "@farma/shared";
import { Card } from "./ui/card";
import { formatPrice } from "../lib/utils";
import { useI18n } from "../i18n";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const rawListing = listing as Listing & {
    image_urls?: string[];
    video_urls?: string[];
    published_at?: string;
    expires_at?: string;
    owner?: Listing["owner"] & { full_name?: string };
  };
  const imageUrls = rawListing.imageUrls ?? rawListing.image_urls ?? [];
  const owner = rawListing.owner ?? { id: "", fullName: "FARMA OGLASI PRO", verified: false, role: "REGISTERED_USER" as const };
  const ownerName = owner.fullName ?? owner.full_name ?? "FARMA OGLASI PRO";
  const fallbackImage = listing.type === "EQUIPMENT" ? "/marketing-marketplace.png" : listing.type === "REAL_ESTATE" ? "/farma-hero-pro.png" : listing.category?.toLowerCase().includes("horse") ? "/listing-horse.png" : listing.category?.toLowerCase().includes("goat") ? "/listing-goats.png" : "/listing-sheep.png";

  return (
    <Card className="market-card-hover overflow-hidden">
      <div className="aspect-[4/3] bg-slate-200">
        <img src={imageUrls[0] ?? fallbackImage} alt={listing.title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {listing.featured && <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">{t.featured}</span>}
          {listing.urgent && <span className="rounded-md bg-danger px-2 py-1 text-xs font-bold text-danger-foreground">{t.urgent}</span>}
          {owner.verified && <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary"><BadgeCheck size={13} />{t.verifiedSeller}</span>}
        </div>
        <div>
          <h3 className="line-clamp-2 text-lg font-bold">{listing.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{listing.description}</p>
        </div>
        <div className="text-2xl font-black text-primary">{formatPrice(listing.price, listing.currency)}</div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{ownerName}</div>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1"><MapPin size={15} />{listing.location}</span>
          <span className="inline-flex items-center gap-1"><Eye size={15} />{listing.views}</span>
          <span className="inline-flex items-center gap-1"><Heart size={15} />{listing.favorites}</span>
          <span className="inline-flex items-center gap-1"><Clock3 size={15} />60 dana</span>
        </div>
      </div>
    </Card>
  );
}
