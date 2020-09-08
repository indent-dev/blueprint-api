export interface Project {
  isDeleted: boolean
  name: string
  description: string
  slug: string
}

export type ProjectRequest = Omit<Project, 'isDeleted'>
