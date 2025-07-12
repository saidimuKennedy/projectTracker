"use client";
import React, { useEffect, useState } from "react";
import { ActivityLogForm } from "@/components/content/ActivityLogForm";
import { ReviewsSection } from "@/components/content/ReviewSection";
import SoftwareInfoForm from "@/components/content/SoftwareInfoForm";
import { SummarySection } from "@/components/content/SummarySection";
import { Hammer, Plus, Activity, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Activity {
  id: string;
  softwareName: string;
  description: string;
  actionType: "added" | "updated" | "removed";
  createdAt: string;
}

interface Software {
  id: string;
  name: string;
  version: string;
  developer: string;
  stack: string;
}

export default function Home() {
  const [recentLogs, setRecentLogs] = useState<Activity[]>([]);
  const [software, setSoftware] = useState<Software[]>([]);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "new-project" | "log-activity" | "reviews"
  >("overview");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/activity/recent");
        const data = await res.json();
        const transformed = data.map((log: any) => ({
          id: log.id,
          softwareName: log.software.name,
          description: log.description,
          actionType: log.actionType,
          createdAt: log.createdAt,
        }));
        setRecentLogs(transformed);
      } catch (err) {
        console.error("Failed to fetch recent logs", err);
      }
    };

    const fetchSoftware = async () => {
      try {
        const res = await fetch("/api/software");
        const data = await res.json();
        setSoftware(data);
      } catch (err) {
        console.error("Failed to fetch software", err);
      }
    };

    fetchLogs();
    fetchSoftware();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "new-project", label: "New Project", icon: Plus },
    { id: "log-activity", label: "Log Activity", icon: Activity },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hammer className="w-8 h-8 text-foreground" />
              <h1 className="text-3xl font-bold text-foreground">
                Dev Tracker
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {software.length} Projects • {recentLogs.length} Activities
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 space-y-2">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Projects
                    </span>
                    <span className="font-medium">{software.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recent Activities
                    </span>
                    <span className="font-medium">{recentLogs.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-medium">
                      {
                        recentLogs.filter(
                          (log) =>
                            new Date(log.createdAt) >
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                  <p className="text-muted-foreground mb-6">
                    All the work you've been down at is here.
                  </p>
                </div>

                {/* Project Cards */}
                {software.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Your Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {software.map((proj) => (
                        <Card
                          key={proj.id}
                          className="hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <CardHeader>
                            <CardTitle className="text-base">
                              {proj.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {proj.version}
                            </p>
                          </CardHeader>
                          <CardContent className="flex flex-col flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              by {proj.developer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {proj.stack}
                            </p>

                            <div className="mt-auto self-end">
                              <Button
                                onClick={async () => {
                                  try {
                                    await fetch(`/api/software/${proj.id}`, {
                                      method: "DELETE",
                                    });
                                    toast.success("Software deleted!");
                                    // Optionally refetch or remove from local state
                                  } catch (err) {
                                    toast.error("Failed to delete.");
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <SummarySection activities={recentLogs} />
              </div>
            )}

            {activeTab === "new-project" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Create New Project
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Add a new software project to track its development
                    progress.
                  </p>
                </div>
                <SoftwareInfoForm />
              </div>
            )}

            {activeTab === "log-activity" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Log Development Activity
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Record changes, updates, and progress on your projects.
                  </p>
                </div>
                <ActivityLogForm />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Project Reviews
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    View and manage feedback for your projects.
                  </p>
                </div>

                {/* Software Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={selectedSoftwareId}
                      onChange={(e) => setSelectedSoftwareId(e.target.value)}
                      className="w-full p-3 border border-input rounded-md bg-background"
                    >
                      <option value="">
                        -- Select a project to view reviews --
                      </option>
                      {software.map((sw) => (
                        <option key={sw.id} value={sw.id}>
                          {sw.name} {sw.version}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>

                {/* Reviews Section */}
                {selectedSoftwareId && (
                  <ReviewsSection softwareId={selectedSoftwareId} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
