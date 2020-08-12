export interface Project {
  isDeleted: boolean
  name: string
  description: string
}

export type ProjectRequest = Omit<Project, 'isDeleted'>
