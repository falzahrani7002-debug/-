import React, { useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { addStars } from '../starManager';

// Types for selections
type Mood = 'happy' | 'neutral' | 'sad';
type Food = 'healthy' | 'soso' | 'sweets';
type Insulin = 'yes' | 'no';

// Data for questions
const moodOptions: { type: Mood; icon: string; label: string }[] = [
    { type: 'happy', icon: '😊', label: 'سعيد' },
    { type: 'neutral', icon: '😐', label: 'عادي' },
    { type: 'sad', icon: '😢', label: 'حزين' },
];

const foodOptions: { type: Food; icon: string; label: string }[] = [
    { type: 'healthy', icon: '🥦', label: 'صحي' },
    { type: 'soso', icon: '🥪', label: 'وسط' },
    { type: 'sweets', icon: '🍰', label: 'حلويات' },
];

const insulinOptions: { type: Insulin; icon: string; label: string }[] = [
    { type: 'yes', icon: '👍', label: 'نعم' },
    { type: 'no', icon: '👎', label: 'لا' },
];

const MyJourneySection: React.FC = () => {
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [selectedInsulin, setSelectedInsulin] = useState<Insulin | null>(null);
    const [feedback, setFeedback] = useState<{ message: string; icon: string } | null>(null);
    const [hasLoggedToday, setHasLoggedToday] = useState(false);

    const getTodayDateString = () => new Date().toISOString().split('T')[0];

    // Load logs from localStorage and check if today's log exists
    useEffect(() => {
        try {
            const savedLogs = localStorage.getItem('diabetesJourneyLogs');
            const parsedLogs: DailyLog[] = savedLogs ? JSON.parse(savedLogs) : [];
            setLogs(parsedLogs);
            
            const todayDate = getTodayDateString();
            const todayLogExists = parsedLogs.some(log => log.date === todayDate);
            if (todayLogExists) {
                setHasLoggedToday(true);
            }
        } catch (error) {
            console.error("Failed to load logs from localStorage", error);
        }
    }, []);

    const handleSubmit = () => {
        if (!selectedMood || !selectedFood || !selectedInsulin) return;

        const todayDate = getTodayDateString();
        const newLog: DailyLog = {
            date: todayDate,
            mood: selectedMood,
            food: selectedFood,
            insulin: selectedInsulin,
        };

        const updatedLogs = [...logs, newLog];
        setLogs(updatedLogs);
        localStorage.setItem('diabetesJourneyLogs', JSON.stringify(updatedLogs));

        // Determine feedback
        if (selectedInsulin === 'yes' && (selectedFood === 'healthy' || selectedFood === 'soso')) {
            setFeedback({ message: 'ممتاز يا بطل 💪 سكّرك اليوم متوازن، استمر كذا!', icon: '🌟' });
        } else {
            setFeedback({ message: 'ما عليه، بكرة بتكون أقوى 🌟 حاول تختار أكل صحي أكثر وتلتزم بجرعتك.', icon: '❤️' });
        }
        
        // Add stars and notify user
        addStars(10);
        alert('رائع! لقد حصلت على 10 نجوم ⭐ لمشاركتك اليوم!');

        setHasLoggedToday(true);
    };

    const isSubmitDisabled = !selectedMood || !selectedFood || !selectedInsulin;
    
    // Weekly progress logic
    const today = new Date();
    const weekLogs = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        const log = logs.find(l => l.date === dateString);
        return { date: d.toLocaleDateString('ar-SA', { weekday: 'short' }), log };
    }).reverse();
    
    const loggedInLast7Days = weekLogs.filter(day => day.log).length;
    const hasWeeklyBadge = loggedInLast7Days >= 7;

    return (
        <div className="bg-gradient-to-br from-sky-50 to-blue-100 py-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">رحلتي مع السكّر 🩵</h2>
                    <p className="text-lg text-gray-600">سجّل مغامرتك اليومية وكن بطل السكر كل يوم!</p>
                </div>

                {hasLoggedToday ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                        {feedback ? (
                             <div className="flex flex-col items-center">
                                <div className="text-6xl mb-4 animate-bounce">{feedback.icon}</div>
                                <h3 className="text-3xl font-bold text-sky-800 mb-4">{feedback.message}</h3>
                                <p className="text-gray-600">شكرًا لك على تسجيل يومك! نراك غدًا في مغامرة جديدة.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-3xl font-bold text-sky-800 mb-4">شكرًا لك!</h3>
                                <p className="text-gray-600">لقد سجلت يومك بنجاح. أنت بطل حقيقي!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        {/* Mood Question */}
                        <div>
                            <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">😄 كيف كان مزاجك اليوم؟</h3>
                            <div className="flex justify-center gap-4">
                                {moodOptions.map(option => (
                                    <button key={option.type} onClick={() => setSelectedMood(option.type)} className={`flex flex-col items-center p-4 rounded-lg border-4 transition-all duration-300 w-28 h-28 justify-center ${selectedMood === option.type ? 'border-sky-500 bg-sky-100 scale-110' : 'border-gray-200 bg-gray-50'}`}>
                                        <span className="text-4xl">{option.icon}</span>
                                        <span className="font-semibold text-gray-700 mt-1">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Food Question */}
                        <div>
                            <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">🍽️ وش أكلت؟</h3>
                            <div className="flex justify-center gap-4">
                                {foodOptions.map(option => (
                                    <button key={option.type} onClick={() => setSelectedFood(option.type)} className={`flex flex-col items-center p-4 rounded-lg border-4 transition-all duration-300 w-28 h-28 justify-center ${selectedFood === option.type ? 'border-sky-500 bg-sky-100 scale-110' : 'border-gray-200 bg-gray-50'}`}>
                                        <span className="text-4xl">{option.icon}</span>
                                        <span className="font-semibold text-gray-700 mt-1">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Insulin Question */}
                        <div>
                            <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">💉 هل أخذت جرعتك؟</h3>
                            <div className="flex justify-center gap-4">
                                {insulinOptions.map(option => (
                                    <button key={option.type} onClick={() => setSelectedInsulin(option.type)} className={`flex flex-col items-center p-4 rounded-lg border-4 transition-all duration-300 w-28 h-28 justify-center ${selectedInsulin === option.type ? 'border-sky-500 bg-sky-100 scale-110' : 'border-gray-200 bg-gray-50'}`}>
                                        <span className="text-4xl">{option.icon}</span>
                                        <span className="font-semibold text-gray-700 mt-1">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full bg-sky-600 text-white font-bold py-4 px-4 rounded-lg text-xl hover:bg-sky-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            سجّل يومي!
                        </button>
                    </div>
                )}
                
                {/* Weekly Progress */}
                <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-sky-900 mb-6 text-center">تقدمك الأسبوعي</h3>
                    <div className="flex justify-around items-center">
                        {weekLogs.map((day, index) => (
                            <div key={index} className="flex flex-col items-center gap-y-2">
                                <span className="font-bold text-gray-600">{day.date}</span>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${day.log ? 'bg-sky-200' : 'bg-gray-200'}`}>
                                    {day.log ? moodOptions.find(m => m.type === day.log.mood)?.icon : '?'}
                                </div>
                            </div>
                        ))}
                    </div>
                    {hasWeeklyBadge && (
                        <div className="mt-8 text-center bg-yellow-100 border-2 border-yellow-300 p-4 rounded-lg">
                            <span className="text-5xl">🩵</span>
                            <p className="text-xl font-bold text-yellow-800 mt-2">لقد حصلت على "شارة بطل السكر" لهذا الأسبوع! استمر في هذا العمل الرائع!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyJourneySection;