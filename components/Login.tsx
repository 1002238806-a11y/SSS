
import React from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  
  const handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        // The auth state listener in App.tsx will handle the rest
    } catch (error) {
        console.error("Login failed:", error);
        alert("ההתחברות נכשלה. אנא נסה שנית.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center max-w-sm text-center shadow-2xl backdrop-blur-md"
      >
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-300">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">ברוכים הבאים</h2>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
           כדי לראות ולפרסם נסיעות, עליך להתחבר באמצעות חשבון Google שלך.
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-lg shadow-white/10"
        >
          <span>התחבר עם Google</span>
        </button>
        
        <p className="text-[10px] text-gray-500 mt-6">
          אנו משתמשים בפרטים שלך רק לצורך זיהוי במערכת.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
