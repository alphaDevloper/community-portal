import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoaderIcon className="h-16 w-16 animate-spin text-zinc-400" />
    </div>
  );
}
