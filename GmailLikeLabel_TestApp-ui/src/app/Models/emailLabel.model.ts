import { Email } from "./email.model";
import { Label } from "./label.model";

export interface EmailLabel {
  emailId: number;
  email?: Email;
  labelId: number;
  label: Label;
}
