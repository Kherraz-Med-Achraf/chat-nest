export interface User {
  id: number;
  username: string;
  email: string;
  colorText: string;
  colorBg: string;
}

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  createdAt: string;
}
