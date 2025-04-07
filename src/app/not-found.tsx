"use client"
import Header from "@/components/layout/Header";
import NotFound from "@/components/notFound";

export default function NotFoundPage() {
  return (
    <main>
      <Header />
      <div className="h-full flex items-center justify-center min-h-[80vh]">
        <NotFound />
      </div>
    </main>
  );
}
