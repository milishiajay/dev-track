export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'planned' | 'in-progress' | 'completed';
  createdAt: string;
}
