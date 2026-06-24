import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShipmentService } from '../shipment.service';
import { Shipment, ShipmentFilter } from '../../models/shipment.models';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.css']
})
export class ShipmentListComponent implements OnInit {
  shipments: Shipment[] = [];
  filteredShipments: Shipment[] = [];
  loading = false;
  error: string | null = null;

  filter: ShipmentFilter = {};
  searchTerm = '';

  constructor(private shipmentService: ShipmentService) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  loadShipments(): void {
    this.loading = true;
    this.error = null;
    this.shipmentService.getAllShipments().subscribe({
      next: (data) => {
        this.shipments = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.message || 'Failed to load shipments';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.filter.status || this.filter.customerId || this.filter.fromDate || this.filter.toDate) {
      this.loading = true;
      this.shipmentService.filterShipments(this.filter).subscribe({
        next: (data) => {
          this.filteredShipments = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || err.message || 'Filter failed';
          this.loading = false;
        }
      });
    } else {
      this.filteredShipments = [...this.shipments];
    }
  }

  clearFilter(): void {
    this.filter = {};
    this.searchTerm = '';
    this.loadShipments();
  }

  exportCsv(): void {
    this.shipmentService.exportShipments().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shipments.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Failed to export shipments';
      }
    });
  }

  deleteShipment(id: number): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      this.shipmentService.deleteShipment(id).subscribe({
        next: () => this.loadShipments(),
        error: (err) => {
          this.error = err.error?.message || err.message || 'Delete failed';
        }
      });
    }
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
