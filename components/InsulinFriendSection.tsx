import React, { useState, useEffect, useRef } from 'react';

// A cute character for our Insulin friend, as a friendly insulin pen
const InsulinCharacter: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Pen Body */}
        <path d="M 40,95 C 40,95 35,20 35,15 C 35,10 40,5 50,5 C 60,5 65,10 65,15 C 65,20 60,95 60,95 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="4"/>
        
        {/* Button on top */}
        <rect x="42" y="0" width="16" height="8" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2"/>

        {/* Dosage window */}
        <rect x="44" y="25" width="12" height="15" rx="3" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5"/>
        <text x="50" y="37" fontFamily="sans-serif" fontSize="10" fill="#0284C7" textAnchor="middle" fontWeight="bold">8</text>

        {/* Face */}
        <circle cx="44" cy="55" r="4" fill="#0284C7" /> {/* Left eye */}
        <circle cx="56" cy="55" r="4" fill="#0284C7" /> {/* Right eye */}
        <circle cx="45.5" cy="53.5" r="1.5" fill="white" /> {/* Left highlight */}
        <circle cx="57.5" cy="53.5" r="1.5" fill="white" /> {/* Right highlight */}
        <path d="M 45 68 Q 50 76 55 68" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" /> {/* Smile */}
    </svg>
);


interface Message {
    id: number;
    text: string;
    sender: 'insulin' | 'user';
}

interface Option {
    id: number;
    text: string;
    response: string;
}

const conversationFlow: Option[] = [
    { id: 1, text: 'ماذا تفعل في جسمي؟ 🤔', response: 'أنا مثل المفتاح السحري! 🗝️ أفتح أبواب خلايا جسمك الصغيرة ليدخل إليها السكر ويتحول إلى طاقة رائعة لتلعب وتجري وتضحك!' },
    { id: 2, text: 'لماذا أحتاجك من القلم أو المضخة؟ 💉', response: 'لأن مصنع المفاتيح الصغير في جسمك (البنكرياس) قرر أن يأخذ إجازة قصيرة. لذلك، أنا آتي من الخارج لأساعدك وأبقى بجانبك دائمًا لأعطيك القوة! 💪' },
    { id: 3, text: 'هل الوخزة الصغيرة مؤلمة؟ 😟', response: 'إنها مجرد دغدغة بسيطة وسريعة جدًا! ⚡️ تذكر أنها دغدغة الأبطال التي تجعلك قويًا ونشيطًا. كل وخزة هي وسام شجاعة لك! 🎖️' },
];

const InsulinFriendSection: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [options, setOptions] = useState<Option[]>(conversationFlow);
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<null | HTMLDivElement>(null);
    
    useEffect(() => {
        // Initial welcome message
        setMessages([{
            id: Date.now(),
            text: 'أهلاً يا صديقي البطل! أنا هو "إنسولينو"، صديقك السري الذي يعطيك القوة والنشاط! يمكنك أن تسألني أي شيء.',
            sender: 'insulin',
        }]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOptionClick = (option: Option) => {
        // Add user's question to chat
        setMessages(prev => [...prev, { id: Date.now(), text: option.text, sender: 'user' }]);

        // Remove the chosen option
        setOptions(prev => prev.filter(o => o.id !== option.id));

        setIsThinking(true);

        // Simulate "thinking" and then respond
        setTimeout(() => {
            setIsThinking(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: option.response, sender: 'insulin' }]);
        }, 1200);
    };

    return (
        <div className="bg-white py-16 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <div className="w-32 h-32 mx-auto mb-4">
                        <InsulinCharacter />
                    </div>
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">💙 صديقي الإنسولين</h2>
                    <p className="text-lg text-gray-600">تحدث مع "إنسولينو" واكتشف كيف يساعدك لتكون بطلاً كل يوم!</p>
                </div>

                <div className="bg-sky-50 rounded-2xl shadow-lg p-4 sm:p-8 h-[60vh] flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-x-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                {msg.sender === 'insulin' && (
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                        <InsulinCharacter />
                                    </div>
                                )}
                                <div 
                                    className={`max-w-xs sm:max-w-md p-4 rounded-2xl text-lg ${
                                        msg.sender === 'insulin' 
                                        ? 'bg-sky-600 text-white rounded-bl-none' 
                                        : 'bg-white text-gray-800 rounded-br-none shadow'
                                    }`}
                                    style={{ animation: 'fade-in 0.5s ease-out' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                             <div className="flex items-end gap-x-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"><InsulinCharacter /></div>
                                <div className="max-w-xs sm:max-w-md p-4 rounded-2xl bg-sky-600 text-white rounded-bl-none">
                                    <div className="flex items-center gap-x-2">
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    
                    {/* User Options */}
                    <div className="mt-6 pt-4 border-t-2 border-sky-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {options.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                    className="w-full text-center bg-white font-semibold text-sky-700 p-4 rounded-lg shadow hover:bg-sky-100 hover:shadow-md transition-all duration-300"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                         {options.length === 0 && !isThinking && (
                                <p className="text-center text-gray-500 mt-4">لقد تعلمت الكثير اليوم! عد لاحقًا للمزيد من الأسرار.</p>
                         )}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default InsulinFriendSection;