import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private storageKey = 'tickets';

  getTickets(): Ticket[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tickets));
  }

  addTicket(ticket: Ticket): void {
    const tickets = this.getTickets();
    tickets.push(ticket);
    this.saveTickets(tickets);
  }

  updateTicket(updatedTicket: Ticket): void {
    const tickets = this.getTickets().map(ticket =>
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    );
    this.saveTickets(tickets);
  }

  deleteTicket(id: number): void {
    const tickets = this.getTickets().filter(ticket => ticket.id !== id);
    this.saveTickets(tickets);
  }
}
