export interface IEvent {
  id: string;
  name: string;
  createdAt: string;
  categories?: Category[];
  attendees?: Attendee[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Attendee {
  name: string;
  category: string;
  present: boolean;
}
