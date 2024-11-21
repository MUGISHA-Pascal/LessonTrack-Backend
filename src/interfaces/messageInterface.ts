export interface messageInterface {
  id?: string;
  sender: string;
  message: string;
  receiver: string;
  seen?: boolean;
  edited?: boolean;
}
