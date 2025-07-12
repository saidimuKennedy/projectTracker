"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Comment {
  id: string;
  author: string | null;
  comment: string;
  createdAt: string;
}

export function ReviewsSection({ softwareId }: { softwareId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      if (!softwareId || softwareId === "undefined") {
        console.error("Invalid softwareId:", softwareId);
        return;
      }

      const res = await fetch(`/api/comments/${softwareId}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    if (!softwareId || softwareId === "undefined") {
      setError("Invalid software ID");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/comments/${softwareId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
          author: author.trim()||"Anonymous",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit comment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (softwareId && softwareId !== "undefined") {
      fetchComments();
    }
  }, [softwareId]);

  if (!softwareId || softwareId === "undefined") {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Invalid software ID</p>
        </CardContent>
      </Card>
    );
  }

   return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          ) : (
            comments.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="font-semibold">{review.author || "Anonymous"}</span>
                  <span className="text-xs text-muted-foreground">
                    • {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-white mt-2">{review.comment}</p>
              </div>
            ))
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name (optional)
            </label>
            <input
              type="text"
              placeholder="Enter your name or leave blank for Anonymous"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              placeholder="Write your review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !newComment.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}