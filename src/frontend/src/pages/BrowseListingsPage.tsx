import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import React, { useState } from "react";
import ListingCard from "../components/ListingCard";

// Mock data - will be replaced with actual backend data
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "iPhone 13 Pro Max 256GB",
    description:
      "Excellent condition, barely used. Comes with original box and accessories.",
    price: 899,
    category: "Electronics",
    location: "New York, NY",
    imageUrl: "/assets/generated/education-support.dim_800x500.jpg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    seller: { name: "John Doe", contact: "john@example.com" },
  },
  {
    id: "2",
    title: "Modern Sofa Set",
    description: "Beautiful 3-seater sofa in great condition. Moving sale!",
    price: 450,
    category: "Furniture",
    location: "Los Angeles, CA",
    imageUrl: "/assets/generated/community-impact.dim_600x400.jpg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    seller: { name: "Jane Smith", contact: "+1234567890" },
  },
  {
    id: "3",
    title: "Mountain Bike - Trek X-Caliber",
    description:
      "Well-maintained mountain bike, perfect for trails. New tires installed.",
    price: 650,
    category: "Sports",
    location: "Austin, TX",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    seller: { name: "Mike Johnson", contact: "mike@example.com" },
  },
];

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Furniture",
  "Vehicles",
  "Real Estate",
  "Jobs",
  "Services",
  "Fashion",
  "Books",
  "Sports",
  "Other",
];

export default function BrowseListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [locationFilter, setLocationFilter] = useState("");

  // Filter listings based on search and filters
  const filteredListings = MOCK_LISTINGS.filter((listing) => {
    const matchesSearch =
      searchQuery === "" ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      listing.category === selectedCategory;

    const matchesLocation =
      locationFilter === "" ||
      listing.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b border-border/40">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Find Great Deals Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Buy and sell locally with tradition - your trusted marketplace
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Listings */}
      <section className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-[200px]"
          />
          {(selectedCategory !== "All Categories" || locationFilter) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedCategory("All Categories");
                setLocationFilter("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredListings.length}{" "}
            {filteredListings.length === 1 ? "listing" : "listings"} found
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setLocationFilter("");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
