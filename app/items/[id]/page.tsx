import { getPostById } from "@/actions/post.actions";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemDetailsActions } from "@/components/ItemDetailsActions";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;


  const { success, data: item } = await getPostById(id);

  if (!success || !item) {
    return notFound();
  }

  const isLost = item.type === "LOST";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-4 sm:mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
          <span className="text-sm sm:text-base">Back to Feed</span>
        </Link>

        <div className="bg-gradient-to-br from-white via-white to-blue-50/30 rounded-2xl shadow-md border border-slate-200 hover:border-blue-200 overflow-hidden max-w-4xl mx-auto transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-0">

            {/* LEFT: Image Section */}
            <div className="relative h-64 sm:h-80 md:h-auto bg-slate-100">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <Badge className={`${isLost ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"} px-3 sm:px-4 py-1 text-sm sm:text-base font-semibold border`}>
                  {isLost ? "LOST" : "FOUND"}
                </Badge>
              </div>
            </div>

            {/* RIGHT: Details Section */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col">

              <div className="mb-auto">
                <Badge variant="outline" className="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-600 border-slate-300">
                  {item.category}
                </Badge>

                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3 sm:mb-4 leading-tight tracking-tight">
                  {item.title}
                </h1>

                <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                  {item.description}
                </p>

                <div className="space-y-3 sm:space-y-4 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-semibold">Location:</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-semibold">Date:</span>
                    {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                  </div>

                  {item.studentName && (
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-semibold">Owner Name:</span>
                      <span className="truncate">{item.studentName}</span>
                    </div>
                  )}

                  {item.phone && (
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 flex-shrink-0" strokeWidth={1.5} />
                      <span className="font-semibold">Contact:</span>
                      <span className="truncate">{item.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <ItemDetailsActions
                email={item.email}
                phone={item.phone}
                title={item.title}
                id={item.id}
              />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
