export interface userInterface {
  id?: number;
  username: string;
  email: string;
  phone_number: string;
  password_hash: string;
  role: "lesson_seeker" | "admin" | "sub_admin";
  profilepicture?: string;
  nickname?: string;
  gender?: string;
  pin?: number;
  verified: string;
  activestatus?: string;
  special_offers?: boolean;
  sound?: boolean;
  vibrate?: boolean;
  general_notification?: boolean;
  promo_discount?: boolean;
  payment_options?: boolean;
  app_update?: boolean;
  new_service_available?: boolean;
  new_tips_available?: boolean;
  device_token?: string;
  paid?: boolean;
}
