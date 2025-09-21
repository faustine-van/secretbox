import { Card, CardContent } from "@/components/ui/card";

// app/dashboard/keys/[id]/page.tsx
export default function KeyPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-4">Key Details: {params.id}</h1>
            <p className="text-slate-600 dark:text-slate-400">Key management interface for individual key operations.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}