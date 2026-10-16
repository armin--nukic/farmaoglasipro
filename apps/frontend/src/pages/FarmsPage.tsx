import { Card } from "../components/ui/card";
import { Seo } from "../lib/seo";

const farms = ["Farma Basic", "Agro Sana", "Eko Romanija", "Livno Milk", "Semberija Agro", "Hercegovina Stables"];

export function FarmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Seo
        title="Profili farmi | FARMA OGLASI PRO"
        description="Pregled farmi, imanja, proizvoda, ocjena i provjerenih vlasnika u Bosni i Hercegovini."
        canonicalPath="/farms"
      />
      <h1 className="text-3xl font-black">Profili farmi</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm, index) => (
          <Card key={farm} className="overflow-hidden">
            <img src={`https://images.unsplash.com/photo-${index % 2 ? "1500382017468-9049fed747ef" : "1500595046743-cd271d694d30"}?auto=format&fit=crop&w=900&q=80`} alt={farm} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-black">{farm}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Zivotinje, proizvodi, fotografije, ocjene, pratioci i provjereni podaci o vlasniku.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <span className="rounded-md bg-primary/10 p-2 font-bold text-primary">{20 + index} grla</span>
                <span className="rounded-md bg-accent/20 p-2 font-bold">4.{index + 2}</span>
                <span className="rounded-md bg-slate-100 p-2 font-bold dark:bg-white/10">{index * 37 + 120} pratioca</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
