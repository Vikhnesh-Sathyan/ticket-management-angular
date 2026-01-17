import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { Ticket } from '../../models/ticket.model';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketFormComponent],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket?: Ticket;
  currentUser: any = null;

  // Filter and search properties
  searchTerm: string = '';
  statusFilter: string = 'All';
  priorityFilter: string = 'All';

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTickets();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadTickets() {
    this.tickets = this.ticketService.getTickets();
    this.applyFilters();
  }

  onSave(ticket: Ticket) {
    if (this.selectedTicket) {
      this.ticketService.updateTicket(ticket);
    } else {
      this.ticketService.addTicket(ticket);
    }
    this.selectedTicket = undefined;
    this.loadTickets();
  }

  onCancelEdit() {
    this.selectedTicket = undefined;
  }

  onEdit(ticket: Ticket) {
    this.selectedTicket = ticket;
    // Scroll to form
    setTimeout(() => {
      document.querySelector('.form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id);
      if (this.selectedTicket?.id === id) {
        this.selectedTicket = undefined;
      }
      this.loadTickets();
    }
  }

  onStatusChange(ticket: Ticket, newStatus: 'Open' | 'In Progress' | 'Closed') {
    const updatedTicket = { ...ticket, status: newStatus };
    this.ticketService.updateTicket(updatedTicket);
    this.loadTickets();
  }

  applyFilters() {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearch = !this.searchTerm || 
        ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || ticket.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'All' || ticket.priority === this.priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onPriorityFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.priorityFilter = 'All';
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
