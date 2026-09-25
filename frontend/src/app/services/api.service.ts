import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

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

  getClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients`);
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
  confirmBooking(clientId: number, data: { occupied_till: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients/${clientId}/confirm-booking`, data);
  }

  getLocations(districtId?: number): Observable<any> {
    let params = new HttpParams();
    if (districtId) {
      params = params.set('districtId', districtId.toString());
    }
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

  getHoardings(locationId?: number): Observable<any> {
    let params = new HttpParams();
    if (locationId) {
      params = params.set('locationId', locationId.toString());
    }
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
}
