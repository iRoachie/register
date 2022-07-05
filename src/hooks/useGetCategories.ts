import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';
import { firestore } from '../config/firebase';
import { Category } from '../utils/types';

interface State {
  categories: Category[];
  status: 'initial' | 'loading' | 'success';
}

type Action = { type: 'loading' } | { type: 'success'; data: Category[] };

const initialState: State = {
  status: 'initial',
  categories: [],
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
        categories: action.data,
      };
    default:
      return state;
  }
};

export const useGetCategories = (eventId: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'loading' });

    const categoriesUnsub = onSnapshot(
      query(
        collection(firestore, `events/${eventId}/categories`),
        orderBy('createdAt', 'desc')
      ),
      (snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch({ type: 'success', data: categories as Category[] });
      }
    );

    return categoriesUnsub;
  }, [eventId]);

  return { ...state };
};
