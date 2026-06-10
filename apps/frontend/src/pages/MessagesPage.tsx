import { Paperclip, Send, SmilePlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function MessagesPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-[320px_1fr]">
      <Card className="p-3">
        {["Simental junica", "IMT 539", "Vet consultation"].map((conversation) => <div key={conversation} className="rounded-md p-3 font-bold hover:bg-primary/10">{conversation}</div>)}
      </Card>
      <Card className="flex min-h-[540px] flex-col p-4">
        <div className="border-b border-border pb-3 font-black">Realtime chat · typing · read receipts · files · voice</div>
        <div className="flex-1 space-y-3 py-4">
          <div className="w-fit max-w-[80%] rounded-lg bg-slate-100 p-3">Da li je grlo jos dostupno?</div>
          <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-primary p-3 text-white">Jeste, mozemo zakazati pregled sutra.</div>
        </div>
        <div className="flex gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Attach"><Paperclip size={18} /></button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-border" aria-label="Voice or emoji"><SmilePlus size={18} /></button>
          <Input placeholder="Message" />
          <Button><Send size={18} /></Button>
        </div>
      </Card>
    </main>
  );
}
