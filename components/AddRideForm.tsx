
import React, { useState } from 'react';
import { DESTINATIONS, Ride, RideType, User } from '../types';
import { X, Check, CalendarDays, Edit2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../firebaseConfig';

interface AddRideFormProps {
  onClose: () => void;
  currentUser: User;
}

const DAYS = [
  { label: 'א', value: 0 },
  { label: 'ב', value: 1 },
  { label: 'ג', value: 2 },
  { label: 'ד', value: 3 },
  { label: 'ה', value: 4 },
  { label: 'ו', value: 5 },
];

const AddRideForm: React.FC<AddRideFormProps> = ({ onClose, currentUser }) => {
  const [isCustomOrigin, setIsCustomOrigin] = useState(false);
  const [isCustomDest, setIsCustomDest] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Ride>>({
    type: RideType.OFFER,
    origin: 'מעלה עמוס',
    destination: 'ירושלים',
    seats: 3,
    time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
    recurringDays: [],
    userId: currentUser.id,
    driverName: currentUser.name
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driverName || !formData.phone) return;

    setSubmitting(true);

    try {
        const { error } = await supabase
          .from('rides')
          .insert([{
            ...formData,
            user_id: currentUser.id,
            driver_name: formData.driverName,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        onClose();
    } catch (error) {
        console.error("Error adding ride: ", error);
        alert("אירעה שגיאה בשמירת הנסיעה");
    } finally {
        setSubmitting(false);
    }
  };

  const toggleDay = (dayValue: number) => {
    const currentDays = formData.recurringDays || [];
    if (currentDays.includes(dayValue)) {
      setFormData({ ...formData, recurringDays: currentDays.filter(d => d !== dayValue) });
    } else {
      setFormData({ ...formData, recurringDays: [...currentDays, dayValue].sort() });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 border border-white/20 w-full max-w-md rounded-3xl p-6 relative shadow-2xl z-50 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">הוספת נסיעה חדשה</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: RideType.OFFER })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.type === RideType.OFFER 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              אני נוהג/ת
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: RideType.REQUEST })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                formData.type === RideType.REQUEST 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              אני צריך/ה טרמפ
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">שם מפרסם</label>
            <input 
              required
              type="text" 
              value={formData.driverName}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            />
          </div>

          {/* Origin Field */}
          <div>
             <div className="flex justify-between items-end mb-1">
                <label className="block text-xs text-gray-400">מוצא</label>
                <button 
                  type="button" 
                  onClick={() => setIsCustomOrigin(!isCustomOrigin)}
                  className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {isCustomOrigin ? <><List size={10}/> בחירה מרשימה</> : <><Edit2 size={10}/> הקלדה חופשית</>}
                </button>
             </div>
             
             {!isCustomOrigin ? (
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                >
                  <option value="מעלה עמוס">מעלה עמוס</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
             ) : (
                <input 
                    autoFocus
                    type="text" 
                    placeholder="הקלד כתובת מוצא..."
                    className="w-full bg-white/5 border border-blue-500/50 rounded-xl p-3 text-white focus:outline-none"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                 />
             )}
          </div>

          {/* Destination Field */}
          <div>
             <div className="flex justify-between items-end mb-1">
                <label className="block text-xs text-gray-400">יעד</label>
                <button 
                  type="button" 
                  onClick={() => setIsCustomDest(!isCustomDest)}
                  className="text-[10px] flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  {isCustomDest ? <><List size={10}/> בחירה מרשימה</> : <><Edit2 size={10}/> הקלדה חופשית</>}
                </button>
             </div>
             
             {!isCustomDest ? (
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                >
                  <option value="" disabled>בחר יעד...</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  <option value="מעלה עמוס">מעלה עמוס</option>
                </select>
             ) : (
                 <input 
                    autoFocus
                    type="text" 
                    placeholder="הקלד כתובת יעד..."
                    className="w-full bg-white/5 border border-blue-500/50 rounded-xl p-3 text-white focus:outline-none"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                 />
             )}
          </div>
          
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs text-gray-400 mb-1">תאריך</label>
               <input 
                  type="date" 
                  disabled={formData.isRecurring}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none ${formData.isRecurring ? 'opacity-50' : ''}`}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
             </div>
             <div>
               <label className="block text-xs text-gray-400 mb-1">שעה</label>
               <input 
                  type="time" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
             </div>
          </div>

          <div>
               <label className="block text-xs text-gray-400 mb-1">מספר טלפון</label>
               <input 
                  required
                  type="tel" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                  placeholder="050..."
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
          </div>
          
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <input 
                type="checkbox" 
                id="recurring" 
                className="w-4 h-4 rounded bg-white/10 border-white/20 accent-blue-500"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              <label htmlFor="recurring" className="text-sm text-gray-300 font-medium flex items-center gap-1">
                <CalendarDays size={14} />
                נסיעה קבועה
              </label>
            </div>
            
            <AnimatePresence>
            {formData.isRecurring && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[10px] text-gray-400 mb-2">בחר ימים קבועים בשבוע:</p>
                <div className="flex justify-between gap-1 mb-1">
                  {DAYS.map((day) => {
                    const isSelected = formData.recurringDays?.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                          isSelected 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/50' 
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'שומר...' : (
                <>
                    <Check size={20} />
                    פרסם נסיעה
                </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddRideForm;
