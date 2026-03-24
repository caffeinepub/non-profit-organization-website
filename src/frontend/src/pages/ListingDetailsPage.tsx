import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import React from "react";

// Mock data - will be replaced with actual backend data
const MOCK_LISTINGS: Record<string, any> = {
  "1": {
    id: "1",
    title: "iPhone 13 Pro Max 256GB",
    description:
      "Excellent condition, barely used. Comes with original box and accessories. Battery health at 98%. No scratches or dents. Includes charging cable and original earphones.",
    price: 899,
    category: "Electronics",
    location: "New York, NY",
    imageUrl: "/assets/generated/education-support.dim_800x500.jpg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    seller: { name: "John Doe", contact: "john@example.com" },
  },
  "2": {
    id: "2",
    title: "Modern Sofa Set",
    description:
      "Beautiful 3-seater sofa in great condition. Moving sale! Comfortable cushions, sturdy frame. Pet-free and smoke-free home.",
    price: 450,
    category: "Furniture",
    location: "Los Angeles, CA",
    imageUrl: "/assets/generated/community-impact.dim_600x400.jpg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    seller: { name: "Jane Smith", contact: "+1234567890" },
  },
  "3": {
    id: "3",
    title: "Mountain Bike - Trek X-Caliber",
    description:
      "Well-maintained mountain bike, perfect for trails. New tires installed. Shimano gears, hydraulic disc brakes. Great for weekend adventures!",
    price: 650,
    category: "Sports",
    location: "Austin, TX",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    seller: { name: "Mike Johnson", contact: "mike@example.com" },
  },
};

export default function ListingDetailsPage() {
  const { listingId } = useParams({ from: "/listing/$listingId" });
  const navigate = useNavigate();

  const listing = MOCK_LISTINGS[listingId];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This listing may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate({ to: "/" })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Posted {formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {listing.category}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <p className="text-4xl font-bold text-primary">
                    {formatPrice(listing.price)}
                  </p>
                </div>
                <Button className="w-full" size="lg">
                  Contact Seller
                </Button>
              </CardContent>
            </Card>

            {/* Seller Info Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Seller Information</h3>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{listing.seller.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {listing.seller.contact.includes("@") ? (
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium break-all">
                        {listing.seller.contact}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips Card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold text-sm">Safety Tips</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Check the item before payment</li>
                  <li>• Pay only after collecting item</li>
                  <li>• Don't share financial info</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
