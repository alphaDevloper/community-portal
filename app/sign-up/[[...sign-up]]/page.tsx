import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="relative w-full max-w-md">
        {/* Decorative background element */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
