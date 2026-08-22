import { ShoppingBag } from "lucide-react";

export default function MerchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Vader-Verse Merch</h1>
      
      {/* Service Boundary Placeholder */}
      <div className="mb-12 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <p className="text-zinc-400">
          This page will integrate with the Printful API to display and sell exclusive Vader-Verse merchandise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-zinc-800 bg-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
            <div className="h-48 bg-zinc-800 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-zinc-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1">Vader Hoodie {i}</h3>
              <p className="text-red-500 font-bold">$49.99</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
