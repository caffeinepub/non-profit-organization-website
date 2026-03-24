import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import React from "react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrl?: string;
  createdAt: number;
  seller: {
    name: string;
    contact: string;
  };
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={() =>
        navigate({
          to: "/listing/$listingId",
          params: { listingId: listing.id },
        })
      }
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
          {listing.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-2xl font-bold text-primary mb-2">
          {formatPrice(listing.price)}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {listing.description}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{listing.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatDate(listing.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
