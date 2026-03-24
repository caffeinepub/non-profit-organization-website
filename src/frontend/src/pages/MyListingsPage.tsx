import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "../components/ConfirmDialog";
import EditListingDialog from "../components/EditListingDialog";
import RequireAuth from "../components/RequireAuth";

const MOCK_USER_LISTINGS = [
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
];

export default function MyListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(MOCK_USER_LISTINGS);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null,
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const diffInDays = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSaveEdit = async (updatedListing: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setListings((prev) =>
        prev.map((l) => (l.id === updatedListing.id ? updatedListing : l)),
      );
      toast.success("Listing updated successfully!");
    } catch (error) {
      console.error("Failed to update listing:", error);
      toast.error("Failed to update listing. Please try again.");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deletingListingId) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setListings((prev) => prev.filter((l) => l.id !== deletingListingId));
      toast.success("Listing deleted successfully!");
      setDeletingListingId(null);
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error("Failed to delete listing. Please try again.");
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">Manage your posted items</p>
            </div>
            <Button onClick={() => navigate({ to: "/post" })}>
              <Plus className="mr-2 h-4 w-4" />
              Post New Listing
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start selling by posting your first listing
                </p>
                <Button onClick={() => navigate({ to: "/post" })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <button
                    type="button"
                    className="aspect-video bg-muted relative overflow-hidden w-full"
                    onClick={() =>
                      navigate({
                        to: "/listing/$listingId",
                        params: { listingId: listing.id },
                      })
                    }
                  >
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
                  </button>
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
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingListing(listing)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDeletingListingId(listing.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingListing && (
        <EditListingDialog
          open={!!editingListing}
          onOpenChange={(open) => !open && setEditingListing(null)}
          listing={editingListing}
          onSave={handleSaveEdit}
        />
      )}

      <ConfirmDialog
        open={!!deletingListingId}
        onOpenChange={(open) => !open && setDeletingListingId(null)}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </RequireAuth>
  );
}
