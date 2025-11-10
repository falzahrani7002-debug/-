import React, { useState, useEffect } from 'react';

// --- ICONS ---
const CheckmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.2 6c.1.5-.2 1-.7 1.1l-2.4.5c-.3.1-.5.3-.6.6l-.8 2.2c-.2.5-.8.8-1.3.6l-2.3-.9c-.3-.1-.6-.1-.9 0l-2.3.9c-.5.2-1.1-.1-1.3-.6l-.8-2.2c-.1-.3-.3-.5-.6-.6l-2.4-.5c-.5-.1-.8-.6-.7-1.1l.4-2.1c.1-.3.3-.6.6-.8l1.8-1.3c.4-.3 1-.3 1.4 0l1.8 1.3c.3.2.5.5.6.8l.4 2.1zM12 13c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-6 7H4v-2c0-1.1.9-2 2-2h1.5c-.3.6-.5 1.3-.5 2v2zm12-2h1.5c1.1 0 2 .9 2 2v2h-2v-2c0-.7-.2-1.4-.5-2z"/></svg>
);

// --- DATA ---
// Data for Food Comparison
interface Choice { name: string; icon: string; }
interface Comparison { choice1: Choice; choice2: Choice; smartChoiceIndex: 0 | 1; explanation: string; }
const comparisons: Comparison[] = [
  { choice1: { name: 'خبز أبيض', icon: '🍞' }, choice2: { name: 'خبز أسمر', icon: '🥖' }, smartChoiceIndex: 1, explanation: 'الخبز الأسمر يحتوي على ألياف أكثر، مما يساعد على استقرار مستوى السكر في الدم لفترة أطول.' },
  { choice1: { name: 'مشروب غازي', icon: '🥤' }, choice2: { name: 'ماء', icon: '💧' }, smartChoiceIndex: 1, explanation: 'الماء هو الخيار الأفضل لأنه لا يحتوي على سكر مضاف ويروي العطش بشكل صحي.' },
  { choice1: { name: 'تفاحة', icon: '🍎' }, choice2: { name: 'قطعة حلوى', icon: '🍬' }, smartChoiceIndex: 0, explanation: 'التفاح يحتوي على سكريات طبيعية وألياف وفيتامينات، بينما الحلوى تحتوي على سكر مكرر فقط.' },
  { choice1: { name: 'بطاطس مقلية', icon: '🍟' }, choice2: { name: 'بطاطا حلوة مشوية', icon: '🍠' }, smartChoiceIndex: 1, explanation: 'البطاطا الحلوة المشوية لها مؤشر جلايسيمي أقل وتحتوي على فيتامينات أكثر من البطاطس المقلية.' },
];

// Data for Quiz
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}
const quizQuestions: QuizQuestion[] = [
    { question: "ما هي وظيفة الإنسولين في الجسم؟", options: ["يعطيك طاقة لتجري", "يساعد السكر ليدخل الخلايا", "يجعلك تشعر بالنعاس"], correctAnswer: "يساعد السكر ليدخل الخلايا", explanation: "صحيح! الإنسولين مثل المفتاح الذي يفتح باب الخلايا للسكر." },
    { question: "أي من هذه الأطعمة هو الأفضل كوجبة خفيفة؟", options: ["شوكولاتة", "خيار", "شيبس"], correctAnswer: "خيار", explanation: "ممتاز! الخيار وجبة خفيفة صحية ومنعشة." },
    { question: "ماذا يجب أن تفعل إذا شعرت أن سكرك منخفض؟", options: ["أذهب لأنام", "أشرب كوب ماء", "أشرب نصف كوب عصير"], correctAnswer: "أشرب نصف كوب عصير", explanation: "أحسنت! العصير يرفع مستوى السكر بسرعة وأمان." },
    { question: "لماذا من المهم أن تلعب وتتحرك كل يوم؟", options: ["لأنها ممتعة فقط", "لتساعد جسمك على استخدام السكر", "لتتعب وتنام بسرعة"], correctAnswer: "لتساعد جسمك على استخدام السكر", explanation: "رائع! الرياضة تساعد عضلاتك على استخدام السكر كوقود." },
    { question: "أي مشروب هو الأفضل لك؟", options: ["الماء", "العصير المعلب", "المشروب الغازي"], correctAnswer: "الماء", explanation: "بالتأكيد! الماء هو أفضل صديق لجسمك." },
];

// Data for Recipes
interface Recipe {
    title: string;
    icon: string;
    ingredients: string[];
    instructions: string;
    tip: string;
}
const healthyRecipes: Recipe[] = [
    { title: "كرات الطاقة بالتمر", icon: "🍪", ingredients: ["١ كوب تمر منزوع النوى", "نصف كوب شوفان", "ربع كوب جوز مفروم", "ملعقة صغيرة قرفة"], instructions: "اخلط جميع المكونات في الخلاط حتى تتجانس. شكلها على هيئة كرات صغيرة وضعها في الثلاجة لمدة ساعة. بالهناء والشفاء!", tip: "هذه الكرات الصغيرة تمنحك طاقة كبيرة لوقت طويل، وهي أفضل من أي حلوى جاهزة!" },
    { title: "مصاصات الفواكه المجمدة", icon: "🍓", ingredients: ["١ كوب فراولة طازجة", "نصف كوب زبادي بدون سكر", "ملعقة صغيرة عسل (اختياري)"], instructions: "اخلط الفراولة والزبادي في الخلاط. صب الخليط في قوالب المصاصات وضعها في الفريزر لمدة 4 ساعات على الأقل. استمتع!", tip: "هذه المصاصات منعشة ولذيذة في يوم حار، ومليئة بالفيتامينات بدلًا من السكر المضاف!" },
];

// Data for Weekly Challenge
const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
};

const weeklyChallenge = {
    icon: '💧',
    title: 'تحدي شرب الماء!',
    description: 'هل يمكنك شرب 6 أكواب من الماء كل يوم هذا الأسبوع؟ الماء يساعد جسمك ليعمل بشكل رائع!',
    key: `challenge_${new Date().getFullYear()}_${getWeekNumber(new Date())}`
};


const SmartChoicesSection: React.FC = () => {
    // State for Quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    
    // State for Weekly Challenge
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    
    useEffect(() => {
        const completed = localStorage.getItem(weeklyChallenge.key) === 'true';
        setChallengeCompleted(completed);
    }, []);

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setShowFeedback(true);
        if (answer === quizQuestions[currentQuestionIndex].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNextQuestion = () => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex(i => i + 1);
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    const completeChallenge = () => {
        setChallengeCompleted(true);
        localStorage.setItem(weeklyChallenge.key, 'true');
    };

  return (
    <div className="bg-sky-50 py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-sky-800 mb-4">دليل البطل الذكي</h2>
          <p className="text-lg text-gray-600">تعلم، العب، وتحدى نفسك لتكون أقوى بطل سكّري!</p>
        </div>

        {/* Section 1: Food Comparisons (Existing) */}
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">⚖️ الاختيار بين الأطعمة</h3>
            <div className="grid md:grid-cols-2 gap-8">
            {comparisons.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 flex-grow">
                    <div className="grid grid-cols-2 gap-4 items-center text-center">
                    <div className={`p-4 rounded-lg relative ${item.smartChoiceIndex === 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                        {item.smartChoiceIndex === 0 && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"><CheckmarkIcon className="w-4 h-4" /></div>}
                        <div className="text-5xl mb-2">{item.choice1.icon}</div>
                        <h4 className="text-lg font-bold text-gray-800">{item.choice1.name}</h4>
                    </div>
                    <div className={`p-4 rounded-lg relative ${item.smartChoiceIndex === 1 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                        {item.smartChoiceIndex === 1 && <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1"><CheckmarkIcon className="w-4 h-4" /></div>}
                        <div className="text-5xl mb-2">{item.choice2.icon}</div>
                        <h4 className="text-lg font-bold text-gray-800">{item.choice2.name}</h4>
                    </div>
                    </div>
                </div>
                <div className="bg-sky-100 p-4 text-center">
                    <h5 className="font-bold text-sky-800 mb-1">لماذا هو الخيار الأذكى؟</h5>
                    <p className="text-sm text-sky-700">{item.explanation}</p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Section 2: Test Your Knowledge (New) */}
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">🧠 اختبر معلوماتك</h3>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                {currentQuestionIndex < quizQuestions.length ? (
                    <div>
                        <div className="text-lg font-semibold text-gray-500 mb-2">السؤال {currentQuestionIndex + 1} من {quizQuestions.length}</div>
                        <h4 className="text-2xl font-bold text-sky-800 mb-6">{quizQuestions[currentQuestionIndex].question}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quizQuestions[currentQuestionIndex].options.map(option => (
                                <button key={option} onClick={() => handleAnswer(option)} disabled={showFeedback} className={`p-4 rounded-lg text-lg font-semibold transition-all duration-300 ${!showFeedback ? 'bg-sky-100 hover:bg-sky-200' : (option === quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-green-200 text-green-800' : (option === selectedAnswer ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-500'))}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        {showFeedback && (
                            <div className="mt-6">
                                <p className="text-lg font-bold">{selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer ? 'إجابة صحيحة!' : 'حاول مرة أخرى!'}</p>
                                <p className="text-gray-600 mt-2">{quizQuestions[currentQuestionIndex].explanation}</p>
                                <button onClick={handleNextQuestion} className="mt-4 bg-sky-600 text-white font-bold py-2 px-8 rounded-full hover:bg-sky-700">التالي</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h4 className="text-3xl font-bold text-sky-800 mb-4">أحسنت! لقد أكملت الاختبار!</h4>
                        <p className="text-xl text-gray-700 mb-6">نتيجتك: {score} من {quizQuestions.length}</p>
                        <div className="flex justify-center text-yellow-400 mb-6">
                            {Array.from({ length: quizQuestions.length }).map((_, i) => <StarIcon key={i} className={`w-10 h-10 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                        </div>
                        <button onClick={restartQuiz} className="bg-sky-600 text-white font-bold py-3 px-10 rounded-full hover:bg-sky-700 text-lg">العب مرة أخرى</button>
                    </div>
                )}
            </div>
        </div>
        
        {/* Section 3: Healthy Sweets (New) */}
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">🍪 حلوياتي الصحية</h3>
            <div className="grid md:grid-cols-2 gap-8">
                {healthyRecipes.map(recipe => (
                    <div key={recipe.title} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-5xl">{recipe.icon}</span>
                            <h4 className="text-2xl font-bold text-sky-800">{recipe.title}</h4>
                        </div>
                        <div className="mb-4">
                            <h5 className="font-bold text-gray-700">المكونات:</h5>
                            <ul className="list-disc list-inside text-gray-600">
                                {recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-700">الطريقة:</h5>
                            <p className="text-gray-600">{recipe.instructions}</p>
                        </div>
                        <div className="mt-4 bg-yellow-100 border-r-4 border-yellow-400 p-3 rounded">
                            <p className="font-semibold text-yellow-800">💡 نصيحة ذكية: <span className="font-normal">{recipe.tip}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Section 4: Weekly Challenge (New) */}
        <div>
            <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">🏆 تحدي الأسبوع</h3>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center">
                {challengeCompleted ? (
                    <>
                        <TrophyIcon className="w-24 h-24 text-yellow-500 mb-4"/>
                        <h4 className="text-3xl font-bold text-green-600 mb-2">لقد أكملت التحدي!</h4>
                        <p className="text-lg text-gray-700">أنت بطل حقيقي! استمر في هذا العمل الرائع وانتظر تحدي الأسبوع القادم.</p>
                    </>
                ) : (
                    <>
                        <div className="text-6xl mb-4">{weeklyChallenge.icon}</div>
                        <h4 className="text-2xl font-bold text-sky-800 mb-2">{weeklyChallenge.title}</h4>
                        <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">{weeklyChallenge.description}</p>
                        <button onClick={completeChallenge} className="bg-green-500 text-white font-bold py-3 px-10 rounded-full hover:bg-green-600 text-lg transition-transform transform hover:scale-105">أنا أقبل التحدي!</button>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SmartChoicesSection;
