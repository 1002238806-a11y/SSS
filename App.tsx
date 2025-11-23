
import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Calendar, Car, User as UserIcon, Bell, Info, Clock } from 'lucide-react';
import { BUS_SCHEDULES, MOCK_EMAIL_REQUESTS } from './constants';
import { DESTINATIONS, Ride, User } from './types';
import { getCurrentTime, mergeAndSortTransport } from './utils';
import RideCard from './components/RideCard';
import BusCard from './components/BusCard';
import AddRideForm from './components/AddRideForm';
import Login from './components/Login';
import EmailFeedItem from './components/EmailFeedItem';
import AlertsModal from './components/AlertsModal';
import EmailSyncHelp from './components/EmailSyncHelp';
import { AnimatePresence, motion } from 'framer-motion';

// Firebase Imports (Modular)
import { db, auth } from './firebaseConfig';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showEmailHelp, setShowEmailHelp] = useState(false);
  
  // Filters
  const [filterDest, setFilterDest] = useState('הכל');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Time Range Filter
  const [timeRange, setTimeRange] = useState({
    start: getCurrentTime(),
    end: '23:59'
  });

  // Current real time
  const [realTime, setRealTime] = useState(getCurrentTime());
  const [activeTab, setActiveTab] = useState<'app' | 'email'>('app');

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || 'משתמש',
          email: user.email || '',
          imageUrl: user.photoURL || undefined
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Rides Real-time Listener (Firestore)
  useEffect(() => {
    // Modular Syntax
    const q = query(
      collection(db, 'rides'),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedRides = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Ride[];
        
        setRides(fetchedRides);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching rides:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDeleteRide = async (rideId: string) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הנסיעה?")) {
      try {
        await deleteDoc(doc(db, 'rides', rideId));
      } catch (e) {
        alert("שגיאה במחיקת הנסיעה. וודא שאתה היוצר של הנסיעה.");
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const transportItems = mergeAndSortTransport(
    rides, 
    BUS_SCHEDULES, 
    filterDest, 
    timeRange,
    selectedDate
  );

  const filteredEmailRequests = MOCK_EMAIL_REQUESTS.filter(req => {
      const matchesDest = filterDest === 'הכל' || 
          req.detectedOrigin.includes(filterDest) || 
          req.detectedDestination.includes(filterDest) ||
          req.originalBody.includes(filterDest);
      return matchesDest;
  });

  const getHebrewDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black pb-12 text-slate-200 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
               <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                 <Car size={20} className="text-white" />
               </div>
               <div>
                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-300 leading-none">
                  טרמפי עמוס
                </h1>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  קהילת טרמפים חיה
                </p>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAlertsModal(true)}
                className="p-2 rounded-full bg-white/5 hover:bg-yellow-500/20 text-yellow-500 transition-colors border border-white/5"
              >
                <Bell size={20} />
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2 bg-white/5 pr-1 pl-3 py-1 rounded-full border border-white/10 cursor-pointer hover:bg-white/10" onClick={handleLogout} title="לחץ להתנתק">
                   <img src={currentUser.imageUrl || `https://ui-avatars.com/api/?name=${currentUser.name}`} alt="User" className="w-6 h-6 rounded-full" />
                   <span className="text-xs font-medium hidden md:block">{currentUser.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">אורח</span>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col gap-3">
            <div className="overflow-x-auto no-scrollbar flex items-center gap-2">
              <button 
                onClick={() => setFilterDest('הכל')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  filterDest === 'הכל' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                הכל
              </button>
              {DESTINATIONS.map(dest => (
                <button 
                  key={dest}
                  onClick={() => setFilterDest(dest)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    filterDest === dest
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-900/50 rounded-lg px-2 py-1.5 border border-white/5 grow md:grow-0">
                    <Calendar size={14} className="text-gray-500 ml-2" />
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white text-xs font-medium focus:outline-none w-full"
                    />
                </div>
                
                <div className="flex items-center bg-slate-900/50 rounded-lg px-2 py-1.5 border border-white/5 gap-1">
                    <Clock size={14} className="text-gray-500" />
                    <span className="text-[10px] text-gray-400">מ:</span>
                    <input 
                      type="time" 
                      value={timeRange.start}
                      onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                      className="bg-transparent text-white text-xs font-bold focus:outline-none w-14"
                    />
                    <span className="text-[10px] text-gray-400">-</span>
                    <input 
                      type="time" 
                      value={timeRange.end}
                      onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                      className="bg-transparent text-white text-xs font-bold focus:outline-none w-14"
                    />
                </div>

                <div className="flex items-center bg-slate-900/50 rounded-lg px-3 py-1.5 border border-white/5 flex-1 min-w-[150px]">
                  <Search size={14} className="text-gray-500 ml-2" />
                  <input 
                    type="text" 
                    placeholder="חיפוש חופשי..." 
                    onChange={(e) => setFilterDest(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-white text-xs w-full"
                  />
                </div>
            </div>
            
            <div className="text-[10px] text-blue-300 font-medium text-center">
               מציג תוצאות עבור: {getHebrewDateString(selectedDate)}
            </div>

          </div>

          <div className="flex mt-4 border-b border-white/10">
             <button 
                onClick={() => setActiveTab('app')}
                className={`flex-1 pb-2 text-sm font-bold transition-colors relative ${activeTab === 'app' ? 'text-blue-400' : 'text-gray-500'}`}
             >
                נסיעות ({loading ? '...' : rides.length})
                {activeTab === 'app' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
             </button>
             <button 
                onClick={() => setActiveTab('email')}
                className={`flex-1 pb-2 text-sm font-bold transition-colors relative ${activeTab === 'email' ? 'text-pink-400' : 'text-gray-500'}`}
             >
                מיילים
                {activeTab === 'email' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400" />}
             </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        
        {!currentUser ? (
          <Login />
        ) : (
          <>
             {/* FAB Mobile */}
             <div className="md:hidden grid grid-cols-2 gap-3 mb-4">
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  <Plus size={18} />
                  פרסם טרמפ
                </button>
                <div className="flex items-center justify-center gap-2 bg-slate-800 text-gray-400 p-3 rounded-xl font-bold text-sm border border-white/5">
                  <UserIcon size={18} />
                  {currentUser.name.split(' ')[0]}
                </div>
             </div>
             
             {/* Desktop Button */}
             <div className="hidden md:flex justify-end mb-4">
                 <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-blue-500/25"
                 >
                    <Plus size={18} />
                    פרסם נסיעה חדשה
                 </button>
             </div>

             {activeTab === 'app' ? (
                 <>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                       <>
                        {transportItems.length === 0 ? (
                            <div className="text-center py-20 opacity-50 flex flex-col items-center">
                                <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/10">
                                <MapPin size={32} className="text-gray-500" />
                                </div>
                                <p className="text-gray-400">לא נמצאו נסיעות בין השעות {timeRange.start} - {timeRange.end}.</p>
                            </div>
                        ) : (
                            <motion.div 
                                layout 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                            >
                                <AnimatePresence mode="popLayout">
                                {transportItems.map((item) => (
                                    <React.Fragment key={item.id}>
                                    {item.type === 'ride' ? (
                                        <RideCard 
                                            ride={item.data as Ride} 
                                            currentUserId={currentUser.id}
                                            onDelete={handleDeleteRide}
                                        />
                                    ) : (
                                        <BusCard 
                                            line={(item.data as any).line} 
                                            departureTime={(item.data as any).departureTime} 
                                        />
                                    )}
                                    </React.Fragment>
                                ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                       </>
                    )}
                 </>
             ) : (
                 <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-xs text-pink-200 bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                           כאן מוצגות בקשות שנשלחו לקבוצת המייל (דוגמה).
                        </p>
                        <button 
                          onClick={() => setShowEmailHelp(true)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white bg-white/5 px-2 py-1 rounded"
                        >
                          <Info size={10} />
                          מידע טכני
                        </button>
                    </div>

                    {filteredEmailRequests.length === 0 ? (
                       <div className="text-center py-10 text-gray-500">אין הודעות רלוונטיות מהמייל</div>
                    ) : (
                       filteredEmailRequests.map(req => (
                          <EmailFeedItem key={req.id} request={req} />
                       ))
                    )}
                 </div>
             )}
          </>
        )}

      </main>

      {showAddForm && currentUser && (
        <AddRideForm 
          onClose={() => setShowAddForm(false)} 
          currentUser={currentUser}
        />
      )}

      {showAlertsModal && (
        <AlertsModal onClose={() => setShowAlertsModal(false)} />
      )}

      {showEmailHelp && (
        <EmailSyncHelp onClose={() => setShowEmailHelp(false)} />
      )}
    </div>
  );
};

export default App;
