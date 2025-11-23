
import React from 'react';
import { Ride, RideType } from '../types';
import { Phone, MessageCircle, Car, User, Navigation, Repeat, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGoogleMapsLink } from '../utils';

interface RideCardProps {
  ride: Ride;
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

const dayLabels = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

const RideCard: React.FC<RideCardProps> = ({ ride, currentUserId, onDelete }) => {
  const isOffer = ride.type === RideType.OFFER;
  const mapsLink = getGoogleMapsLink(ride.origin, ride.destination, 'driving');
  
  // Strict ownership check using user ID
  const isOwner = currentUserId && ride.userId === currentUserId;

  const getRecurringText = () => {
    if (!ride.isRecurring) return null;
    if (!ride.recurringDays || ride.recurringDays.length === 0) return 'קבוע';
    if (ride.recurringDays.length >= 5) return 'כל יום';
    return ride.recurringDays.map(d => dayLabels[d]).join(', ');
  };

  const recurringText = getRecurringText();

  const handleDelete = () => {
    if (onDelete) {
        onDelete(ride.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`relative overflow-hidden rounded-xl p-3 border shadow-lg backdrop-blur-md transition-all h-full flex flex-col group
        ${isOffer 
          ? 'bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-200/20' 
          : 'bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border-emerald-200/20'
        }`}
    >
      {/* Owner Badge / Delete Button */}
      {isOwner && (
          <div className="absolute top-2 left-2 z-20 flex gap-2">
             <button 
                onClick={handleDelete}
                className="p-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/20"
                title="מחק נסיעה"
             >
                <Trash2 size={12} />
             </button>
             <span className="bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded border border-white/10 flex items-center shadow-sm backdrop-blur-sm">
                הנסיעה שלי
             </span>
          </div>
      )}

      {/* Decorative Glow - reduced size for compact view */}
      <div className={`absolute -top-5 -right-5 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none
        ${isOffer ? 'bg-blue-400' : 'bg-emerald-400'}`} />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isOffer ? 'bg-blue-500/20 text-blue-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
            {isOffer ? <Car size={16} /> : <User size={16} />}
          </div>
          <div>
            <h3 className="font-bold text-base text-white leading-tight">{ride.driverName}</h3>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isOffer ? 'bg-blue-500/20 text-blue-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
              {isOffer ? 'מציע טרמפ' : 'מחפש טרמפ'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-xl font-black text-white tracking-tight">
            <span>{ride.time}</span>
          </div>
          {recurringText && (
            <div className="flex items-center gap-1 text-[9px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
              <Repeat size={8} />
              <span>{recurringText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 text-gray-300 relative z-10 bg-black/20 p-2 rounded-lg">
        <div className="flex flex-col items-center gap-0.5 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          <div className="w-0.5 h-3 bg-gray-600/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="text-xs text-gray-400 truncate">{ride.origin}</div>
          <div className="text-sm font-medium text-white truncate">{ride.destination}</div>
        </div>
        <a 
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          title="נווט עם Google Maps"
        >
          <Navigation size={14} />
        </a>
      </div>
      
      {ride.notes && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-1 italic px-1">
          "{ride.notes}"
        </p>
      )}

      <div className="mt-auto flex gap-2 relative z-10">
        <a 
          href={`tel:${ride.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
        >
          <Phone size={14} />
          <span>חיוג</span>
        </a>
        <a 
          href={`https://wa.me/972${ride.phone.replace(/[^0-9]/g, '').substring(1)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-medium transition-colors border border-green-500/20"
        >
          <MessageCircle size={14} />
          <span>וואטסאפ</span>
        </a>
      </div>
    </motion.div>
  );
};

export default RideCard;
