"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    if (currentPage > 3) {
        pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
    }

    // Show ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
        pages.push("...");
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                                ...
                            </span>
                        );
                    }

                    const pageNumber = page as number;
                    const isActive = pageNumber === currentPage;

                    return (
                        <Button
                            key={pageNumber}
                            variant={isActive ? "default" : "outline"}
                            size="icon"
                            onClick={() => onPageChange(pageNumber)}
                            className={`h-9 w-9 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                                }`}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            </div>

            {/* Next Button */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
        </div>
    );
}
