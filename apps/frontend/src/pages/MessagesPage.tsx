import { Paperclip, Send, SmilePlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Seo } from "../lib/seo";

export function MessagesPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-[320px_1fr]">
      <Seo
        title="Poruke | FARMA OGLASI PRO"
        description="Razgovori izmedju kupaca, prodavaca, farmi i veterinara uz priloge, potvrde citanja i brze odgovore."
        canonicalPath="/messages"
      />
      <Card className="p-3">
        {["Simental junica", "IMT 539", "Veterinarska konsultacija"].map((conversation) => <div key={conversation} className="rounded-md p-3 font-bold hover:bg-primary/10">{conversation}</div>)}
      </Card>
      <Card className="flex min-h-[540px] flex-col p-4">
        <div className="border-b border-border pb-3 font-black">Razgovor uzivo | tipkanje | potvrde citanja | fajlovi | glas</div>
        <div className="flex-1 space-y-3 py-4">
          <div className="w-fit max-w-[80%] rounded-lg bg-slate-100 p-3 dark:bg-white/10">Da li je grlo jos dostupno?</div>
          <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-primary p-3 text-white">Jeste, mozemo zakazati pregled sutra.</div>
        </div>
        <div className="grid gap-2 sm:grid-cols-[auto_auto_1fr_auto]">
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Dodaj prilog"><Paperclip size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Glas ili emoji"><SmilePlus size={18} /></button>
          <Input placeholder="Poruka" />
          <Button><Send size={18} /></Button>
        </div>
      </Card>
    </main>
  );
}
