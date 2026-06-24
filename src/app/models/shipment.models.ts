export interface Shipment {
  id: number;
  origin: string;
  destination: string;
  customerId: number;
  customerName?: string;
  status: string;
  createdDate: string;
  updatedDate?: string;
}

export interface ShipmentEvent {
  id: number;
  shipmentId: number;
  status: string;
  location: string;
  notes: string;
  timestamp: string;
}

export interface ShipmentFilter {
  status?: string;
  customerId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface CreateShipmentRequest {
  origin: string;
  destination: string;
  customerId: number;
}

export interface UpdateShipmentRequest {
  origin: string;
  destination: string;
  customerId: number;
}

export interface CreateShipmentEventRequest {
  status: string;
  location: string;
  notes: string;
}
