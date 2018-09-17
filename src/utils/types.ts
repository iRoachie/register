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
  present?: number;
}

export interface Attendee {
  id: string;
  name: string;
  category: Category;
  present: boolean;
}
