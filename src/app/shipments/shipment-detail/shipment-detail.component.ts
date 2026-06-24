import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShipmentService } from '../shipment.service';
import { Shipment, ShipmentEvent } from '../../models/shipment.models';

@Component({
  selector: 'app-shipment-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './shipment-detail.component.html',
  styleUrls: ['./shipment-detail.component.css']
})
export class ShipmentDetailComponent implements OnInit {
  shipment: Shipment | null = null;
  events: ShipmentEvent[] = [];
  loading = true;
  error: string | null = null;

  // Edit mode
  editMode = false;
  editForm: FormGroup;
  editLoading = false;

  // Add event
  eventForm: FormGroup;
  eventLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shipmentService: ShipmentService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      origin: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      customerId: ['', [Validators.required, Validators.min(1)]]
    });

    this.eventForm = this.fb.group({
      status: ['', Validators.required],
      location: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadShipment(id);
      this.loadHistory(id);
    } else {
      this.error = 'Invalid shipment ID';
      this.loading = false;
    }
  }

  loadShipment(id: number): void {
    this.loading = true;
    this.shipmentService.getShipmentById(id).subscribe({
      next: (data) => {
        this.shipment = data;
        this.editForm.patchValue({
          origin: data.origin,
          destination: data.destination,
          customerId: data.customerId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.message || 'Failed to load shipment';
        this.loading = false;
      }
    });
  }

  loadHistory(id: number): void {
    this.shipmentService.getHistory(id).subscribe({
      next: (data) => {
        this.events = data;
      },
      error: () => {
        // History is optional, don't show error
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.shipment) {
      this.editForm.patchValue({
        origin: this.shipment.origin,
        destination: this.shipment.destination,
        customerId: this.shipment.customerId
      });
    }
  }

  onUpdate(): void {
    if (this.editForm.invalid || !this.shipment) return;

    this.editLoading = true;
    this.shipmentService.updateShipment(this.shipment.id, this.editForm.value).subscribe({
      next: () => {
        this.editLoading = false;
        this.editMode = false;
        this.loadShipment(this.shipment!.id);
      },
      error: (err) => {
        this.editLoading = false;
        this.error = err.error?.message || err.message || 'Update failed';
      }
    });
  }

  onAddEvent(): void {
    if (this.eventForm.invalid || !this.shipment) return;

    this.eventLoading = true;
    this.shipmentService.addEvent(this.shipment.id, this.eventForm.value).subscribe({
      next: () => {
        this.eventForm.reset({ status: '', location: '', notes: '' });
        this.eventLoading = false;
        this.loadHistory(this.shipment!.id);
        this.loadShipment(this.shipment!.id);
      },
      error: (err) => {
        this.eventLoading = false;
        this.error = err.error?.message || err.message || 'Failed to add event';
      }
    });
  }

  deleteShipment(): void {
    if (!this.shipment) return;
    if (confirm('Are you sure you want to delete this shipment? This action cannot be undone.')) {
      this.shipmentService.deleteShipment(this.shipment.id).subscribe({
        next: () => this.router.navigate(['/shipments']),
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
