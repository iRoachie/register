import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

/**
 * Updates attendee category when a category is deleted
 */
export const updateAttendeeCategory = functions.firestore
  .document('events/{eventId}/categories/{categoryId}')
  .onDelete((_, context) => {
    const { eventId, categoryId } = context.params;

    return admin
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .where('category.id', '==', categoryId)
      .get()
      .then(a => a.docs)
      .then(data => {
        return data.forEach(a => {
          const attendee = {
            id: a.id,
            ...a.data(),
          } as any;

          delete attendee.category;

          return admin
            .firestore()
            .collection('events')
            .doc(eventId)
            .collection('attendees')
            .doc(attendee.id)
            .set(attendee);
        });
      });
  });
