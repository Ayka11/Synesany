import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [userTier, setUserTier] = useState('free');
  const [dailySubmissions, setDailySubmissions] = useState(0);
  const [lastSubmissionDate, setLastSubmissionDate] = useState(null);

  const DAILY_LIMIT = {
    free: 15,
    pro: Infinity
  };

  const PRO_BRUSHES = ['star', 'triangle', 'cross', 'sawtooth', 'spray'];

  useEffect(() => {
    // Load subscription data from localStorage
    const savedTier = localStorage.getItem('synesthetica_tier');
    const savedSubmissions = localStorage.getItem('synesthetica_daily_submissions');
    const savedDate = localStorage.getItem('synesthetica_last_submission_date');

    if (savedTier) {
      setUserTier(savedTier);
    }

    const today = new Date().toDateString();
    
    if (savedDate === today) {
      setDailySubmissions(parseInt(savedSubmissions) || 0);
      setLastSubmissionDate(savedDate);
    } else {
      // Reset daily submissions if it's a new day
      setDailySubmissions(0);
      localStorage.setItem('synesthetica_daily_submissions', '0');
      localStorage.setItem('synesthetica_last_submission_date', today);
    }
  }, []);

  const upgradeToPro = useCallback(() => {
    setUserTier('pro');
    localStorage.setItem('synesthetica_tier', 'pro');
  }, []);

  const canSubmitDrawing = useCallback(() => {
    return dailySubmissions < DAILY_LIMIT[userTier];
  }, [dailySubmissions, userTier]);

  const incrementDailySubmissions = useCallback(() => {
    const newCount = dailySubmissions + 1;
    const today = new Date().toDateString();
    
    setDailySubmissions(newCount);
    setLastSubmissionDate(today);
    
    localStorage.setItem('synesthetica_daily_submissions', newCount.toString());
    localStorage.setItem('synesthetica_last_submission_date', today);
  }, [dailySubmissions]);

  const canUseBrush = useCallback((brushType) => {
    if (userTier === 'pro') return true;
    return !PRO_BRUSHES.includes(brushType);
  }, [userTier]);

  const getExportOptions = useCallback(() => {
    if (userTier === 'pro') {
      return ['mp3', 'wav', 'midi'];
    }
    return ['mp3'];
  }, [userTier]);

  const getStorageInfo = useCallback(() => {
    if (userTier === 'pro') {
      return {
        type: 'cloud',
        limit: '1GB',
        available: true
      };
    }
    return {
      type: 'local',
      limit: 'Unlimited',
      available: true
    };
  }, [userTier]);

  const value = {
    userTier,
    dailySubmissions,
    dailyLimit: DAILY_LIMIT[userTier],
    canSubmitDrawing,
    incrementDailySubmissions,
    canUseBrush,
    getExportOptions,
    getStorageInfo,
    upgradeToPro,
    proBrushes: PRO_BRUSHES
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
