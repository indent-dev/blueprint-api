export interface Project {
  name: string;
  description: string;
}

export type ProjectRequest = Omit<Project, "isDeleted">;
