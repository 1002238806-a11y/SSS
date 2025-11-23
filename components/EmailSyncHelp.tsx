
import React from 'react';
import { X, Server, Database, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailSyncHelpProps {
  onClose: () => void;
}

const EmailSyncHelp: React.FC<EmailSyncHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl z-50 overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">איך מסנכרנים את המייל לאפליקציה?</h2>
        <p className="text-sm text-gray-400 mb-6">מדריך טכני למפתחים</p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
                <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                    <Mail size={24} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-white mb-1">1. הגדרת Gmail API</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    כדי לגשת למיילים, יש ליצור פרוייקט ב-<strong>Google Cloud Console</strong>. יש להפעיל את ה-Gmail API וליצור <code>Service Account</code> או להשתמש ב-OAuth כדי לתת הרשאה לקריאת הודעות מקבוצת התפוצה הספציפית.
                </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <Server size={24} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-white mb-1">2. הקמת Backend (Firebase Functions)</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    דפדפן (צד לקוח) לא יכול לגשת לשרתי גוגל ישירות מטעמי אבטחה.
                    יש לכתוב <strong>Cloud Function</strong> שרץ ב-Cron Job (למשל כל 5 דקות):
                </p>
                <div className="bg-black/30 p-3 rounded-lg mt-2 text-xs font-mono text-blue-200 dir-ltr text-left">
                    {`exports.pullEmails = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  const messages = await gmail.users.messages.list({ q: 'label:rides -label:processed' });
  // Parse logic here...
});`}
                </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                    <Database size={24} />
                </div>
            </div>
            <div>
                <h3 className="font-bold text-lg text-white mb-1">3. ניתוח טקסט ושמירה (NLP)</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                    הסקריפט צריך לסרוק את גוף המייל ולחלץ מידע:
                    <br />
                    • זיהוי מילים כמו "מחר", "היום", "יום ראשון".
                    <br />
                    • זיהוי יעדים (ירושלים, גוש עציון) באמצעות רשימת מילות מפתח.
                    <br />
                    • לאחר הניתוח, שומרים את האובייקט ב-Firestore ב-Collection בשם <code>emailRequests</code>.
                </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
             <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors">
                הבנתי, תודה
             </button>
        </div>

      </motion.div>
    </div>
  );
};

export default EmailSyncHelp;
