import React, { useState, useEffect, useCallback, useRef } from 'react';
import { addStars } from '../starManager';

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
        <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">العودة</button>
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
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">العودة</button>
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
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">العودة</button>
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
                <button onClick={onBack} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">العودة</button>
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


// Main Section Component
const GamesSection: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<'catcher' | 'chooser' | 'needle' | 'starCollector' | null>(null);

    const renderGame = () => {
        switch (selectedGame) {
            case 'catcher':
                return <CatcherGame onBack={() => setSelectedGame(null)} />;
            case 'chooser':
                return <ChooserGame onBack={() => setSelectedGame(null)} />;
            case 'needle':
                return <NeedleTimeGame onBack={() => setSelectedGame(null)} />;
            case 'starCollector':
                return <StarCollectorGame onBack={() => setSelectedGame(null)} />;
            default:
                return (
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
                );
        }
    };
    
    return (
        <div className="bg-white py-16 px-4 text-center">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-4xl font-bold text-sky-800 mb-4">ألعاب السكر الممتعة!</h2>
                <p className="text-lg text-gray-600 mb-12">العب وتعلم كيف تكون بطلاً في التحكم بالسكري.</p>
                {renderGame()}
            </div>
        </div>
    );
};

export default GamesSection;