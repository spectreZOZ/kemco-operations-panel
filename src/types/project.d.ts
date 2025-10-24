type Project = {
  id: string;
  name: string;
  clientId: string;
  status: "active" | "on-hold" | "done"; // you can adjust enum values as needed
  startDate: string;
  endDate: string;
  progress: number;
  tasks?: Task[];
  developers: string[];
};
