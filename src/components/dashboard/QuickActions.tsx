import { BarChart2, FolderPlus, Plus, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const actions = [
  { label: "Add Client", icon: Plus },
  { label: "New Project", icon: FolderPlus },
  { label: "Add Developer", icon: UserPlus },
  { label: "View Reports", icon: BarChart2 },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-24 text-center"
            >
              <action.icon className="h-5 w-5 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
