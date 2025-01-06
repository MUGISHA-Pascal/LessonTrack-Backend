export interface courseInterface {
  id?: number;
  title: string;
  description: Text;
  content_type?: "text" | "video" | "image" | "mixed";
  category: string;
  created_by: number;
  file?: string;
  is_active?: boolean;
  profile_image?: string;
  module?: number[];
  userCount?: number;
  ratingAverage?: number;
  ratingCount?: number;
  video?: string;
  users?: number[];
}
