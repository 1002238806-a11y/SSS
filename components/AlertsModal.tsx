
import React, { useState } from 'react';
import { X, Bell, CheckCircle } from 'lucide-react';
import { DESTINATIONS } from '../types';
import { motion } from 'framer-motion';

interface AlertsModalProps {
  onClose: () => void;
}

const AlertsModal: React.FC<AlertsModalProps> = ({ onClose }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter(a => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send this to your backend/Firebase
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/20 w-full max-w-md rounded-2xl p-6 relative shadow-2xl z-50"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500">
                <Bell size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">קבל התראות למייל</h2>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              בחר את האזורים שמעניינים אותך, ואנחנו נשלח לך מייל כשתעלה נסיעה רלוונטית או בקשה חדשה.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-2">אזורים מבוקשים:</label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {DESTINATIONS.map(dest => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => toggleArea(dest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        selectedAreas.includes(dest)
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs text-gray-500 mb-1">כתובת המייל שלך:</label>
                <input 
                  type="email" 
                  required
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-xl transition-colors"
              >
                הירשם לעדכונים
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex p-4 bg-green-500/20 rounded-full text-green-500 mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">נרשמת בהצלחה!</h3>
            <p className="text-gray-400 text-sm">נשלח לך עדכונים לכתובת {email}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AlertsModal;
