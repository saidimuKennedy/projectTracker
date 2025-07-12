"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { softwareInfoSchema, SoftwareInfo } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function SoftwareInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SoftwareInfo>({
    resolver: zodResolver(softwareInfoSchema),
    defaultValues: {
      name: "",
      version: "",
      stack: "",
      developer: "",
      description: "",
    },
  });

  const { reset } = form;

  async function onSubmit(data: SoftwareInfo) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/software", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("API Error:", errorMsg);
        throw new Error("Failed to create software");
      }

      toast.success('Form successfully submitted!')
      reset();

      return await res.json();
    } catch (err) {
      console.error("Fetch failed:", err);
      throw err;
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Software Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sato CMS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. v1.0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Next.js, Tailwind, Supabase..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="developer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Developer</FormLabel>
                  <FormControl>
                    <Input placeholder="Ken" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief overview of the project..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Project Info
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
