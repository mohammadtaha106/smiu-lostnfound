"use client";

import { Button } from "@/components/ui/button";
import { Mail, Share2, Phone } from "lucide-react";
import { toast } from "sonner";

interface ItemDetailsActionsProps {
    email?: string | null;
    phone?: string | null;
    title: string;
    id: string;
}

export function ItemDetailsActions({ email, phone, title, id }: ItemDetailsActionsProps) {
    const handleContact = () => {
        if (email) {
            // Open mailto link
            const subject = encodeURIComponent(`Regarding: ${title}`);
            const body = encodeURIComponent(`Hi,\n\nI found your listing on SMIU Lost & Found website regarding "${title}".\n\n`);
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
            toast.success("Opening email client...");
        } else {
            toast.error("No contact email available for this item");
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/items/${id}`;
        const shareData = {
            title: `SMIU Lost & Found: ${title}`,
            text: `Check out this item on SMIU Lost & Found`,
            url: shareUrl,
        };

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                // Fallback: Copy link to clipboard
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            // User cancelled share or clipboard failed
            if (error instanceof Error && error.name !== "AbortError") {
                // Try fallback clipboard copy
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied to clipboard!");
                } catch {
                    toast.error("Failed to share. Please copy the URL manually.");
                }
            }
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
            <Button
                onClick={handleContact}
                className="w-full bg-smiu-navy hover:bg-slate-800 h-12 text-lg"
            >
                <Mail className="mr-2 h-5 w-5" />
                Contact
            </Button>
            <Button
                onClick={handleShare}
                variant="outline"
                className="w-full h-12 text-lg border-slate-300"
            >
                <Share2 className="mr-2 h-5 w-5" />
                Share
            </Button>
        </div>
    );
}
