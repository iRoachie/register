import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';
import { firestore } from '../config/firebase';
import { Total } from '../utils/types';

interface State {
  totals: Total[];
  status: 'initial' | 'loading' | 'success';
}

type Action = { type: 'loading' } | { type: 'success'; data: Total[] };

const initialState: State = {
  status: 'initial',
  totals: [],
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
        totals: action.data,
      };
    default:
      return state;
  }
};

export const useGetTotals = (eventId: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'loading' });

    const totalsUnsub = onSnapshot(
      query(
        collection(firestore, `events/${eventId}/totals`),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const totals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({ type: 'success', data: totals as Total[] });
      }
    );

    return totalsUnsub;
  }, [eventId]);

  return { ...state };
};
