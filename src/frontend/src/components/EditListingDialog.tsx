import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

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

interface EditListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing;
  onSave: (listing: Listing) => Promise<void>;
}

const CATEGORIES = [
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

export default function EditListingDialog({
  open,
  onOpenChange,
  listing,
  onSave,
}: EditListingDialogProps) {
  const [formData, setFormData] = useState(listing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(listing);
  }, [listing]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.seller.name.trim()) {
      newErrors.sellerName = "Your name is required";
    }

    if (!formData.seller.contact.trim()) {
      newErrors.sellerContact = "Contact information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
          <DialogDescription>Update your listing details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., iPhone 13 Pro Max"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your item in detail..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., New York, NY"
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerName">Your Name *</Label>
            <Input
              id="sellerName"
              value={formData.seller.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seller: { ...formData.seller, name: e.target.value },
                })
              }
              placeholder="Your name"
            />
            {errors.sellerName && (
              <p className="text-sm text-destructive">{errors.sellerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerContact">Contact (Email or Phone) *</Label>
            <Input
              id="sellerContact"
              value={formData.seller.contact}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seller: { ...formData.seller, contact: e.target.value },
                })
              }
              placeholder="your@email.com or +1234567890"
            />
            {errors.sellerContact && (
              <p className="text-sm text-destructive">{errors.sellerContact}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
