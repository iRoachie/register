export interface IEvent {
  id: string;
  name: string;
  createdAt: number;
  categories?: Category[];
  attendees?: Attendee[];
}

export interface Category {
  id: string;
  createdAt: number;
  name: string;
  present?: number;
}

export interface Attendee {
  id: string;
  createdAt: number;
  name: string;
  category?: Category;
  present: boolean;
}

export interface ViewEventContext {
  categories: Category[];
  attendees: Attendee[];
  totals: Total[];
  categoriesStatus: 'loading' | 'success';
  attendeesStatus: 'loading' | 'success';
  totalsStatus: 'loading' | 'success';
}

export interface Total {
  id: string;
  name: string;
  categories: string[];
}
