import { EmailLabel } from "./emailLabel.model";

export interface Email {
  id: number;
  subject: string;
  sender: string;
  date?: string;
  emailLabels: EmailLabel[];
}
