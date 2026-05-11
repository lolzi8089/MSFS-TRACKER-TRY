import Image from "next/image";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { FEED_POSTS } from "@/lib/mock-data";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export const metadata = {
  title: "Community · SkyPulse",
};

export default function FeedPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Activity feed"
        description="Following, comments, and likes — community-first, no algorithmic pay-to-boost."
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 lg:p-6">
        {FEED_POSTS.map((post) => (
          <GlassCard key={post.id} className="p-0">
            <div className="flex gap-4 p-5">
              <Image
                src={post.avatarUrl}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full ring-1 ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-semibold text-white">{post.authorName}</span>
                  <span className="text-sm text-slate-500">@{post.authorHandle}</span>
                  <span className="text-xs text-slate-600">· {post.time}</span>
                </div>
                {post.route ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-300/90">{post.route}</p>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{post.content}</p>
                <div className="mt-4 flex items-center gap-6 text-xs text-slate-500">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/[0.06] hover:text-slate-200"
                  >
                    <Heart className="h-4 w-4" />
                    {post.likes}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/[0.06] hover:text-slate-200"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:bg-white/[0.06] hover:text-slate-200"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
