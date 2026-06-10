import { Card } from "../components/ui/card";

const farms = ["Farma Basic", "Agro Sana", "Eko Romanija", "Livno Milk", "Semberija Agro", "Hercegovina Stables"];

export function FarmsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Farm profiles</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm, index) => (
          <Card key={farm} className="overflow-hidden">
            <img src={`https://images.unsplash.com/photo-${index % 2 ? "1500382017468-9049fed747ef" : "1500595046743-cd271d694d30"}?auto=format&fit=crop&w=900&q=80`} alt={farm} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-black">{farm}</h2>
              <p className="mt-2 text-sm text-slate-600">Animals, products, photos, ratings, followers and verified owner information.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <span className="rounded-md bg-primary/10 p-2 font-bold text-primary">{20 + index} animals</span>
                <span className="rounded-md bg-accent/20 p-2 font-bold">4.{index + 2}</span>
                <span className="rounded-md bg-slate-100 p-2 font-bold">{index * 37 + 120} followers</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
