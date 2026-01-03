"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <PieChart className="h-4 w-4" />
            Effortless Tracking
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Take Control of Your Finances
            </span>
          </h1>
          <p className="max-w-[650px] text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl lg:text-2xl">
            Track your income and expenses, manage transactions, and gain
            data-driven insights to{" "}
            <span className="font-semibold text-primary">grow your savings</span>
            . Make smarter decisions with a simple, beautiful finance tracking
            app.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="gap-2 px-6 py-6 text-base shadow-lg transition sm:px-8 sm:text-lg"
            >
              <Link href="/transactions">
                Add Transaction
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 px-6 py-6 text-base shadow-sm transition sm:px-8 sm:text-lg"
            >
              <Link href="#how-it-works">
                How it Works
                <TrendingUp className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
