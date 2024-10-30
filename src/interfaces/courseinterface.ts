export interface courseInterface {
  id?: string;
  title: string;
  description: Text;
  content_type: "text" | "video" | "image";
  created_by: number;
  is_active: boolean;
}
