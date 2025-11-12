import { useState, useEffect, useCallback } from 'react';

// --- INTERFACES AND CONSTANTS ---
export interface Reward {
  id: number;
  icon: string;
  name: string;
  cost: number;
  unlocked: boolean;
}

const STAR_STORAGE_KEY = 'diabetesAppStars';
const REWARDS_STORAGE_KEY = 'diabetesAppRewards';
export const STAR_UPDATE_EVENT = 'starUpdate';

const initialRewards: Reward[] = [
  { id: 1, icon: '🌟', name: 'نجمة البداية', cost: 10, unlocked: false },
  { id: 2, icon: '💪', name: 'وسام القوة', cost: 25, unlocked: false },
  { id: 3, icon: '🍎', name: 'شارة الأكل الصحي', cost: 50, unlocked: false },
  { id: 4, icon: '🏆', name: 'كأس البطل', cost: 100, unlocked: false },
  { id: 5, icon: '🛡️', name: 'درع السكري', cost: 150, unlocked: false },
  { id: 6, icon: '💎', name: 'جوهرة الإلتزام', cost: 200, unlocked: false },
];

// --- HELPER FUNCTIONS ---
const dispatchStarUpdate = () => {
  window.dispatchEvent(new CustomEvent(STAR_UPDATE_EVENT));
};

export const getStars = (): number => {
  try {
    const stars = localStorage.getItem(STAR_STORAGE_KEY);
    // If it's the first time the user opens the app, stars will be null.
    // We initialize it to 0 and save it to ensure persistence.
    if (stars === null) {
      localStorage.setItem(STAR_STORAGE_KEY, '0');
      return 0;
    }
    return parseInt(stars, 10);
  } catch (e) {
    // In case of any error (e.g., corrupted data), reset to 0 for safety.
    localStorage.setItem(STAR_STORAGE_KEY, '0');
    return 0;
  }
};

export const addStars = (amount: number): number => {
  const currentStars = getStars();
  const newTotal = currentStars + amount;
  localStorage.setItem(STAR_STORAGE_KEY, newTotal.toString());
  dispatchStarUpdate();
  return newTotal;
};

export const spendStars = (amount: number): number => {
  const currentStars = getStars();
  const newTotal = Math.max(0, currentStars - amount);
  localStorage.setItem(STAR_STORAGE_KEY, newTotal.toString());
  dispatchStarUpdate();
  return newTotal;
};

export const getRewards = (): Reward[] => {
  try {
    const savedRewards = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (savedRewards) {
      const parsedRewards: Reward[] = JSON.parse(savedRewards);
      // Ensure all initial rewards are present
      const allRewards = initialRewards.map(initial => {
          const saved = parsedRewards.find(s => s.id === initial.id);
          return saved || initial;
      });
      return allRewards;
    }
    return initialRewards;
  } catch (e) {
    return initialRewards;
  }
};

export const unlockReward = (rewardId: number): Reward[] => {
  const currentRewards = getRewards();
  const updatedRewards = currentRewards.map(reward =>
    reward.id === rewardId ? { ...reward, unlocked: true } : reward
  );
  localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedRewards));
  return updatedRewards;
};

// --- CUSTOM HOOK ---
export const useStars = () => {
  const [stars, setStars] = useState<number>(getStars);

  const handleStarUpdate = useCallback(() => {
    setStars(getStars());
  }, []);

  useEffect(() => {
    window.addEventListener(STAR_UPDATE_EVENT, handleStarUpdate);
    return () => {
      window.removeEventListener(STAR_UPDATE_EVENT, handleStarUpdate);
    };
  }, [handleStarUpdate]);

  return stars;
};
