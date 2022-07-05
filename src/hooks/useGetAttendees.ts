import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';
import { firestore } from '../config/firebase';
import { Attendee } from '../utils/types';

interface State {
  attendees: Attendee[];
  status: 'initial' | 'loading' | 'success';
}

type Action = { type: 'loading' } | { type: 'success'; data: Attendee[] };

const initialState: State = {
  status: 'initial',
  attendees: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        status: 'loading',
      };
    case 'success':
      return {
        ...state,
        status: 'success',
        attendees: action.data,
      };
    default:
      return state;
  }
};

export const useGetAttendees = (eventId: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'loading' });

    const attendeesUnsub = onSnapshot(
      query(
        collection(firestore, `events/${eventId}/attendees`),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const attendees = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({ type: 'success', data: attendees as Attendee[] });
      }
    );

    return attendeesUnsub;
  }, [eventId]);

  return { ...state };
};
