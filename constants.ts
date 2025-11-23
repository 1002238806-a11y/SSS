
import { BusLine, EmailRideRequest } from './types';

// Mock Bus Data for Ma'ale Amos (Static data is fine here)
export const BUS_SCHEDULES: BusLine[] = [
  {
    line: "409",
    operator: "אלקטרה אפיקים",
    origin: "מעלה עמוס",
    destination: "ירושלים",
    schedule: ["06:00", "06:45", "07:30", "08:15", "09:00", "12:00", "14:30", "16:15", "18:00", "20:30", "22:15"]
  },
  {
    line: "44",
    operator: "אלקטרה אפיקים",
    origin: "מעלה עמוס",
    destination: "ביתר עילית",
    schedule: ["07:00", "08:00", "09:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "21:00"]
  },
  {
    line: "409",
    operator: "אלקטרה אפיקים",
    origin: "ירושלים",
    destination: "מעלה עמוס",
    schedule: ["08:00", "10:00", "13:00", "15:00", "17:00", "19:00", "23:00"]
  },
  {
    line: "365",
    operator: "אלקטרה אפיקים",
    origin: "מעלה עמוס",
    destination: "מיצד",
    schedule: ["08:30", "12:30", "16:30"]
  }
];

// We kept Email Requests as mock for now because implementing backend reader requires Cloud Functions
export const MOCK_EMAIL_REQUESTS: EmailRideRequest[] = [
  {
    id: 'e1',
    originalSubject: 'מחפשת טרמפ לירושלים מחר בבוקר',
    originalBody: 'היי, צריכה להגיע לגבעת שאול באזור 8 בבוקר. אם מישהו יוצא אשמח להצטרף. רחלי 050-9999999',
    senderName: 'רחלי כהן',
    senderEmail: 'racheli@gmail.com',
    detectedOrigin: 'מעלה עמוס',
    detectedDestination: 'ירושלים',
    detectedTime: '08:00',
    receivedAt: new Date().toISOString()
  },
  {
    id: 'e2',
    originalSubject: 'יוצא מביתר למעלה עמוס ב16:00',
    originalBody: 'יש 3 מקומות פנויים. חוזר דרך צומת הגוש.',
    senderName: 'דניאל',
    senderEmail: 'daniel@walla.co.il',
    detectedOrigin: 'ביתר עילית',
    detectedDestination: 'מעלה עמוס',
    detectedTime: '16:00',
    receivedAt: new Date(Date.now() - 3600000).toISOString()
  }
];
