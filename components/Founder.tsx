import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function Founder() {
  return (
    <section id="founder" className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            About the Community Admin
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 opacity-25 blur transition duration-1000 group-hover:opacity-50 group-hover:duration-200"></div>
              <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                <Image
                  src="/Abdullah Alam.jpeg"
                  alt="Abdullah Alam"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex flex-wrap justify-center gap-2 mb-6 lg:justify-start">
              <Badge variant="secondary" className="rounded-full px-4 py-1">
                Full Stack Developer
              </Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1">
                React & Next.js
              </Badge>
              <Badge variant="secondary" className="rounded-full px-4 py-1">
                Community Builder
              </Badge>
            </div>

            <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Abdullah Alam
            </h3>

            <div className="space-y-4 text-lg text-zinc-600 dark:text-zinc-400">
              <p>
                I am a self-taught full-stack developer with over 3 years of
                hands-on experience building production ready applications.
              </p>
              <p>
                I'm deeply passionate about helping SE students move beyond the
                classroom. I built this community to guide students in the right
                direction, helping them transition into professional developers
                through practical mentorship and real-world project experience.
              </p>
            </div>

            <div className="mt-8">
              <blockquote className="border-l-4 border-blue-600 pl-4 italic text-zinc-500">
                "My mission is to help you build the skills that companies
                actually pay for."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Admin Team Grid */}
        {/* <div className="mt-20">
          <h3 className="mb-10 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Meet the Team
          </h3>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Abdullah Alam", role: "Founder & Lead Developer" },
              { name: "Admin 2", role: "Content Manager" },
              { name: "Admin 3", role: "Community Manager" },
            ].map((admin) => (
              <div
                key={admin.name}
                className="group flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative mb-5">
                  <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 blur transition duration-500 group-hover:opacity-30" />
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-zinc-100 shadow-lg dark:border-zinc-800">
                    <Image
                      src="/Abdullah Alam.jpeg"
                      alt={admin.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <h4 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {admin.name}
                </h4>
                <Badge
                  variant="secondary"
                  className="rounded-full px-4 py-1 text-xs"
                >
                  {admin.role}
                </Badge>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
