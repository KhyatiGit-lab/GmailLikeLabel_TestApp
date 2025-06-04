import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label } from '../Models/label.model';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private baseUrl = 'https://localhost:7033/api/label';

  constructor(private http: HttpClient) {}

  getAllLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.baseUrl);
  }

  getLabelById(id: number): Observable<Label> {
    return this.http.get<Label>(`${this.baseUrl}/${id}`);
  }

  createLabel(label: Label): Observable<Label> {
    return this.http.post<Label>(this.baseUrl, label);
  }

  updateLabel(id: number, label: Label): Observable<Label> {
    return this.http.put<Label>(`${this.baseUrl}/${id}`, label);
  }

  deleteLabel(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
