// Mock data for SMIU Lost & Found Portal

export type ItemType = "lost" | "found";
export type ItemStatus = "active" | "claimed" | "resolved";

export interface Item {
    id: string;
    type: ItemType;
    title: string;
    description: string;
    category: string;
    location: string;
    date: string;
    image: string;
    reporterName: string;
    reporterAvatar: string;
    status: ItemStatus;
    contactEmail?: string;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
}

export interface Location {
    id: string;
    name: string;
}

// Categories for items
export const categories: Category[] = [
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "books", name: "Books & Notes", icon: "📚" },
    { id: "id-cards", name: "ID Cards", icon: "🪪" },
    { id: "keys", name: "Keys", icon: "🔑" },
    { id: "bags", name: "Bags & Wallets", icon: "👜" },
    { id: "clothing", name: "Clothing", icon: "👕" },
    { id: "accessories", name: "Accessories", icon: "⌚" },
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "other", name: "Other", icon: "📦" },
];

// Locations around SMIU campus
export const locations: Location[] = [
    { id: "library", name: "Central Library" },
    { id: "cafeteria", name: "Cafeteria" },
    { id: "main-building", name: "Main Building" },
    { id: "cs-department", name: "CS Department" },
    { id: "business-dept", name: "Business Department" },
    { id: "auditorium", name: "Auditorium" },
    { id: "sports-complex", name: "Sports Complex" },
    { id: "parking", name: "Parking Area" },
    { id: "admin-block", name: "Admin Block" },
    { id: "ground", name: "University Ground" },
];

// Mock items data
export const mockItems: Item[] = [
    {
        id: "1",
        type: "lost",
        title: "MacBook Pro Charger",
        description: "White 67W USB-C charger for MacBook Pro. Left in the library computer lab around 2 PM.",
        category: "electronics",
        location: "Central Library",
        date: "2026-01-20",
        image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
        reporterName: "Ahmed Khan",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
        status: "active",
        contactEmail: "ahmed.khan@smiu.edu.pk",
    },
    {
        id: "2",
        type: "found",
        title: "Student ID Card",
        description: "Found a student ID card belonging to the Computer Science department near the cafeteria.",
        category: "id-cards",
        location: "Cafeteria",
        date: "2026-01-19",
        image: "https://images.unsplash.com/photo-1578670812003-60745e2c2ea9?w=400&h=300&fit=crop",
        reporterName: "Sara Ali",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
        status: "active",
    },
    {
        id: "3",
        type: "lost",
        title: "Blue Notebook with Class Notes",
        description: "A5 blue spiral notebook containing notes for Advanced Database Systems. Very important for upcoming exams!",
        category: "books",
        location: "CS Department",
        date: "2026-01-18",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop",
        reporterName: "Fatima Hassan",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
        status: "active",
    },
    {
        id: "4",
        type: "found",
        title: "Black Leather Wallet",
        description: "Found a black leather wallet with some cash and cards near the main entrance. Please claim with ID verification.",
        category: "bags",
        location: "Main Building",
        date: "2026-01-18",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop",
        reporterName: "Usman Malik",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman",
        status: "active",
    },
    {
        id: "5",
        type: "lost",
        title: "Wireless Earbuds - Samsung Galaxy",
        description: "White Samsung Galaxy Buds 2 Pro in charging case. Lost somewhere between library and cafeteria.",
        category: "electronics",
        location: "Central Library",
        date: "2026-01-17",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop",
        reporterName: "Zainab Qureshi",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab",
        status: "active",
    },
    {
        id: "6",
        type: "found",
        title: "Car Keys with Honda Logo",
        description: "Found car keys with a Honda logo near the parking area. Has a blue keychain attached.",
        category: "keys",
        location: "Parking Area",
        date: "2026-01-17",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        reporterName: "Ali Raza",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
        status: "claimed",
    },
    {
        id: "7",
        type: "lost",
        title: "Silver Watch - Casio",
        description: "Silver Casio watch with metal band. Sentimental value. Lost in the auditorium during the morning assembly.",
        category: "accessories",
        location: "Auditorium",
        date: "2026-01-16",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
        reporterName: "Hassan Sheikh",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
        status: "active",
    },
    {
        id: "8",
        type: "found",
        title: "USB Flash Drive 32GB",
        description: "Found a Kingston 32GB USB flash drive in the computer lab. Contains some assignment files.",
        category: "electronics",
        location: "CS Department",
        date: "2026-01-16",
        image: "https://images.unsplash.com/photo-1618410320928-25228d811631?w=400&h=300&fit=crop",
        reporterName: "Ayesha Siddiqui",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha",
        status: "resolved",
    },
    {
        id: "9",
        type: "lost",
        title: "Reading Glasses - Black Frame",
        description: "Black rectangular reading glasses in a brown leather case. Need them desperately for studying!",
        category: "accessories",
        location: "Central Library",
        date: "2026-01-15",
        image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop",
        reporterName: "Bilal Ahmed",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal",
        status: "active",
    },
    {
        id: "10",
        type: "found",
        title: "Water Bottle - Blue Hydroflask",
        description: "Found a blue Hydroflask water bottle at the sports complex. Has some stickers on it.",
        category: "other",
        location: "Sports Complex",
        date: "2026-01-15",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
        reporterName: "Imran Khan",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Imran",
        status: "active",
    },
    {
        id: "11",
        type: "lost",
        title: "Graphing Calculator - TI-84",
        description: "Texas Instruments TI-84 Plus calculator. Has my name written on the back with a marker.",
        category: "electronics",
        location: "Business Department",
        date: "2026-01-14",
        image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=300&fit=crop",
        reporterName: "Nadia Patel",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia",
        status: "active",
    },
    {
        id: "12",
        type: "found",
        title: "Umbrella - Black Automatic",
        description: "Large black automatic umbrella found near the admin block entrance after the rain.",
        category: "other",
        location: "Admin Block",
        date: "2026-01-14",
        image: "https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400&h=300&fit=crop",
        reporterName: "Tariq Jameel",
        reporterAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tariq",
        status: "active",
    },
];

// Statistics for the dashboard
export const stats = {
    itemsReturned: 124,
    activeListings: mockItems.filter((item) => item.status === "active").length,
    communityMembers: 2847,
};

// Helper function to get items by type
export function getItemsByType(type: ItemType): Item[] {
    return mockItems.filter((item) => item.type === type);
}

// Helper function to get active items only
export function getActiveItems(): Item[] {
    return mockItems.filter((item) => item.status === "active");
}

// Helper function to search items
export function searchItems(query: string): Item[] {
    const lowerQuery = query.toLowerCase();
    return mockItems.filter(
        (item) =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.location.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
    );
}
