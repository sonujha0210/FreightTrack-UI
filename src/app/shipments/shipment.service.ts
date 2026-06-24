import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Shipment, ShipmentEvent, ShipmentFilter, CreateShipmentRequest, UpdateShipmentRequest, CreateShipmentEventRequest } from '../models/shipment.models';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private apiUrl = `${environment.apiBaseUrl}/api/Shipments`;

  constructor(private http: HttpClient) { }

  getAllShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(`${this.apiUrl}/GetAllShipment`);
  }

  getShipmentById(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/GetShipmentById${id}`);
  }

  createShipment(request: CreateShipmentRequest): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, request);
  }

  updateShipment(id: number, request: UpdateShipmentRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  deleteShipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addEvent(shipmentId: number, request: CreateShipmentEventRequest): Observable<ShipmentEvent> {
    return this.http.post<ShipmentEvent>(`${this.apiUrl}/${shipmentId}/events`, request);
  }

  getHistory(shipmentId: number): Observable<ShipmentEvent[]> {
    return this.http.get<ShipmentEvent[]>(`${this.apiUrl}/${shipmentId}/history`);
  }

  filterShipments(filter: ShipmentFilter): Observable<Shipment[]> {
    let params = new HttpParams();
    if (filter.status) params = params.set('Status', filter.status);
    if (filter.customerId) params = params.set('CustomerId', filter.customerId.toString());
    if (filter.fromDate) params = params.set('FromDate', filter.fromDate);
    if (filter.toDate) params = params.set('ToDate', filter.toDate);
    return this.http.get<Shipment[]>(`${this.apiUrl}/filter`, { params });
  }

  exportShipments(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
