import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send, Sparkles, Tractor, ShieldCheck, Stethoscope } from "lucide-react";
import type { ApiResponse } from "@farma/shared";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api, authApi } from "../lib/api";
import { useAuth } from "../auth";
import { useI18n } from "../i18n";

type ForumPost = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  comment_count: number;
  latest_comments: Array<{ id: string; body: string; author: { fullName: string; role: string } }>;
  author: { fullName: string; role: string; verified: boolean };
  created_at: string;
};

export function ForumPage() {
  const { user, token } = useAuth();
  const { t } = useI18n();
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState<Record<string, string>>({});
  const posts = useQuery({
    queryKey: ["forum-posts"],
    queryFn: async () => (await api<ApiResponse<ForumPost[]>>("/forum/posts")).data,
    retry: 1
  });

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setStatus("Samo registrovani korisnici mogu pisati na forumu.");
      return;
    }
    const form = new FormData(event.currentTarget);
    await authApi<ApiResponse<unknown>>("/forum/posts", token, {
      method: "POST",
      body: JSON.stringify({
        title: String(form.get("title")),
        body: String(form.get("body")),
        tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean)
      })
    });
    event.currentTarget.reset();
    setStatus(t.saved);
    posts.refetch();
  }

  async function createComment(postId: string) {
    if (!token) {
      setStatus("Samo registrovani korisnici mogu komentarisati.");
      return;
    }
    const body = comments[postId]?.trim();
    if (!body) return;
    await authApi<ApiResponse<unknown>>(`/forum/posts/${postId}/comments`, token, { method: "POST", body: JSON.stringify({ body }) });
    setComments((current) => ({ ...current, [postId]: "" }));
    posts.refetch();
  }

  const previewTopics = [
    { Icon: Tractor, title: "Oprema i mehanizacija", body: "Kvarovi, preporuke, potrosnja i kupovina polovnih masina." },
    { Icon: Stethoscope, title: "Veterinarski savjeti", body: "Vakcinacija, simptomi, tretmani i iskustva sa stanicama." },
    { Icon: ShieldCheck, title: "Provjereni oglasi", body: "Savjeti kako procijeniti dokumentaciju, stanje i prodavca." }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <section className="rise-in mb-6 grid gap-4 rounded-[28px] bg-slate-950 p-5 text-white lg:grid-cols-[1fr_320px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-black text-slate-950"><Sparkles size={16} />Zajednica FARMA OGLASI PRO</div>
          <h1 className="mt-4 text-4xl font-black">{t.forum}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Pitanja o uzgoju, opremi, veterinarima, farmama i iskustvima korisnika na jednom mjestu. Kratki savjeti, realna iskustva i brzi komentari bez lutanja po grupama.</p>
        </div>
        <img src="/marketing-marketplace.png" alt="Forum i marketplace zajednica" className="soft-float h-full min-h-56 w-full rounded-2xl object-cover" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-2xl font-black"><MessageCircle className="text-primary" />Nova tema</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Postavi pitanje, iskustvo ili savjet za zajednicu.</p>
          {status && <div className="mt-4 rounded-md bg-primary/10 p-3 text-sm font-bold text-primary">{status}</div>}
          <form className="mt-4 grid gap-3" onSubmit={createPost}>
            <Input name="title" placeholder="Naslov teme" required />
            <textarea name="body" className="min-h-28 rounded-md border border-border bg-white p-3 dark:bg-[#102017]" placeholder="Sta zelis pitati ili podijeliti?" required />
            <Input name="tags" placeholder="krave, veterinar, sijeno" />
            <Button><Send size={18} />{t.save}</Button>
          </form>
          {!user && <p className="mt-3 text-xs font-bold text-slate-500">Prijava je potrebna za pisanje, citanje je javno.</p>}

          <div className="mt-6 space-y-3">
            {previewTopics.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                <div className="flex items-center gap-2 font-black"><Icon size={16} className="text-primary" />{title}</div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </Card>
        <section className="space-y-4">
          {!posts.data?.length && (
            <Card className="p-6">
              <div className="text-2xl font-black">Prve diskusije krecu ovdje</div>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Forum je spreman, samo jos nema objavljenih tema u trenutnoj bazi. Otvori novu temu lijevo i odmah ce se pojaviti ovdje.</p>
            </Card>
          )}
          {posts.data?.map((post) => (
            <Card key={post.id} className="market-card-hover p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-black">{post.title}</h2>
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-black text-primary">{post.comment_count} komentara</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.body}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span>{post.author.fullName} | {post.author.role}</span>
                {post.tags.map((tag) => <span key={tag} className="rounded-md bg-accent/20 px-2 py-1">#{tag}</span>)}
              </div>
              <div className="mt-4 space-y-2">
                {post.latest_comments.map((comment) => (
                  <div key={comment.id} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-white/5">
                    <div className="font-black">{comment.author.fullName} | {comment.author.role}</div>
                    <div className="mt-1 text-slate-600 dark:text-slate-300">{comment.body}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input value={comments[post.id] ?? ""} onChange={(event) => setComments((current) => ({ ...current, [post.id]: event.target.value }))} placeholder="Komentar..." />
                <Button type="button" onClick={() => createComment(post.id)}>{t.save}</Button>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
