import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";

interface Activity {
  id: string;
  softwareName: string; 
  description: string;
  actionType: "added" | "updated" | "removed";
  createdAt: string;
};

interface SummarySectionProps{
    activities: Activity[]
}

const iconMap = {
  added: <ArrowUpCircle className="text-green-500 w-4 h-4" />,
  updated: <ArrowDownCircle className="text-yellow-500 w-4 h-4" />,
  removed: <Trash2 className="text-red-500 w-4 h-4" />,
};

export const SummarySection: React.FC<SummarySectionProps> = ({ activities}) => {
  if (activities.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>No Activity Logs Yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Your recent activity will show up here after you log it.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[300px]">
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {iconMap[activity.actionType]}
                  <div>
                    <p className="text-sm font-medium">{activity.softwareName}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(activity.createdAt).toLocaleDateString("en-KE", {
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
