import { Gavel, Timer } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatPrice } from "../lib/utils";
import { useI18n } from "../i18n";

export function AuctionsPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Animal and equipment auctions</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-5">
            <Gavel className="text-primary" />
            <h2 className="mt-3 text-xl font-black">Auction #{item}: premium livestock lot</h2>
            <div className="mt-3 text-3xl font-black text-primary">{formatPrice(2500 + item * 700)}</div>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Timer size={16} />Ends in {item + 2} days | 18 bids | auto bid enabled</p>
            <Button className="mt-5 w-full">{t.placeBid}</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
