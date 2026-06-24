import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ShipmentService } from '../shipment.service';
import { Shipment, ShipmentEvent } from '../../models/shipment.models';

@Component({
  selector: 'app-shipment-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shipment-history.component.html',
  styleUrls: ['./shipment-history.component.css']
})
export class ShipmentHistoryComponent implements OnInit {
  shipment: Shipment | null = null;
  events: ShipmentEvent[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private shipmentService: ShipmentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadData(id);
    } else {
      this.error = 'Invalid shipment ID';
      this.loading = false;
    }
  }

  loadData(id: number): void {
    this.loading = true;
    this.shipmentService.getShipmentById(id).subscribe({
      next: (shipment) => {
        this.shipment = shipment;
        this.loadHistory(id);
      },
      error: () => {
        this.error = 'Failed to load shipment details';
        this.loading = false;
      }
    });
  }

  loadHistory(id: number): void {
    this.shipmentService.getHistory(id).subscribe({
      next: (events) => {
        // Sort by timestamp descending (most recent first)
        this.events = events.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load shipment history';
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Pending': 'bg-warning',
      'In Transit': 'bg-primary',
      'Delivered': 'bg-success',
      'Cancelled': 'bg-danger',
      'On Hold': 'bg-info'
    };
    return statusMap[status] || 'bg-secondary';
  }
}
