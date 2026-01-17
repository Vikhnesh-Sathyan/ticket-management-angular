import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent implements OnChanges {

  @Input() ticket?: Ticket;
  @Output() saveTicket = new EventEmitter<Ticket>();
  @Output() cancelEdit = new EventEmitter<void>();

  ticketForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ticketForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['Open'],
      priority: ['Medium'],
      assignee: ['']
    });
  }

  ngOnChanges() {
    if (this.ticket) {
      this.ticketForm.patchValue(this.ticket);
    } else {
      // Reset form when ticket is cleared
      this.ticketForm.reset({ status: 'Open', priority: 'Medium' });
      Object.keys(this.ticketForm.controls).forEach(key => {
        this.ticketForm.get(key)?.markAsUntouched();
      });
    }
  }

  onSubmit() {
    if (this.ticketForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.ticketForm.controls).forEach(key => {
        this.ticketForm.get(key)?.markAsTouched();
      });
      return;
    }

    const newTicket: Ticket = {
      id: this.ticket?.id || Date.now(),
      createdDate: this.ticket?.createdDate || new Date().toISOString(),
      ...this.ticketForm.value
    };

    this.saveTicket.emit(newTicket);
    this.ticketForm.reset({ status: 'Open', priority: 'Medium' });
    // Reset touched state
    Object.keys(this.ticketForm.controls).forEach(key => {
      this.ticketForm.get(key)?.markAsUntouched();
    });
  }

  onCancel() {
    this.cancelEdit.emit();
    this.ticketForm.reset({ status: 'Open', priority: 'Medium' });
    Object.keys(this.ticketForm.controls).forEach(key => {
      this.ticketForm.get(key)?.markAsUntouched();
    });
  }
}
