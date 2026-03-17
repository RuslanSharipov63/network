export type ServiceCard = {
  id: number;
  userId: number | string;
  title: string;
  description: string;
  needed: string;
  created_at: Date | null;
  status: string;
  updated_at: Date | null;
};