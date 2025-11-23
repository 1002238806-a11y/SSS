
import React, { useState, useEffect } from 'react';
import { BusLine } from '../types';
import { Bus, MapPin, AlertCircle, Navigation, ExternalLink } from 'lucide-react';
import { getMinutesDiff, getGoogleMapsLink } from '../utils';
import { motion } from 'framer-motion';

interface BusCardProps {
  line: BusLine;
  departureTime: string;
}

const BusCard: React.FC<BusCardProps> = ({ line, departureTime }) => {
  const [minutesLeft, setMinutesLeft] = useState(getMinutesDiff(departureTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesLeft(getMinutesDiff(departureTime));
    }, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [departureTime]);

  const isUrgent = minutesLeft <= 15 && minutesLeft > 0;
  const mapsLink = getGoogleMapsLink(line.origin, line.destination, 'transit');
  
  // Real Moovit Link logic (simulated destination search)
  // Generating a link that opens moovit web app with search
  const moovitLink = `https://moovitapp.com/israel-1/search?query=${encodeURIComponent(line.line + ' ' + line.destination)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden rounded-xl p-[1px] bg-gradient-to-r from-orange-500/40 to-amber-500/40 border-0 shadow-lg group"
    >
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-[11px] p-3 relative h-full flex flex-col justify-between">
        
        {/* Realtime / Live Badge (Simulated) */}
        <div className="absolute top-2 left-2 flex gap-1 z-20">
             <span className="flex items-center gap-1 bg-green-900/40 text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Moovit Live
             </span>
        </div>

        {isUrgent && (
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-md animate-pulse z-20 shadow-lg shadow-orange-500/20">
            יוצא בקרוב!
          </div>
        )}

        <div className="flex justify-between items-start mb-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Bus size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xl text-white">קו {line.line}</h3>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-gray-400 border border-white/5">{line.operator}</span>
            </div>
          </div>
          
          <div className="text-right pl-1">
             <div className="text-2xl font-black text-orange-400 tracking-tight leading-none drop-shadow-lg">{departureTime}</div>
             <div className={`text-[11px] font-bold mt-1 flex items-center justify-end gap-1 ${isUrgent ? 'text-orange-300' : 'text-gray-400'}`}>
               {minutesLeft > 60 
                  ? `בעוד ${Math.floor(minutesLeft/60)} שעות` 
                  : minutesLeft > 0 ? `בעוד ${minutesLeft} דק'` : 'יצא לדרך'
               }
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5 border border-white/5 mb-3 group-hover:bg-white/10 transition-colors">
           <div className="flex items-center gap-1.5 text-xs text-gray-300 truncate max-w-[40%]">
             <MapPin size={12} className="text-orange-500 shrink-0" />
             <span className="truncate">{line.origin}</span>
           </div>
           <div className="h-px w-4 bg-gray-600 dashed shrink-0"></div>
           <div className="flex items-center gap-1.5 text-xs text-white font-medium truncate max-w-[40%] justify-end">
             <span className="truncate">{line.destination}</span>
             <MapPin size={12} className="text-orange-500 shrink-0" />
           </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <a
            href={moovitLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#f04e45]/10 hover:bg-[#f04e45]/20 text-[#ff8f88] text-xs font-medium transition-colors border border-[#f04e45]/20"
          >
            <ExternalLink size={12} />
            <span>זמנים ב-Moovit</span>
          </a>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
            title="הצג מסלול"
          >
            <Navigation size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;
