
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../firebaseConfig';

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
        console.error("Login failed:", error);
        alert("ההתחברות נכשלה. אנא נסה שנית.");
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
              <span>מחכה...</span>
            </>
          ) : (
            <span>התחבר עם Google</span>
          )}
        </button>
        
        <p className="text-[10px] text-gray-500 mt-6">
          אנו משתמשים בפרטים שלך רק לצורך זיהוי במערכת.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
