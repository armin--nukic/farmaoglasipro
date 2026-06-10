import { CalendarDays, ClipboardPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function AppointmentsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-5">
        <h1 className="flex items-center gap-2 text-2xl font-black"><CalendarDays className="text-primary" />Book veterinary visit</h1>
        <div className="mt-5 space-y-3">
          <Input placeholder="Veterinarian ID" />
          <Input placeholder="Animal ID" />
          <Input type="datetime-local" />
          <Input placeholder="Reason" />
          <Button className="w-full">Create appointment</Button>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-2xl font-black"><ClipboardPlus className="text-primary" />Animal health module</h2>
        <div className="mt-5 space-y-3">
          {["Upcoming vaccination", "Treatment report", "Veterinary note", "Prescription", "QR animal passport"].map((item) => (
            <div key={item} className="rounded-md border border-border p-3 font-semibold">{item}</div>
          ))}
        </div>
      </Card>
    </main>
  );
}
