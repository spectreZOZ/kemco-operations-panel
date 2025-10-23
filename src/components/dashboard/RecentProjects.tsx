import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

const projects = [
  {
    name: "E-commerce Platform",
    company: "TechCorp Inc.",
    color: "bg-blue-500",
    progress: 75,
  },
  {
    name: "Mobile Banking App",
    company: "FinanceFirst Bank",
    color: "bg-green-500",
    progress: 90,
  },
  {
    name: "Analytics Dashboard",
    company: "DataViz Solutions",
    color: "bg-yellow-500",
    progress: 45,
  },
];

export default function RecentProjects() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Projects</CardTitle>
        <a href="#" className="text-sm text-primary hover:underline">
          View All
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((p) => (
          <div key={p.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={p.color} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.company}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {p.progress}%
              </span>
            </div>
            <Progress value={p.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
