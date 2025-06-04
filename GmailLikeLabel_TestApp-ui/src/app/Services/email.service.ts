import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../Models/email.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = 'https://localhost:7033/api/email';

  constructor(private http: HttpClient) {}

  getAllEmails(): Observable<Email[]> {
    return this.http.get<Email[]>(this.apiUrl);
  }

  createEmail(email: Email): Observable<Email> {
    return this.http.post<Email>(this.apiUrl, email);
  }

  assignLabelsToEmail(emailId: number, labelIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${emailId}/labels`, labelIds);
  }

  removeLabelFromEmail(emailId: number, labelId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${emailId}/labels/${labelId}`);
  }
}
