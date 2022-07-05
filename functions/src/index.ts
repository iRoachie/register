import * as fs from 'fs/promises';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as XLSX from 'xlsx';

const corsHandler = cors({ origin: true });

/**
 * Updates attendee category when a category is deleted
 */
export const updateAttendeeCategory = functions.firestore
  .document('events/{eventId}/categories/{categoryId}')
  .onDelete(async (_, context) => {
    const { eventId, categoryId } = context.params;

    const { docs } = await admin
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .where('category.id', '==', categoryId)
      .get();

    await Promise.all(
      docs.map(async (a) => {
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
      })
    );
  });

interface Attendee {
  name: string;
  category: string;
  present: boolean;
}

/**
 * Return excel sheet of attendees
 */
export const excel = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, () => {});

  const eventId = req.query.eventId as string;

  if (!eventId) {
    res.status(422).send('No `eventId` sent in query');
    return;
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .get();

    if (snapshot.size === 0) {
      res.send({ message: 'No Attendees for this event.' });
      return;
    }

    const attendees: Attendee[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      attendees.push({
        name: data.name,
        category: data.category ? data.category.name : 'No Category',
        present: data.present,
      });
    });

    const workbook = await createWorkbook(attendees);
    res.download(workbook);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating workbook');
  }
});

const getMonth = (month: number) =>
  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][month];

const createWorkbook = async (attendees: Attendee[]) => {
  /* create a new blank workbook */
  const workbook = XLSX.utils.book_new();

  /* make worksheets */
  const attendeesSheet = XLSX.utils.json_to_sheet(attendees);

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(workbook, attendeesSheet, 'Attendees');

  const date = new Date();
  const name = `/tmp/excel/ecc-register-export-${date.getHours()}${date.getMinutes()}-${getMonth(
    date.getMonth()
  )}-${date.getDate()}-${date.getFullYear()}.xlsx`;

  await fs.mkdir('/tmp/excel', { recursive: true });
  XLSX.writeFile(workbook, name);

  return name;
};
