export interface TicketStaffListDto {
  id: number;
  peopleCount: number;
  position: number;
  status: string;
  createdAt: string;
  confirmedAt: string | null;
  notifiedAt: string | null;
  cancelledAt: string | null;
  customerFullName: string;
  
}
