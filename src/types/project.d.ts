type Project = {
  id: number;
  name: string;
  clientId: number;
  status: "Active" | "Planning" | "Completed"; // you can adjust enum values as needed
  startDate: string;
  endDate: string;
  progress: number;
  developerIds: number[];
};
