"use client";
import Link from "next/link";
import { BuilderHeader } from "@/components/dashboard/BuilderHeader";
import { PosterCard } from "@/components/dashboard/PosterCard";
import { SharePanel } from "@/components/dashboard/SharePanel";
import { useWedding } from "@/components/dashboard/WeddingProvider";
import { publishProblems } from "@/lib/validate";

export function ShareView() {
  const { bundle } = useWedding();
  const problems = publishProblems(bundle);
  return (
    <div className="min-h-svh">
      <BuilderHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        <p className="eyebrow">Share website</p>
        <h1 className="display mb-8 mt-2 text-4xl sm:text-5xl">Share with everyone you love</h1>
        {problems.length > 0 ? (
          <div className="card p-6 sm:p-8">
            <p className="font-display text-3xl">A few details are missing</p>
            <ul className="mt-4 space-y-1 text-danger">
              {problems.map((p) => <li key={p.text}>{p.text}</li>)}
            </ul>
            <Link href="/create" className="btn-primary mt-6">Go to details</Link>
          </div>
        ) : (
          <>
            <SharePanel />
            <PosterCard />
          </>
        )}
      </main>
    </div>
  );
}
