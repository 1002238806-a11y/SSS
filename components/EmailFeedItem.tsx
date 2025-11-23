
import React from 'react';
import { EmailRideRequest } from '../types';
import { Mail, Clock, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailFeedItemProps {
  request: EmailRideRequest;
}

const EmailFeedItem: React.FC<EmailFeedItemProps> = ({ request }) => {
  // Extract phone if exists in body
  const phoneMatch = request.originalBody.match(/05\d-?\d{7}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-3 hover:bg-slate-800/80 transition-colors relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1 h-full bg-pink-500/50" />
      
      <div className="flex justify-between items-start mb-2 pl-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-500/10 rounded-lg text-pink-400">
            <Mail size={16} />
          </div>
          <div>
            <span className="text-xs text-pink-300 font-medium">בקשה מהמייל</span>
            <h3 className="text-sm font-bold text-white">{request.senderName}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock size={10} />
          <span>{new Date(request.receivedAt).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div className="bg-black/20 rounded p-2 mb-3">
         <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
            <span className="text-gray-500">נושא:</span>
            <span className="font-medium truncate">{request.originalSubject}</span>
         </div>
         <p className="text-xs text-gray-400 italic line-clamp-2">
           "{request.originalBody}"
         </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
         {(request.detectedOrigin || request.detectedDestination) && (
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-gray-300">
               <MapPin size={10} />
               <span>{request.detectedOrigin} ◄ {request.detectedDestination}</span>
            </div>
         )}
         {request.detectedTime && (
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-gray-300">
               <Clock size={10} />
               <span>סביבות {request.detectedTime}</span>
            </div>
         )}
      </div>

      {phone && (
        <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
           <a 
              href={`tel:${phone}`} 
              className="flex-1 text-center py-1.5 bg-blue-600/20 text-blue-300 rounded text-xs font-bold hover:bg-blue-600/30 transition-colors"
           >
             חייג: {phone}
           </a>
           <a 
              href={`https://wa.me/972${phone.replace(/-/g, '').substring(1)}`}
              target="_blank"
              rel="noreferrer" 
              className="flex-1 text-center py-1.5 bg-green-600/20 text-green-300 rounded text-xs font-bold hover:bg-green-600/30 transition-colors"
           >
             וואטסאפ
           </a>
        </div>
      )}
    </motion.div>
  );
};

export default EmailFeedItem;
