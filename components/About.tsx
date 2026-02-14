import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Rocket, TrendingUp } from "lucide-react";

const reasons = [
  {
    title: "Practical Skills",
    description:
      "Master the tools and frameworks used in the industry, from Git workflows to cloud deployment.",
    icon: Code,
    color: "text-blue-600",
  },
  {
    title: "Real Projects",
    description:
      "Collaborate on production-grade projects that look great on your portfolio and impress recruiters.",
    icon: Rocket,
    color: "text-indigo-600",
  },
  {
    title: "Career Focus",
    description:
      "From code reviews to interview prep, we focus on what really matters for getting hired.",
    icon: TrendingUp,
    color: "text-emerald-600",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Community Mission
          </h2>
          <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why This Community Exists
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
            Many SE students focus only on theory and GPA, but companies hire
            based on skills, projects, and problem-solving. We bridge that gap.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="group border-zinc-200 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <CardContent className="p-8">
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-800 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20`}
                >
                  <reason.icon className={`h-6 w-6 ${reason.color}`} />
                </div>
                <h4 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {reason.title}
                </h4>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {reason.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/30 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-50">
                Practical Learning
              </h5>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Beyond textbooks, into the codebase.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-50">
                Building Projects
              </h5>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Real apps, real users, real impact.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-50">
                Code Reviews
              </h5>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Learn to write clean, professional code.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-50">
                Growth Mindset
              </h5>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Accountability for your career goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
