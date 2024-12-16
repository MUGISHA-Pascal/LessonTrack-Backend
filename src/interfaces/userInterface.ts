export interface userInterface {
  id?: number;
  username: string;
  email: string;
  phone_number: string;
  password_hash: string;
  role: "lesson_seeker" | "admin" | "sub_admin";
  profilePicture?: string;
  nickName?: string;
  gender?: string;
  pin?: number;
  verified:string
}
