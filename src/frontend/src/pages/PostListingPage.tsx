import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import RequireAuth from "../components/RequireAuth";

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

export default function PostListingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    sellerName: "",
    sellerContact: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";
    const price = Number.parseFloat(formData.price);
    if (!formData.price || Number.isNaN(price) || price <= 0)
      newErrors.price = "Please enter a valid price greater than 0";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.sellerName.trim())
      newErrors.sellerName = "Your name is required";
    if (!formData.sellerContact.trim())
      newErrors.sellerContact = "Contact information is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Listing posted successfully!");
      navigate({ to: "/my-listings" });
    } catch (error) {
      console.error("Failed to post listing:", error);
      toast.error("Failed to post listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Post a New Listing</CardTitle>
                <CardDescription>
                  Fill in the details below to create your listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your item in detail..."
                      rows={6}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">
                          {errors.price}
                        </p>
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
                      {errors.category && (
                        <p className="text-sm text-destructive">
                          {errors.category}
                        </p>
                      )}
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
                      <p className="text-sm text-destructive">
                        {errors.location}
                      </p>
                    )}
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sellerName">Your Name *</Label>
                        <Input
                          id="sellerName"
                          value={formData.sellerName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sellerName: e.target.value,
                            })
                          }
                          placeholder="Your name"
                        />
                        {errors.sellerName && (
                          <p className="text-sm text-destructive">
                            {errors.sellerName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellerContact">
                          Contact (Email or Phone) *
                        </Label>
                        <Input
                          id="sellerContact"
                          value={formData.sellerContact}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              sellerContact: e.target.value,
                            })
                          }
                          placeholder="your@email.com or +1234567890"
                        />
                        {errors.sellerContact && (
                          <p className="text-sm text-destructive">
                            {errors.sellerContact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate({ to: "/" })}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Post Listing
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
