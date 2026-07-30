export type ServiceCard = {
  id: number;
  userid: number | string;
  title: string;
  description: string;
  needed: string;
  created_at: Date | null;
  status: string;
  updated_at: Date | null;
  
};


export type lastMessageDataType = { lastDate: Date, to_user_id: number, from_user_id: number | string }

/* типы для админпанели */

