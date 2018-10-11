import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as XLSX from 'xlsx';
import * as mkdir from 'mkdirp';
import * as boom from 'boom';

const cors = require('cors')({ origin: true });

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

/**
 * Return excel sheet of attendees
 */
export const excel = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const { eventId } = req.query;

    if (!eventId) {
      return res
        .status(422)
        .send(boom.badData('No `eventId` sent in query').output.payload);
    }

    return admin
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .get()
      .then(snapshot => {
        if (snapshot.size === 0) {
          return res.send({ message: 'No Attendees for this event.' });
        }

        const attendees = [];

        snapshot.forEach(doc => {
          const data = doc.data();

          attendees.push({
            name: data.name,
            category: data.category ? data.category.name : 'No Category',
            present: data.present,
          });
        });

        return createWorkbook(attendees)
          .then((workbook: string) => {
            return res.download(workbook);
          })
          .catch(err => {
            return res.send(boom.serverUnavailable('', err));
          });
      })
      .catch(err => {
        res.send(boom.serverUnavailable('', err));
        throw new Error(err);
      });
  });
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

const createWorkbook = attendees => {
  return new Promise(resolve => {
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

    mkdir('/tmp/excel', () => {
      XLSX.writeFile(workbook, name);
      resolve(name);
    });
  });
};
