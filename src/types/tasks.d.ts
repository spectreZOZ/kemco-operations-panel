type Task = {
  id: number;
  projectId: number;
  developerIds: number[];
  title: string;
  status: "To Do" | "In Progress" | "Done";
  createdAt: string;
};
