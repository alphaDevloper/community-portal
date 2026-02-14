import { Button } from "@/components/ui/button";
import { Code2, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black">
      {/* CTA Section */}
      <div className="relative overflow-hidden border-t border-zinc-100 dark:border-zinc-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
              Ready to Start Building Real Skills?
            </h2>
            <p className="mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Join our community of ambitious students and expert developers.
              Stop learning theory and start building the future.
            </p>
            <Button
              size="lg"
              className="rounded-full px-12 text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform duration-300"
            >
              Join the Community
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-zinc-100 py-12 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  DevConnect
                </span>
              </Link>
              <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
                Bridging the gap between software engineering theory and
                professional industry success.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Community
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#about"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                  >
                    Projects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Connect
              </h3>
              <div className="flex gap-4">
                {/* <Link
                  href="#"
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                >
                  <Twitter className="h-5 w-5" />
                </Link> */}
                <Link
                  href="https://github.com/alphaDevloper"
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/abdullahalam680/"
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-50 pt-8 text-center text-xs text-zinc-400 dark:border-zinc-900">
            <p>© {new Date().getFullYear()} DevConnect. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
