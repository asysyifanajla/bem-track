export type TimelineStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface TimelineEvent {
  id: string;
  title: string;
  programId?: string;
  programTitle?: string;
  departemen: string;
  startDate: string;
  endDate: string;
  location: string;
  status: TimelineStatus;
  description?: string;
  color?: string;
  createdBy: string;
  createdAt: string;
}

export interface CalendarDay {
  date: string;
  events: TimelineEvent[];
}
