import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_100%)] dark:bg-[radial-gradient(45%_40%_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_100%)]"></div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Bridging the gap to industry</span>
          </div>

          <h1 className="mb-6 bg-linear-to-b from-zinc-900 to-zinc-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent dark:from-zinc-50 dark:to-zinc-400 sm:text-7xl">
            From Software Engineering Student to{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Job-Ready Developer
            </span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl">
            This community helps SE students move beyond theory, build
            real-world projects, and become industry-ready. Start your journey
            from learner to leader.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-full px-8 text-base font-semibold cursor-pointer"
              >
                Join Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base font-semibold cursor-pointer"
              >
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative lg:block">
          <div className="relative animate-float rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-md bg-zinc-50 dark:bg-zinc-800/50" />
                <div className="h-24 rounded-md bg-zinc-50 dark:bg-zinc-800/50" />
                <div className="h-24 rounded-md bg-zinc-50 dark:bg-zinc-800/50" />
              </div>
              <div className="h-32 rounded-md bg-zinc-50 dark:bg-zinc-800/50" />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-blue-600/10 blur-2xl" />
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-indigo-600/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
