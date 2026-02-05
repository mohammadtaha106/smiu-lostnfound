# 🔄 Comprehensive Status System - Implementation Plan

## Overview
A robust status management system for SMIU Lost & Found with **proper state transitions**, **immutability rules**, and **clear workflows** for both LOST and FOUND items.

---

## 📊 Status Definitions

### **All Possible Statuses**

| Status | Label | Description | Who Can See on Homepage? |
|--------|-------|-------------|--------------------------|
| `OPEN` | Active | Item just reported, awaiting claims | ✅ Everyone |
| `CLAIMED` | Claimed | Someone claimed/contacted about it | ✅ Everyone (still active) |
| `VERIFIED` | Verified | Claim verified, pending handover | ❌ Hidden (almost done) |
| `RESOLVED` | Resolved | Item returned/case closed | ❌ Hidden (closed) |
| `CANCELLED` | Cancelled | User cancelled the listing | ❌ Hidden (removed) |

---

## 🔄 Status Flow Diagrams

### **Flow 1: LOST Item (User Lost Something)**

```
┌──────────────────────────────────────────────────────────────────┐
│                    LOST ITEM JOURNEY                              │
└──────────────────────────────────────────────────────────────────┘

Step 1: User Reports Lost Item
├─ User: "I lost my wallet"
├─ Status: OPEN
├─ Visibility: ✅ Shows on homepage
└─ Action Available: "Mark as Claimed"

                              │
                              ▼
Step 2: Someone Contacts About It
├─ User clicks "Mark as Claimed"
├─ Status: OPEN → CLAIMED
├─ Visibility: ✅ Still shows on homepage (might be wrong claim)
├─ UI Change: Badge changes to "CLAIMED"
└─ Action Available: "Verify & Resolve" or "Revert to Open"

                              │
                              ▼
Step 3a: Verify It's Really Found
├─ User clicks "Verify & Resolve"
├─ Status: CLAIMED → VERIFIED
├─ Visibility: ❌ Hidden from homepage (in verification)
├─ UI Change: Badge changes to "VERIFIED"
└─ Action Available: "Mark as Resolved" or "Revert to Claimed"

                              │
                              ▼
Step 4a: Item Returned
├─ User clicks "Mark as Resolved"
├─ Status: VERIFIED → RESOLVED
├─ Visibility: ❌ Hidden from homepage (done!)
├─ UI Change: Badge changes to "RESOLVED"
├─ resolvedAt: Timestamp recorded
└─ Action Available: None (FINAL - immutable)

                              │
Steps 3b-4b: Alternative - False Claim
├─ From CLAIMED → "Revert to Open"
├─ Status: CLAIMED → OPEN
└─ Restarts the process
```

---

### **Flow 2: FOUND Item (User Found Something)**

```
┌──────────────────────────────────────────────────────────────────┐
│                    FOUND ITEM JOURNEY                             │
└──────────────────────────────────────────────────────────────────┘

Step 1: User Reports Found Item
├─ User: "I found a student ID card"
├─ Status: OPEN
├─ Visibility: ✅ Shows on homepage
├─ Auto-notification: Email sent to owner if registered
└─ Action Available: "Mark as Claimed"

                              │
                              ▼
Step 2: Owner Contacts/Claims It
├─ User clicks "Mark as Claimed"
├─ Status: OPEN → CLAIMED
├─ Visibility: ✅ Still shows (pending verification)
├─ UI Change: Badge changes to "CLAIMED"
└─ Action Available: "Verify Owner" or "Revert to Open"

                              │
                              ▼
Step 3: Verify It's the Real Owner
├─ User clicks "Verify Owner"
├─ Status: CLAIMED → VERIFIED
├─ Visibility: ❌ Hidden from homepage (verified)
├─ UI Change: Badge changes to "VERIFIED"
└─ Action Available: "Mark as Returned" or "Revert to Claimed"

                              │
                              ▼
Step 4: Item Handed Over
├─ User clicks "Mark as Returned"
├─ Status: VERIFIED → RESOLVED
├─ Visibility: ❌ Hidden from homepage (complete!)
├─ UI Change: Badge changes to "RESOLVED"
├─ resolvedAt: Timestamp recorded
└─ Action Available: None (FINAL - immutable)
```

---

## 🔒 Status Transition Rules (Immutability)

### **Valid Transitions Matrix**

| From Status | Can Go To | Cannot Go To |
|-------------|-----------|--------------|
| `OPEN` | CLAIMED, CANCELLED | VERIFIED, RESOLVED |
| `CLAIMED` | OPEN, VERIFIED, CANCELLED | RESOLVED |
| `VERIFIED` | CLAIMED, RESOLVED | OPEN, CANCELLED |
| `RESOLVED` | ❌ **NONE** (Final) | Any |
| `CANCELLED` | ❌ **NONE** (Final) | Any |

### **Transition Validation Logic**

```tsx
const VALID_TRANSITIONS = {
    OPEN: ['CLAIMED', 'CANCELLED'],
    CLAIMED: ['OPEN', 'VERIFIED', 'CANCELLED'],
    VERIFIED: ['CLAIMED', 'RESOLVED'],
    RESOLVED: [],  // Final state - immutable
    CANCELLED: []  // Final state - immutable
};

function canTransition(currentStatus: string, newStatus: string): boolean {
    return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}
```

---

## 🎨 UI Changes for Each Status

### **Homepage (ItemCard)**

| Status | Badge Color | Badge Text | Visibility | Additional Info |
|--------|-------------|------------|------------|-----------------|
| OPEN | `bg-blue-100 text-blue-700` | "ACTIVE" | ✅ Show | Default state |
| CLAIMED | `bg-amber-100 text-amber-700` | "CLAIMED" | ✅ Show | Still active |
| VERIFIED | N/A | N/A | ❌ Hidden | In verification |
| RESOLVED | N/A | N/A | ❌ Hidden | Completed |
| CANCELLED | N/A | N/A | ❌ Hidden | Removed |

### **Dashboard (DashboardItemCard)**

| Status | Badge Color | Badge Text | Actions Available |
|--------|-------------|------------|-------------------|
| OPEN | `bg-blue-100 text-blue-700` | "ACTIVE" | [Claim] [Cancel] |
| CLAIMED | `bg-amber-100 text-amber-700` | "CLAIMED" | [Verify] [Revert] [Cancel] |
| VERIFIED | `bg-purple-100 text-purple-700` | "VERIFIED" | [Resolve] [Revert] |
| RESOLVED | `bg-emerald-100 text-emerald-700` | "RESOLVED" | None (Final) |
| CANCELLED | `bg-slate-100 text-slate-700` | "CANCELLED" | None (Final) |

---

## 📋 Database Schema Changes

### **Update Post Model (Prisma)**

```prisma
model Post {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId 
  title       String
  description String
  type        String   // "LOST" or "FOUND"
  category    String   
  
  // ── STATUS FIELDS ──
  status      String   @default("OPEN")  
  // Possible values: OPEN, CLAIMED, VERIFIED, RESOLVED, CANCELLED
  
  claimedAt   DateTime?  // NEW: When it was marked as claimed
  verifiedAt  DateTime?  // NEW: When it was verified
  resolvedAt  DateTime?  // NEW: When it was resolved
  cancelledAt DateTime?  // NEW: When it was cancelled
  
  // ── RESOLUTION TRACKING ──
  resolutionNotes String?  // NEW: Optional notes on resolution
  // Example: "Returned to owner at main office"
  
  imageUrl    String?  
  time        String?
  studentName String?  
  rollNumber  String?  
  normalizedRollNumber String?
  aiTags      String[] 
  location    String
  email       String?  
  phone       String?
  date        String?  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String?   
  user        User?     @relation(fields: [userId], references: [id])
}
```

### **Migration Command**

```bash
npx prisma db push
```

---

## 🔧 API Implementation

### **New API Route: /api/user/update-status**

```tsx
// app/api/user/update-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Valid transitions
const VALID_TRANSITIONS = {
    OPEN: ['CLAIMED', 'CANCELLED'],
    CLAIMED: ['OPEN', 'VERIFIED', 'CANCELLED'],
    VERIFIED: ['CLAIMED', 'RESOLVED'],
    RESOLVED: [],  // Immutable
    CANCELLED: []  // Immutable
};

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { postId, newStatus, resolutionNotes } = await req.json();

        // ── VALIDATION ──
        if (!postId || !newStatus) {
            return NextResponse.json(
                { success: false, error: "Post ID and status required" },
                { status: 400 }
            );
        }

        // ── VERIFY POST EXISTS & OWNERSHIP ──
        const post = await db.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json(
                { success: false, error: "Post not found" },
                { status: 404 }
            );
        }

        if (post.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        // ── CHECK IF TRANSITION IS VALID ──
        const currentStatus = post.status;
        const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

        if (!allowedTransitions.includes(newStatus)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot transition from ${currentStatus} to ${newStatus}`,
                    allowedTransitions
                },
                { status: 400 }
            );
        }

        // ── PREPARE UPDATE DATA ──
        const updateData: any = {
            status: newStatus,
        };

        // Set timestamps based on status
        if (newStatus === 'CLAIMED') {
            updateData.claimedAt = new Date();
        } else if (newStatus === 'VERIFIED') {
            updateData.verifiedAt = new Date();
        } else if (newStatus === 'RESOLVED') {
            updateData.resolvedAt = new Date();
            if (resolutionNotes) {
                updateData.resolutionNotes = resolutionNotes;
            }
        } else if (newStatus === 'CANCELLED') {
            updateData.cancelledAt = new Date();
        }

        // ── UPDATE DATABASE ──
        await db.post.update({
            where: { id: postId },
            data: updateData,
        });

        // ── REVALIDATE CACHE ──
        revalidatePath("/");
        revalidatePath("/dashboard");

        return NextResponse.json({
            success: true,
            message: `Status updated to ${newStatus}`,
            newStatus,
        });
        
    } catch (error) {
        console.error("Update status error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update status" },
            { status: 500 }
        );
    }
}
```

---

## 🎯 Frontend Implementation

### **Dashboard Status Update Handler**

```tsx
// app/dashboard/page.tsx

const handleStatusUpdate = async (
    postId: string, 
    newStatus: string,
    resolutionNotes?: string
) => {
    toast.promise(
        new Promise(async (resolve, reject) => {
            setActionLoading(postId);
            
            try {
                const response = await fetch("/api/user/update-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ postId, newStatus, resolutionNotes }),
                });

                const result = await response.json();

                if (result.success) {
                    // Update local state
                    setItems(
                        items.map((item) =>
                            item.id === postId 
                                ? { 
                                    ...item, 
                                    status: newStatus,
                                    ...(newStatus === 'RESOLVED' && { resolvedAt: new Date().toISOString() })
                                  } 
                                : item
                        )
                    );
                    resolve(result);
                } else {
                    reject(new Error(result.error || "Failed to update status"));
                }
            } catch (error) {
                console.error("Status update error:", error);
                reject(error);
            } finally {
                setActionLoading(null);
            }
        }),
        {
            loading: `Updating status to ${newStatus}...`,
            success: `Status updated successfully!`,
            error: "Failed to update status",
        }
    );
};
```

### **Dashboard Item Card - Dynamic Buttons**

```tsx
// Dashboard Item Card Actions
function DashboardItemCard({ item, onStatusUpdate, ... }) {
    const status = item.status;

    return (
        <Card>
            {/* ... item display ... */}
            
            {/* Status Badge */}
            <Badge className={getStatusBadgeClass(status)}>
                {status}
            </Badge>

            {/* Action Buttons - Dynamic based on status */}
            <div className="flex gap-2">
                <Link href={`/items/${item.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" /> View
                    </Button>
                </Link>

                {/* OPEN status actions */}
                {status === 'OPEN' && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-200 text-amber-700"
                            onClick={() => onStatusUpdate(item.id, 'CLAIMED')}
                        >
                            <Tag className="h-4 w-4" /> Mark as Claimed
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-600"
                            onClick={() => onStatusUpdate(item.id, 'CANCELLED')}
                        >
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                    </>
                )}

                {/* CLAIMED status actions */}
                {status === 'CLAIMED' && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-200 text-purple-700"
                            onClick={() => onStatusUpdate(item.id, 'VERIFIED')}
                        >
                            <CheckCircle className="h-4 w-4" /> Verify
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => onStatusUpdate(item.id, 'OPEN')}
                        >
                            <RotateCcw className="h-4 w-4" /> Revert
                        </Button>
                    </>
                )}

                {/* VERIFIED status actions */}
                {status === 'VERIFIED' && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-200 text-emerald-700"
                            onClick={() => openResolveDialog(item.id)}
                        >
                            <CheckCircle2 className="h-4 w-4" /> Resolve
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600"
                            onClick={() => onStatusUpdate(item.id, 'CLAIMED')}
                        >
                            <RotateCcw className="h-4 w-4" /> Back to Claimed
                        </Button>
                    </>
                )}

                {/* RESOLVED/CANCELLED - No actions (immutable) */}
                {(status === 'RESOLVED' || status === 'CANCELLED') && (
                    <span className="text-sm text-slate-500 italic">
                        {status === 'RESOLVED' 
                            ? `Resolved on ${new Date(item.resolvedAt).toLocaleDateString()}`
                            : 'Cancelled'
                        }
                    </span>
                )}

                {/* Delete button (always available except RESOLVED) */}
                {status !== 'RESOLVED' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => onDelete(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </Card>
    );
}

// Helper function for status badge styling
function getStatusBadgeClass(status: string): string {
    const classes = {
        OPEN: "bg-blue-100 text-blue-700 border-blue-200",
        CLAIMED: "bg-amber-100 text-amber-700 border-amber-200",
        VERIFIED: "bg-purple-100 text-purple-700 border-purple-200",
        RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return classes[status] || "bg-slate-100 text-slate-700";
}
```

---

## 🏠 Homepage Filtering

### **Updated getPosts() with Status Filter**

```tsx
// actions/post.actions.ts

export async function getPosts(
    searchQuery: string,
    filterType: string,
    page: number = 1,
    limit: number = 12
) {
    try {
        const skip = (page - 1) * limit;

        // ── ONLY SHOW ACTIVE ITEMS ON HOMEPAGE ──
        const whereClause = {
            status: {
                in: ['OPEN', 'CLAIMED']  // ← Only show active items
            },
            ...(filterType !== "all" && { type: filterType.toUpperCase() }),
            ...(searchQuery && {
                OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { description: { contains: searchQuery, mode: "insensitive" } },
                    { studentName: { contains: searchQuery, mode: "insensitive" } },
                    { rollNumber: { contains: searchQuery, mode: "insensitive" } },
                    { normalizedRollNumber: { contains: normalizeRollNumber(searchQuery) } },
                    { aiTags: { has: searchQuery } }
                ]
            })
        };

        const total = await db.post.count({ where: whereClause });

        const posts = await db.post.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        return {
            success: true,
            data: posts,
            metadata: {
                total,
                page,
                limit,
                hasMore: skip + posts.length < total
            }
        };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { success: false, error: "Failed to fetch posts" };
    }
}
```

---

## 📊 Updated Stats Logic

```tsx
// actions/stats.actions.ts

export async function getStats() {
    try {
        // Total posts (all statuses)
        const totalPosts = await db.post.count();

        // Resolved items (successfully returned)
        const resolvedItems = await db.post.count({
            where: { status: "RESOLVED" }
        });

        // Active listings (OPEN + CLAIMED only)
        const activeListings = await db.post.count({
            where: {
                status: {
                    in: ['OPEN', 'CLAIMED']
                }
            }
        });

        // Total users
        const totalUsers = await db.user.count();

        return {
            success: true,
            data: {
                itemsReturned: resolvedItems,
                activeListings: activeListings,
                communityMembers: totalUsers,
                totalPosts: totalPosts,
            }
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            success: false,
            error: "Failed to fetch stats",
            data: {
                itemsReturned: 0,
                activeListings: 0,
                communityMembers: 0,
                totalPosts: 0,
            }
        };
    }
}
```

---

## 🎨 Resolution Dialog (Optional - for VERIFIED → RESOLVED)

```tsx
// components/ResolveDialog.tsx

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ResolveDialog({ 
    isOpen, 
    onClose, 
    onResolve 
}: {
    isOpen: boolean;
    onClose: () => void;
    onResolve: (notes: string) => void;
}) {
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        onResolve(notes);
        setNotes("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark as Resolved</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="notes">Resolution Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="e.g., Returned to owner at main office on 2/5/2026"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="mt-2"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Add any notes about how/when/where the item was returned
                        </p>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleSubmit}
                        >
                            Mark as Resolved
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
```

---

## 📋 Implementation Checklist

### **Phase 1: Database & Backend**
- [ ] Update Prisma schema with new fields
- [ ] Run database migration
- [ ] Create `/api/user/update-status` route
- [ ] Implement status transition validation
- [ ] Add timestamp tracking (claimedAt, verifiedAt, etc.)

### **Phase 2: Homepage Filtering**
- [ ] Update `getPosts()` to filter by status
- [ ] Update stats to count only OPEN+CLAIMED as active

### **Phase 3: Dashboard UI**
- [ ] Update status badge colors
- [ ] Implement dynamic action buttons
- [ ] Add status update handler
- [ ] Create resolution dialog (optional)
- [ ] Add revert functionality

### **Phase 4: Testing**
- [ ] Test each status transition
- [ ] Test immutability (can't update RESOLVED)
- [ ] Test homepage filtering
- [ ] Test stats accuracy
- [ ] Test validation errors

---

## 🎯 Summary of Changes

### **What Will Happen:**

**Homepage:**
- ✅ Shows only OPEN and CLAIMED items
- ❌ Hides VERIFIED, RESOLVED, CANCELLED items
- Clean, active feed

**Dashboard:**
- ✅ Shows ALL user's items (all statuses)
- Dynamic buttons based on status
- Can't update RESOLVED/CANCELLED (immutable)
- Can revert CLAIMED → OPEN (if wrong claim)
- Can revert VERIFIED → CLAIMED (if wrong verification)

**Status Flow:**
```
OPEN → CLAIMED → VERIFIED → RESOLVED (immutable)
  ↓       ↓         ↓
CANCELLED (immutable)
```

**Timestamps Tracked:**
- `claimedAt` - When claimed
- `verifiedAt` - When verified
- `resolvedAt` - When resolved
- `cancelledAt` - When cancelled

---

## ❓ **Questions for Approval**

1. **Should I implement this full status system?**
   - Multiple statuses (OPEN, CLAIMED, VERIFIED, RESOLVED, CANCELLED)
   - Proper transitions and immutability
   - Homepage filtering

2. **Do you want the Resolution Notes feature?**
   - Optional notes when marking as RESOLVED
   - Shows on dashboard
   - Helps with record keeping

3. **Should CLAIMED items show on homepage?**
   - Option A: YES (still active, claim might be wrong)
   - Option B: NO (hide once claimed)
   - **My recommendation: YES** (keep visible until verified)

4. **Is the revert functionality important?**
   - Can go back if claim was false
   - CLAIMED → OPEN
   - VERIFIED → CLAIMED

---

**Please review this plan and let me know if you approve! I'll implement it step by step. 🚀**

