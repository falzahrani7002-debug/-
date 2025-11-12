import React, { useState, useEffect, useCallback, useRef } from 'react';
import { addStars } from '../starManager';

// --- ICONS ---
const ChildIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 10c-3.87 0-7 1.57-7 3.5V19h14v-3.5c0-1.93-3.13-3.5-7-3.5z"/></svg>
);
const AdultIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
);
const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);


// Game 1: Catcher Game Types and Data
interface FoodItem {
  id: number;
  emoji: string;
  type: 'healthy' | 'unhealthy';
  x: number; // horizontal position percentage
  y: number; // vertical position (starts at -10)
  speed: number;
}
const healthyFoods = ['🍎', '🥦', '🥕', '🍓', '🍇', '🍗', '🥛'];
const unhealthyFoods = ['🍬', '🍭', '🍩', '🥤', '🍕', '🍟', '🍫'];

// Game 2: Chooser Game Types and Data
interface FoodChoice {
  emoji: string;
  name: string;
  isHealthy: boolean;
}
interface FoodPair {
  id: number;
  options: [FoodChoice, FoodChoice];
}
const foodPairs: FoodPair[] = [
  { id: 1, options: [{ emoji: '🍎', name: 'تفاحة', isHealthy: true }, { emoji: '🍩', name: 'دونات', isHealthy: false }] },
  { id: 2, options: [{ emoji: '🥦', name: 'بروكلي', isHealthy: true }, { emoji: '🍟', name: 'بطاطس مقلية', isHealthy: false }] },
  { id: 3, options: [{ emoji: '💧', name: 'ماء', isHealthy: true }, { emoji: '🥤', name: 'مشروب غازي', isHealthy: false }] },
  { id: 4, options: [{ emoji: '🥕', name: 'جزر', isHealthy: true }, { emoji: '🍫', name: 'شوكولاتة', isHealthy: false }] },
  { id: 5, options: [{ emoji: '🥖', name: 'خبز أسمر', isHealthy: true }, { emoji: '🍞', name: 'خبز أبيض', isHealthy: false }] },
  { id: 6, options: [{ emoji: '🍇', name: 'عنب', isHealthy: true }, { emoji: '🍬', name: 'حلوى', isHealthy: false }] },
  { id: 7, options: [{ emoji: '🍗', name: 'دجاج مشوي', isHealthy: true }, { emoji: '🌭', name: 'نقانق', isHealthy: false }] },
  { id: 8, options: [{ emoji: '🥛', name: 'حليب', isHealthy: true }, { emoji: '🧃', name: 'عصير معلب', isHealthy: false }] },
];
// Shuffle function for variety
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Catcher Game Component
const CatcherGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [fallingItems, setFallingItems] = useState<FoodItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const MAX_MISSED = 5;

  const createFallingItem = useCallback(() => {
    const isHealthy = Math.random() > 0.4;
    const foodList = isHealthy ? healthyFoods : unhealthyFoods;
    const newItem: FoodItem = {
      id: Date.now() + Math.random(),
      emoji: foodList[Math.floor(Math.random() * foodList.length)],
      type: isHealthy ? 'healthy' : 'unhealthy',
      x: Math.random() * 90,
      y: -10,
      speed: 0.5 + Math.random() * 0.5,
    };
    setFallingItems(prev => [...prev, newItem]);
  }, []);

  const startGame = () => {
    setScore(0);
    setMissed(0);
    setFallingItems([]);
    setGameActive(true);
    setGameOver(false);
  };

  useEffect(() => {
    if (!gameActive) return;
    const gameInterval = setInterval(() => {
      setFallingItems(prevItems =>
        prevItems
          .map(item => ({ ...item, y: item.y + item.speed }))
          .filter(item => {
            if (item.y > 110) {
              if (item.type === 'healthy') setMissed(m => m + 1);
              return false;
            }
            return true;
          })
      );
    }, 1000 / 60);
    const itemCreationInterval = setInterval(() => createFallingItem(), 1200);
    return () => {
      clearInterval(gameInterval);
      clearInterval(itemCreationInterval);
    };
  }, [gameActive, createFallingItem]);

  useEffect(() => {
    if (missed >= MAX_MISSED) {
      setGameActive(false);
      setGameOver(true);
    }
  }, [missed]);

  const handleItemClick = (item: FoodItem) => {
    if (!gameActive) return;
    if (item.type === 'healthy') setScore(s => s + 10);
    else setMissed(m => m + 1);
    setFallingItems(prev => prev.filter(f => f.id !== item.id));
  };

  return (
    <div className="bg-sky-50 p-6 rounded-2xl shadow-lg border-4 border-sky-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-3xl font-bold text-sky-900">لعبة: امسك الطعام الصحي</h3>
        <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
      </div>
      <p className="text-gray-700 mb-6">اضغط على الأطعمة الصحية لتجمع النقاط، وتجنب الأطعمة غير الصحية!</p>
      <div className="flex justify-around items-center bg-sky-100 p-4 rounded-lg mb-4">
        <div className="text-2xl font-bold text-green-600">النقاط: {score}</div>
        <div className="text-2xl font-bold text-red-600">الأخطاء: {missed} / {MAX_MISSED}</div>
      </div>
      <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-sky-200 to-sky-300 rounded-lg overflow-hidden shadow-inner">
        {fallingItems.map(item => (
          <div key={item.id} className="absolute text-4xl cursor-pointer select-none" style={{ left: `${item.x}%`, top: `${item.y}%`, transition: 'top 0.1s linear' }} onClick={() => handleItemClick(item)}>
            {item.emoji}
          </div>
        ))}
        {!gameActive && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-10">
            {gameOver ? (
              <>
                <h4 className="text-5xl font-bold text-white mb-4">انتهت اللعبة!</h4>
                <p className="text-2xl text-yellow-300 mb-6">نتيجتك النهائية: {score}</p>
              </>
            ) : (<h4 className="text-4xl font-bold text-white mb-4">هل أنت مستعد؟</h4>)}
            <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
              {gameOver ? 'العب مرة أخرى' : 'ابدأ اللعب'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Chooser Game Component
const ChooserGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [shuffledPairs, setShuffledPairs] = useState<FoodPair[]>([]);
    const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);

    const MAX_ROUNDS = 5;

    const startGame = () => {
        setScore(0);
        setRound(0);
        setShuffledPairs(shuffleArray([...foodPairs]).slice(0, MAX_ROUNDS));
        setGameState('playing');
        setFeedback(null);
    };

    const handleChoice = (choice: FoodChoice) => {
        if (gameState !== 'playing') return;

        if (choice.isHealthy) {
            setScore(s => s + 20);
            setFeedback({ message: 'رائع! اختيار صحي!', correct: true });
        } else {
            setFeedback({ message: 'أوه! حاول اختيار الطعام الآخر.', correct: false });
        }
        setGameState('feedback');

        setTimeout(() => {
            if (round + 1 >= MAX_ROUNDS) {
                setGameState('finished');
            } else {
                setRound(r => r + 1);
                setGameState('playing');
                setFeedback(null);
            }
        }, 2000);
    };
    
    const currentPair = shuffledPairs[round];

    return (
        <div className="bg-sky-50 p-6 rounded-2xl shadow-lg border-4 border-sky-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-sky-900">لعبة: الاختيار الصحيح</h3>
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
            </div>
            <p className="text-gray-700 mb-6">اختر الطعام الصحي بين الخيارين لتكسب النقاط!</p>

            {gameState !== 'idle' && (
                <div className="flex justify-around items-center bg-sky-100 p-4 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-green-600">النقاط: {score}</div>
                    <div className="text-2xl font-bold text-sky-600">الجولة: {Math.min(round + 1, MAX_ROUNDS)} / {MAX_ROUNDS}</div>
                </div>
            )}
            
            <div className="relative w-full min-h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-sky-200 to-sky-300 rounded-lg p-8 shadow-inner">
                {gameState === 'playing' && currentPair && (
                    <>
                        <h4 className="text-2xl font-bold text-sky-800 mb-8">أيُّهما أصح؟</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            {shuffleArray([...currentPair.options]).map((option, index) => (
                                <div key={index} onClick={() => handleChoice(option)} className="bg-white p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center">
                                    <div className="text-6xl mb-4">{option.emoji}</div>
                                    <h5 className="text-2xl font-bold text-gray-800">{option.name}</h5>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {gameState === 'feedback' && feedback && (
                     <div className="flex flex-col items-center justify-center text-center">
                        <div className={`text-6xl mb-4 ${feedback.correct ? 'animate-bounce' : 'animate-shake'}`}>
                            {feedback.correct ? '✅' : '❌'}
                        </div>
                        <h4 className={`text-3xl font-bold ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback.message}
                        </h4>
                    </div>
                )}
                {(gameState === 'idle' || gameState === 'finished') && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center z-10 rounded-lg">
                        {gameState === 'finished' ? (
                             <>
                                <h4 className="text-5xl font-bold text-white mb-4">أحسنت!</h4>
                                <p className="text-2xl text-yellow-300 mb-6">نتيجتك النهائية: {score}</p>
                             </>
                         ) : (
                             <h4 className="text-4xl font-bold text-white mb-4">هل أنت مستعد للتحدي؟</h4>
                         )}
                        <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                           {gameState === 'finished' ? 'العب مرة أخرى' : 'ابدأ اللعب'}
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes animate-shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } }
                .animate-shake { animation: animate-shake 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};


// Game 3: Needle Time Game
const NeedleTimeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'levelUp' | 'lost'>('idle');
    const [level, setLevel] = useState(1);
    const [timeLeft, setTimeLeft] = useState(5);
    const intervalRef = useRef<number | null>(null);

    const INITIAL_TIME = 5; // Start with 5 seconds
    const TIME_DECREMENT = 0.5; // Decrease by 0.5s each level
    const MINIMUM_TIME = 1.5; // Don't go below 1.5 seconds

    const calculateLevelTime = (currentLevel: number) => {
        return Math.max(MINIMUM_TIME, INITIAL_TIME - (currentLevel - 1) * TIME_DECREMENT);
    };

    const cleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    
    const startGame = () => {
        cleanup();
        setLevel(1);
        const levelTime = calculateLevelTime(1);
        setTimeLeft(levelTime);
        setGameState('playing');
    };

    const startNextLevel = () => {
        cleanup();
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const levelTime = calculateLevelTime(nextLevel);
        setTimeLeft(levelTime);
        setGameState('playing');
    };


    useEffect(() => {
        if (gameState === 'playing') {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0.01) {
                        setGameState('lost');
                        cleanup();
                        return 0;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }
        return cleanup;
    }, [gameState, level]);

    const handleGiveShot = () => {
        if (gameState !== 'playing') return;
        cleanup();
        setGameState('levelUp');
        setTimeout(() => {
            startNextLevel();
        }, 1500);
    };

    const totalTimeForLevel = calculateLevelTime(level);
    const progress = (timeLeft / totalTimeForLevel) * 100;
    const progressColor = progress > 50 ? 'bg-green-500' : progress > 25 ? 'bg-yellow-500' : 'bg-red-500';

    return (
         <div className="bg-sky-50 p-6 rounded-2xl shadow-lg border-4 border-sky-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-sky-900">لعبة: وقت الإبرة</h3>
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
            </div>
            <p className="text-gray-700 mb-6">صديقك نسي أن يأخذ الإنسولين! ساعده بسرعة قبل أن يرتفع السكر.</p>
            
            <div className="relative w-full min-h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-sky-200 to-sky-300 rounded-lg p-8 shadow-inner">
                {gameState === 'playing' ? (
                    <div className="w-full flex flex-col items-center">
                        <div className="text-2xl font-bold text-sky-700 mb-2">المرحلة: {level}</div>
                        <div className="text-8xl mb-4">{timeLeft > totalTimeForLevel / 2 ? '👧' : '😟'}</div>
                        <p className="text-2xl font-bold text-sky-800 mb-4">الوقت يمر بسرعة!</p>
                        <div className="w-full bg-gray-300 rounded-full h-8 mb-6 shadow-inner">
                            <div className={`${progressColor} h-8 rounded-full transition-all duration-100 ease-linear`} style={{ width: `${progress}%` }}></div>
                        </div>
                        <button onClick={handleGiveShot} className="bg-sky-600 text-white font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-110 duration-300">
                            أعطِ الإبرة 💉
                        </button>
                    </div>
                ) : (
                     <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-10 rounded-lg text-center p-4">
                        {gameState === 'idle' && (
                             <>
                                <h4 className="text-4xl font-bold text-white mb-4">هل أنت مستعد للمساعدة؟</h4>
                                <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                                   ابدأ
                                </button>
                             </>
                        )}
                        {gameState === 'levelUp' && (
                             <>
                                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                                <h4 className="text-4xl font-bold text-green-300 mb-4">رائع! إلى المرحلة التالية!</h4>
                             </>
                        )}
                        {gameState === 'lost' && (
                             <>
                                 <div className="text-6xl mb-4">😥</div>
                                <h4 className="text-4xl font-bold text-red-300 mb-4">لقد تأخرت! سكري يرتفع!</h4>
                                <p className="text-2xl text-white mb-6">لقد وصلت إلى المرحلة {level}</p>
                                <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                                   حاول مرة أخرى
                                </button>
                             </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Game 4: Star Collector Game
const StarCollectorGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [items, setItems] = useState<{ id: number; emoji: string; type: 'star' | 'bomb'; x: number; y: number }[]>([]);

    const gameIntervalRef = useRef<number | null>(null);
    const spawnIntervalRef = useRef<number | null>(null);

    const cleanupIntervals = useCallback(() => {
        if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
        if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
        gameIntervalRef.current = null;
        spawnIntervalRef.current = null;
    }, []);

    const startGame = useCallback(() => {
        setScore(0);
        setTimeLeft(30);
        setItems([]);
        setGameState('playing');
    }, []);

    useEffect(() => {
        if (gameState === 'playing') {
            gameIntervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        cleanupIntervals();
                        setGameState('finished');
                        // Use a callback for setScore to ensure we have the latest value
                        setScore(currentScore => {
                            if (currentScore > 0) {
                                addStars(currentScore);
                            }
                            return currentScore;
                        });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            spawnIntervalRef.current = window.setInterval(() => {
                const isStar = Math.random() < 0.8; // 80% chance for a star
                const newItem = {
                    id: Date.now() + Math.random(),
                    emoji: isStar ? '⭐' : '💣',
                    // Fix: Add a type assertion to prevent TypeScript from widening the type to a generic string.
                    type: (isStar ? 'star' : 'bomb') as 'star' | 'bomb',
                    x: Math.random() * 90,
                    y: Math.random() * 90,
                };
                setItems(prev => [...prev.slice(-10), newItem]);
            }, 700);
        }

        return cleanupIntervals;
    }, [gameState, cleanupIntervals, startGame]);

    const handleItemClick = (id: number, type: 'star' | 'bomb') => {
        if (gameState !== 'playing') return;
        if (type === 'star') {
            setScore(s => s + 1);
        } else {
            setScore(s => Math.max(0, s - 5));
        }
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="bg-yellow-50 p-6 rounded-2xl shadow-lg border-4 border-yellow-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-yellow-900">لعبة: تجميع النجوم</h3>
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
            </div>
            <p className="text-gray-700 mb-6">اجمع النجوم بسرعة! لكن احذر من القنابل، فهي ستخصم من نقاطك!</p>
            <div className="flex justify-around items-center bg-yellow-100 p-4 rounded-lg mb-4">
                <div className="text-2xl font-bold text-yellow-800">⭐ النجوم: {score}</div>
                <div className="text-2xl font-bold text-sky-600">⏰ الوقت: {timeLeft}</div>
            </div>
            <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-sky-800 to-black rounded-lg overflow-hidden shadow-inner cursor-pointer">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="absolute text-5xl select-none transition-transform transform hover:scale-125"
                        style={{ left: `${item.x}%`, top: `${item.y}%`, animation: 'appear 0.3s ease-out' }}
                        onClick={() => handleItemClick(item.id, item.type)}
                    >
                        {item.emoji}
                    </div>
                ))}
                {gameState !== 'playing' && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-10 text-center">
                        {gameState === 'finished' ? (
                            <>
                                <h4 className="text-5xl font-bold text-white mb-4">انتهى الوقت!</h4>
                                <p className="text-2xl text-yellow-300 mb-2">لقد جمعت {score} نجمة!</p>
                                <p className="text-lg text-white mb-6">تمت إضافة النجوم إلى رصيدك.</p>
                            </>
                        ) : (
                            <h4 className="text-4xl font-bold text-white mb-4">هل أنت مستعد للتحدي؟</h4>
                        )}
                        <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                            {gameState === 'finished' ? 'العب مرة أخرى' : 'ابدأ اللعب'}
                        </button>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes appear { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

// --- ADULTS GAMES ---

// Carb Counting Game Data and Component
interface CarbQuestion {
    name: string;
    icon: string;
    options: number[];
    correctAnswer: number;
    explanation: string;
}

const carbQuestions: CarbQuestion[] = [
    { name: "تفاحة متوسطة", icon: '🍎', options: [5, 15, 30], correctAnswer: 15, explanation: "تفاحة متوسطة تحتوي عادة على حوالي 15 جرامًا من الكربوهيدرات." },
    { name: "شريحة خبز أبيض", icon: '🍞', options: [15, 25, 40], correctAnswer: 15, explanation: "شريحة واحدة من الخبز الأبيض تحتوي على ما يقارب 15 جرامًا من الكربوهيدرات." },
    { name: "كوب حليب (240 مل)", icon: '🥛', options: [12, 20, 35], correctAnswer: 12, explanation: "كوب واحد من الحليب يحتوي عادة على حوالي 12 جرامًا من الكربوهيدرات." },
    { name: "موزة صغيرة", icon: '🍌', options: [10, 20, 30], correctAnswer: 20, explanation: "موزة صغيرة تحتوي على حوالي 20 جرامًا من الكربوهيدرات." },
    { name: "نصف كوب أرز مطبوخ", icon: '🍚', options: [10, 22, 45], correctAnswer: 22, explanation: "نصف كوب من الأرز المطبوخ يحتوي على ما يقارب 22 جرامًا من الكربوهيدرات." },
    { name: "علبة زبيب صغيرة", icon: '🍇', options: [15, 30, 50], correctAnswer: 15, explanation: "علبة صغيرة من الزبيب (حوالي 30 جرام) تحتوي على 15 جرامًا من الكربوهيدرات." },
    { name: "نصف كوب معكرونة مطبوخة", icon: '🍝', options: [10, 20, 40], correctAnswer: 20, explanation: "نصف كوب من المعكرونة المطبوخة يحتوي على حوالي 20 جرامًا من الكربوهيدرات." },
];

const CarbCountingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
    const [questions, setQuestions] = useState<CarbQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const startGame = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuestions(shuffleArray([...carbQuestions]));
        setGameState('playing');
        setSelectedAnswer(null);
    };

    const handleAnswer = (answer: number) => {
        if (gameState !== 'playing') return;
        
        setSelectedAnswer(answer);
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(s => s + 1);
        }
        setGameState('feedback');

        setTimeout(() => {
            if (currentQuestionIndex + 1 >= questions.length) {
                setGameState('finished');
            } else {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedAnswer(null);
                setGameState('playing');
            }
        }, 3000);
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border-4 border-blue-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-blue-900">لعبة: خبير حساب الكربوهيدرات</h3>
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
            </div>
            <p className="text-gray-700 mb-6">تدرب على تقدير الكربوهيدرات في الأطعمة الشائعة. مهارة أساسية لإدارة السكري!</p>

            {gameState !== 'idle' && (
                 <div className="flex justify-around items-center bg-blue-100 p-4 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-green-600">النتيجة: {score} / {questions.length}</div>
                    <div className="text-2xl font-bold text-blue-600">السؤال: {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}</div>
                </div>
            )}
            
            <div className="relative w-full min-h-[400px] flex flex-col justify-center items-center bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg p-8 shadow-inner">
                 {(gameState === 'idle' || gameState === 'finished') ? (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-10 rounded-lg text-center p-4">
                        {gameState === 'finished' ? (
                            <>
                               <h4 className="text-5xl font-bold text-white mb-4">أنهيت اللعبة!</h4>
                               <p className="text-2xl text-yellow-300 mb-6">نتيجتك النهائية: {score} من {questions.length}</p>
                            </>
                        ) : (
                            <h4 className="text-4xl font-bold text-white mb-4">هل أنت مستعد لاختبار معرفتك؟</h4>
                        )}
                       <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                          {gameState === 'finished' ? 'العب مرة أخرى' : 'ابدأ'}
                       </button>
                   </div>
                 ) : (
                    currentQuestion && (
                        <div className="w-full text-center">
                            <div className="text-7xl mb-4">{currentQuestion.icon}</div>
                            <h4 className="text-2xl font-bold text-blue-800 mb-6">كم جرامًا من الكربوهيدرات في "{currentQuestion.name}"؟</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {currentQuestion.options.map(option => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrect = currentQuestion.correctAnswer === option;
                                    let buttonClass = 'bg-white hover:bg-blue-100 text-gray-600';
                                    if (gameState === 'feedback') {
                                        if (isCorrect) {
                                            buttonClass = 'bg-green-200 text-green-800';
                                        } else if (isSelected && !isCorrect) {
                                            buttonClass = 'bg-red-200 text-red-800';
                                        } else {
                                            buttonClass = 'bg-gray-100 text-gray-500 opacity-70';
                                        }
                                    }
                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswer(option)}
                                            disabled={gameState === 'feedback'}
                                            className={`p-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center h-32 ${buttonClass}`}
                                        >
                                            <span className="text-4xl font-extrabold text-amber-600" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                                                {option}
                                            </span>
                                            <span className="text-md mt-1 font-semibold text-amber-600">جرام</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {gameState === 'feedback' && (
                                <div className="mt-6 p-4 bg-yellow-100 border-r-4 border-yellow-400 rounded">
                                    <p className="font-semibold text-yellow-800">💡 معلومة: <span className="font-normal">{currentQuestion.explanation}</span></p>
                                </div>
                            )}
                        </div>
                    )
                 )}
            </div>
        </div>
    );
};

interface Scenario {
    title: string;
    icon: string;
    text: string;
    choices: { text: string; correct: boolean, feedback: string }[];
}

const scenarios: Scenario[] = [
    {
        title: "الموقف المحرج",
        icon: '😳',
        text: "أنت في اجتماع عمل مهم. فجأة، بدأت تشعر بعطش شديد، وعدم وضوح في الرؤية. تذكرت أنك نسيت أخذ جرعة الأنسولين قبل الغداء. ماذا تفعل؟",
        choices: [
            { text: "أتجاهل الأمر وأتحمل حتى ينتهي الاجتماع.", correct: false, feedback: "هذا قد يكون خطيرًا! تجاهل ارتفاع السكر الشديد يمكن أن يؤدي إلى مضاعفات. صحتك تأتي أولاً دائمًا." },
            { text: "أستأذن بهدوء، أفحص السكر وآخذ جرعة، ثم أعود.", correct: true, feedback: "تصرف حكيم! إدارة الموقف بهدوء ووضع صحتك أولاً هو التصرف الصحيح والمسؤول." },
            { text: "أغادر الاجتماع فورًا دون تفسير.", correct: false, feedback: "قد يحل هذا المشكلة الصحية مؤقتًا، ولكنه قد يبدو غير مهني. من الأفضل دائمًا الاستئذان أولاً." },
        ]
    },
    {
        title: "ورطة المطعم",
        icon: '🍽️',
        text: "أنت في مطعم مع أصدقائك. الجميع يطلب أطباقًا غنية بالكربوهيدرات والحلويات. أنت تشعر بالضغط لتشاركهم، لكنك تعلم أن هذا سيعبث بمستوى سكرك. ماذا تفعل؟",
        choices: [
            { text: "أطلب نفس ما طلبوه؛ لا أريد أن أكون مختلفًا.", correct: false, feedback: "قد يكون هذا محرجًا، لكن صحتك أهم. طلب ما يناسبك هو علامة على القوة والوعي." },
            { text: "أبحث في القائمة عن خيار صحي وأطلبه بثقة.", correct: true, feedback: "ممتاز! اختيارك يدل على تحكمك وفهمك. يمكنك الاستمتاع بوقتك مع الحفاظ على صحتك." },
            { text: "أختلق عذرًا وأقول إنني لست جائعًا.", correct: false, feedback: "تجنب الموقف ليس حلاً. من المهم أن تتعلم كيف تتعامل مع هذه المواقف الاجتماعية بثقة." },
        ]
    },
    {
        title: "هبوط أثناء الرياضة",
        icon: '🏃‍♂️',
        text: "أنت في منتصف تمرين رياضي جيد. فجأة، بدأت تشعر بالرجفة، والتعرق البارد، والارتباك - علامات انخفاض السكر. ماذا تفعل؟",
        choices: [
            { text: "أتجاهل الأمر وأكمل التمرين؛ لا أريد أن أضيع مجهودي.", correct: false, feedback: "خطير جدًا! الاستمرار في التمرين مع انخفاض السكر يمكن أن يؤدي إلى فقدان الوعي. توقف فورًا." },
            { text: "أتوقف فورًا، وأتناول مصدر سكر سريع (مثل التمر)، وأرتاح.", correct: true, feedback: "تصرف مثالي! لقد استمعت لجسدك وتصرفت بسرعة وأمان. هذه هي الطريقة الصحيحة للتعامل مع انخفاض السكر." },
            { text: "أبطئ من سرعة التمرين وأنتظر حتى يزول الشعور.", correct: false, feedback: "قد لا يكون هذا كافيًا. انخفاض السكر يتطلب علاجًا فوريًا بمصدر سكر سريع، وليس فقط تقليل المجهود." },
        ]
    }
];

const EmbarrassingSituationGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'finished'>('idle');
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<{ message: string; correct: boolean } | null>(null);

    const startGame = () => {
        setCurrentScenarioIndex(0);
        setScore(0);
        setFeedback(null);
        setGameState('playing');
    };
    
    const handleChoice = (choice: { correct: boolean, feedback: string }) => {
        if (gameState !== 'playing') return;
        
        if (choice.correct) {
            setScore(prev => prev + 1);
        }
        setFeedback({ message: choice.feedback, correct: choice.correct });
        setGameState('feedback');
    };

    const handleNext = () => {
        if (currentScenarioIndex + 1 >= scenarios.length) {
            setGameState('finished');
        } else {
            setCurrentScenarioIndex(prev => prev + 1);
            setFeedback(null);
            setGameState('playing');
        }
    };

    const currentScenario = scenarios[currentScenarioIndex];

    return (
        <div className="bg-blue-50 p-6 rounded-2xl shadow-lg border-4 border-blue-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-blue-900">لعبة: مواقف واقعية</h3>
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"> <BackIcon className="w-5 h-5"/> عودة</button>
            </div>
             <div className="relative w-full min-h-[450px] flex flex-col justify-center items-center bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg p-8 shadow-inner">
                {gameState === 'idle' && (
                    <div className="text-center">
                        <div className="text-7xl mb-4">🧠</div>
                        <h4 className="text-2xl font-bold text-blue-800 mb-6">تعلم كيف تتصرف في المواقف الصعبة.</h4>
                        <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-110 duration-300">
                            ابدأ اللعبة
                        </button>
                    </div>
                )}
                 {gameState === 'finished' && (
                    <div className="text-center">
                        <div className="text-7xl mb-4">🏆</div>
                         <h4 className="text-4xl font-bold text-white mb-4">أحسنت!</h4>
                         <p className="text-2xl text-yellow-300 mb-6">نتيجتك: {score} من {scenarios.length} إجابات صحيحة</p>
                        <button onClick={startGame} className="bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-yellow-500">
                            العب مرة أخرى
                        </button>
                    </div>
                )}
                {gameState === 'playing' && currentScenario && (
                    <div className="w-full text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">الموقف {currentScenarioIndex + 1} من {scenarios.length}</div>
                        <h4 className="text-2xl font-bold text-blue-800 mb-4">{currentScenario.title} {currentScenario.icon}</h4>
                        <p className="text-lg text-blue-900 leading-relaxed mb-8">{currentScenario.text}</p>
                        <div className="space-y-4">
                            {currentScenario.choices.map((choice, index) => (
                                <button key={index} onClick={() => handleChoice(choice)} className="w-full text-lg bg-white font-semibold text-gray-800 p-4 rounded-lg shadow hover:bg-blue-100 transition-colors duration-300">
                                    {choice.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {gameState === 'feedback' && feedback && (
                    <div className="text-center">
                        <div className={`text-6xl mb-4 ${feedback.correct ? 'animate-bounce' : ''}`}>{feedback.correct ? '✅' : '❌'}</div>
                        <h4 className={`text-3xl font-bold mb-4 ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>{feedback.correct ? "تصرف صحيح!" : "فكر مرة أخرى!"}</h4>
                        <p className="text-lg text-blue-900 mb-8 max-w-md mx-auto">{feedback.message}</p>
                        <button onClick={handleNext} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:bg-sky-700">
                            {currentScenarioIndex + 1 >= scenarios.length ? 'إنهاء اللعبة' : 'الموقف التالي'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// Main Section Component
const GamesSection: React.FC = () => {
    const [view, setView] = useState<'main' | 'kids' | 'adults'>('main');
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const renderGameSelection = () => {
        if (view === 'kids') {
            if (selectedGame === 'catcher') return <CatcherGame onBack={() => setSelectedGame(null)} />;
            if (selectedGame === 'chooser') return <ChooserGame onBack={() => setSelectedGame(null)} />;
            if (selectedGame === 'needle') return <NeedleTimeGame onBack={() => setSelectedGame(null)} />;
            if (selectedGame === 'starCollector') return <StarCollectorGame onBack={() => setSelectedGame(null)} />;
            
            return (
                 <div>
                    <button onClick={() => setView('main')} className="mb-8 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
                         <BackIcon className="w-5 h-5"/> العودة إلى الأقسام
                    </button>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div onClick={() => setSelectedGame('catcher')} className="bg-sky-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-sky-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                            <div className="text-6xl mb-4">🖐️</div>
                            <h3 className="text-3xl font-bold text-sky-900 mb-2">امسك الطعام الصحي</h3>
                            <p className="text-gray-700">لعبة سريعة تحتاج لتركيز! امسك الفواكه والخضروات وتجنب الحلويات.</p>
                        </div>
                        <div onClick={() => setSelectedGame('chooser')} className="bg-sky-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-sky-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                             <div className="text-6xl mb-4">🤔</div>
                            <h3 className="text-3xl font-bold text-sky-900 mb-2">الاختيار الصحيح</h3>
                            <p className="text-gray-700">اختبر معلوماتك! اختر الطعام الأفضل لصحتك بين خيارين.</p>
                        </div>
                        <div onClick={() => setSelectedGame('needle')} className="bg-sky-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-sky-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                             <div className="text-6xl mb-4">💉</div>
                            <h3 className="text-3xl font-bold text-sky-900 mb-2">وقت الإبرة</h3>
                            <p className="text-gray-700">ساعد صديقك في أخذ الإنسولين في الوقت المناسب ليبقى قوياً ونشيطاً.</p>
                        </div>
                        <div onClick={() => setSelectedGame('starCollector')} className="bg-yellow-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-yellow-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                             <div className="text-6xl mb-4">⭐</div>
                            <h3 className="text-3xl font-bold text-yellow-900 mb-2">تجميع النجوم</h3>
                            <p className="text-gray-700">لعبة سريعة وصعبة! اجمع النجوم لزيادة رصيدك، لكن احذر من القنابل!</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (view === 'adults') {
            if (selectedGame === 'nutrition') return <CarbCountingGame onBack={() => setSelectedGame(null)} />;
            if (selectedGame === 'embarrassing') return <EmbarrassingSituationGame onBack={() => setSelectedGame(null)} />;
             return (
                 <div>
                    <button onClick={() => setView('main')} className="mb-8 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
                         <BackIcon className="w-5 h-5"/> العودة إلى الأقسام
                    </button>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div onClick={() => setSelectedGame('nutrition')} className="bg-blue-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-blue-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                            <div className="text-6xl mb-4">🥗</div>
                            <h3 className="text-3xl font-bold text-blue-900 mb-2">خبير التغذية</h3>
                            <p className="text-gray-700">اختبر معلوماتك في حساب الكربوهيدرات واتخاذ قرارات غذائية معقدة.</p>
                        </div>
                        <div onClick={() => setSelectedGame('embarrassing')} className="bg-blue-50 p-8 rounded-2xl shadow-lg border-4 border-transparent hover:border-blue-400 cursor-pointer transition-all duration-300 flex flex-col items-center">
                             <div className="text-6xl mb-4">😳</div>
                            <h3 className="text-3xl font-bold text-blue-900 mb-2">مواقف واقعية</h3>
                            <p className="text-gray-700">تعامل مع مواقف يومية لإدارة السكري، مثل أيام المرض أو المناسبات الخاصة.</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Main view for selecting a category
        return (
            <div className="grid md:grid-cols-2 gap-12">
                <div onClick={() => setView('kids')} className="bg-gradient-to-br from-sky-100 to-sky-200 p-10 rounded-3xl shadow-xl border-4 border-transparent hover:border-sky-400 cursor-pointer transition-all duration-300 flex flex-col items-center transform hover:scale-105">
                    <ChildIcon className="w-24 h-24 text-sky-600 mb-4" />
                    <h3 className="text-4xl font-bold text-sky-900 mb-2">قسم الصغار</h3>
                    <p className="text-gray-700 text-lg">ألعاب ممتعة وتفاعلية لتعليم أبطالنا الصغار أساسيات السكري.</p>
                </div>
                <div onClick={() => setView('adults')} className="bg-gradient-to-br from-blue-100 to-blue-200 p-10 rounded-3xl shadow-xl border-4 border-transparent hover:border-blue-400 cursor-pointer transition-all duration-300 flex flex-col items-center transform hover:scale-105">
                    <AdultIcon className="w-24 h-24 text-blue-600 mb-4" />
                    <h3 className="text-4xl font-bold text-blue-900 mb-2">قسم الكبار</h3>
                    <p className="text-gray-700 text-lg">ألعاب تعليمية متقدمة لمساعدة أولياء الأمور على فهم أعمق لإدارة السكري.</p>
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-white py-16 px-4">
            <div className="container mx-auto max-w-5xl text-center">
                <h2 className="text-4xl font-bold text-sky-800 mb-4">ألعاب السكر الممتعة!</h2>
                <p className="text-lg text-gray-600 mb-12">العب وتعلم كيف تكون بطلاً في التحكم بالسكري.</p>
                {renderGameSelection()}
            </div>
        </div>
    );
};

export default GamesSection;