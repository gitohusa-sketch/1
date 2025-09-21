
export enum MessageSender {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
}
