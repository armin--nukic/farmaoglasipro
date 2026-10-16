import { Gavel, Timer } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatPrice } from "../lib/utils";
import { Seo } from "../lib/seo";
import { useI18n } from "../i18n";

export function AuctionsPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Aukcije stoke i opreme | FARMA OGLASI PRO"
        description="Aukcije za premium grla, traktore i poljoprivrednu opremu sa ponudama, odbrojavanjem i auto bid opcijom."
        canonicalPath="/auctions"
      />
      <h1 className="text-3xl font-black">Aukcije zivotinja i opreme</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-5">
            <Gavel className="text-primary" />
            <h2 className="mt-3 text-xl font-black">Aukcija #{item}: premium lot grla</h2>
            <div className="mt-3 text-3xl font-black text-primary">{formatPrice(2500 + item * 700)}</div>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Timer size={16} />Zavrsava za {item + 2} dana | 18 ponuda | auto bid ukljucen</p>
            <Button className="mt-5 w-full">{t.placeBid}</Button>
          </Card>
        ))}
      </div>
    </main>
  );
}
