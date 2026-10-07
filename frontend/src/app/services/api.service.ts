import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getStates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/states`);
  }
  createState(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/states`, data);
  }
  updateState(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/states/${id}`, data);
  }
  deleteState(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/states/${id}`);
  }

  getDistricts(stateId?: number): Observable<any> {
    let params = new HttpParams();
    if (stateId) {
      params = params.set('stateId', stateId.toString());
    }
    return this.http.get(`${this.apiUrl}/districts`, { params });
  }
  createDistrict(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/districts`, data);
  }
  updateDistrict(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/districts/${id}`, data);
  }
  deleteDistrict(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/districts/${id}`);
  }

  getClients(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/clients`, { params });
  }
  createClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients`, data);
  }
  updateClient(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${id}`, data);
  }
  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clients/${id}`);
  }
  updateClientStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clients/${id}/status`, { status }, { headers: this.getHeaders() });
  }
  confirmBooking(clientId: number, data: { occupied_till: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients/${clientId}/confirm-booking`, data);
  }

  getLocations(districtId?: number, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (districtId) {
      params = params.set('districtId', districtId.toString());
    }
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/locations`, { params });
  }
  createLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/locations`, data);
  }
  updateLocation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/locations/${id}`, data);
  }
  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/locations/${id}`);
  }

  getHoardings(locationId?: number, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (locationId) {
      params = params.set('locationId', locationId.toString());
    }
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/hoardings`, { params });
  }

  getHoardingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/hoardings/${id}`);
  }

  createHoarding(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/hoardings`, data);
  }

  updateHoarding(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/hoardings/${id}`, data);
  }

  deleteHoarding(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hoardings/${id}`);
  }

  updateHoardingAvailability(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/hoardings/${id}/availability`, data, { headers: this.getHeaders() });
  }
  getLeads(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leads`, { headers: this.getHeaders() });
  }

  submitLead(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leads`, data);
  }

  markLeadRead(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/leads/${id}/read`, {}, { headers: this.getHeaders() });
  }

  deleteLead(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/leads/${id}`, { headers: this.getHeaders() });
  }

  getHoardingImages(hoardingId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/images/${hoardingId}`);
  }

  deleteHoardingImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/images/${imageId}`);
  }
}
