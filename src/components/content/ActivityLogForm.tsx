"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const logSchema = z.object({
  softwareId: z.string().min(1),
  description: z.string().min(3),
  actionType: z.enum(["added", "updated", "removed"]),
});

type LogFormData = z.infer<typeof logSchema>;

export function ActivityLogForm() {
  const [softwares, setSoftwares] = useState<{ id: string; name: string }[]>(
    []
  );

  const form = useForm<LogFormData>({
    resolver: zodResolver(logSchema), defaultValues: {
    softwareId: "",
    description: "",
    actionType: "added", 
  },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    const fetchSoftware = async () => {
      const res = await fetch("/api/software");
      const data = await res.json();
      setSoftwares(data);
    };
    fetchSoftware();
  }, []);

  const onSubmit = async (values: LogFormData) => {
    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to create log");

      toast.success("Log entry saved!");
      reset();
    } catch (err) {
      toast.error("Error saving log entry.");
    }
  };

  return (
    <Card className="mb-6">
  <CardHeader>
    <CardTitle>Log Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={control}
          name="softwareId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Software</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {softwares.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="description"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="E.g., Updated login feature"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="actionType"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select change type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="added">Added</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Log Activity
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>
  );
}
