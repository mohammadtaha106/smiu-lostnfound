import { getPostById } from "@/actions/post.actions";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, ArrowLeft, Mail, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-smiu-navy mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0">
            
            
            <div className="relative h-96 md:h-auto bg-slate-100">
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
              
              <div className="absolute top-6 left-6">
                 <Badge className={`${isLost ? "bg-red-600" : "bg-emerald-600"} text-white px-4 py-1 text-base border-0`}>
                    {isLost ? "LOST" : "FOUND"}
                 </Badge>
              </div>
            </div>

            {/* RIGHT: Details Section */}
            <div className="p-8 md:p-10 flex flex-col">
              
              <div className="mb-auto">
                <Badge variant="outline" className="mb-4 text-slate-600 border-slate-300">
                  {item.category}
                </Badge>
                
                <h1 className="text-3xl font-bold text-smiu-navy mb-4 leading-tight">
                  {item.title}
                </h1>
                
                <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                  {item.description}
                </p>

                <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-700">
                    <MapPin className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Location:</span> {item.location}
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Calendar className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Date:</span> 
                    {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                  </div>
                  
                  {item.studentName && (
                    <div className="flex items-center gap-3 text-slate-700">
                      <User className="h-5 w-5 text-amber-500" />
                      <span className="font-semibold">Owner Name:</span> {item.studentName}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <Button className="w-full bg-smiu-navy hover:bg-slate-800 h-12 text-lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact
                </Button>
                <Button variant="outline" className="w-full h-12 text-lg border-slate-300">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}