import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// A cute character for our Insulin friend, as a friendly insulin pen
const InsulinCharacter: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M 40,95 C 40,95 35,20 35,15 C 35,10 40,5 50,5 C 60,5 65,10 65,15 C 65,20 60,95 60,95 Z" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="4"/>
        <rect x="42" y="0" width="16" height="8" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2"/>
        <rect x="44" y="25" width="12" height="15" rx="3" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5"/>
        <text x="50" y="37" fontFamily="sans-serif" fontSize="10" fill="#0284C7" textAnchor="middle" fontWeight="bold">8</text>
        <circle cx="44" cy="55" r="4" fill="#0284C7" />
        <circle cx="56" cy="55" r="4" fill="#0284C7" />
        <circle cx="45.5" cy="53.5" r="1.5" fill="white" />
        <circle cx="57.5" cy="53.5" r="1.5" fill="white" />
        <path d="M 45 68 Q 50 76 55 68" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
);

const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const encyclopediaContent = [
    {
        icon: '🔑',
        title: "ما هو الإنسولين يا بطل؟",
        content: "الإنسولين هو المفتاح السحري الذي يفتح أبواب خلايا جسمك ليدخل إليها السكر ويتحول إلى طاقة رائعة لتلعب وتجري وتفكر!",
    },
    {
        icon: '🧑‍🤝‍🧑',
        title: "النوع الأول والثاني.. ما الفرق؟",
        content: "النوع الأول يعني أن جسمك البطل توقف عن صنع مفاتيح الإنسولين. أما النوع الثاني، فالجسم لا يزال يصنع المفاتيح، لكن أقفال الأبواب على الخلايا لا تفتح بسهولة.",
    },
    {
        icon: '🧃',
        title: "سكرك منخفض؟ تصرف بسرعة!",
        content: "إذا شعرت بدوخة أو رجفة، كل أو اشرب شيئًا حلوًا بسرعة مثل نصف كوب عصير أو 3 حبات تمر، ثم استرح وأخبر شخصًا كبيرًا.",
    }
];

const dictionaryTerms = [
    { icon: '🍬', term: 'الجلوكوز', definition: 'هو سكر الطاقة في دمك، مثل وقود السيارة!' },
    { icon: '🔑', term: 'الإنسولين', definition: 'المفتاح السحري الذي يدخل الجلوكوز للخلايا.' },
    { icon: '💉', term: 'إبرة', definition: 'أداة صغيرة جدًا تساعدنا في أخذ الإنسولين.' },
    { icon: '📱', term: 'مضخة', definition: 'جهاز صغير وصديق يبقى معك ليعطيك الإنسولين.' },
    { icon: '📟', term: 'جهاز قياس السكر', definition: 'جهاز يخبرنا كمية الطاقة (الجلوكوز) في دمنا.' },
    { icon: '🏭', term: 'بنكرياس', definition: 'المصنع الصغير في جسمك الذي كان يصنع الإنسولين.' },
];

const EducationalContentSection: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnswer('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const systemInstruction = `أنت مساعد ذكي ولطيف اسمه "إنسولينو" على شكل قلم إنسولين كرتوني. 
            أنت تتحدث إلى طفل صغير مصاب بالسكري.
            استخدم لغة بسيطة جدًا ومشجعة وإيجابية. 
            استخدم الكثير من الرموز التعبيرية (emojis). 
            اجعل إجاباتك قصيرة ومباشرة ومفهومة لطفل عمره 5-10 سنوات.
            أجب دائمًا باللغة العربية.
            لا تقدم نصائح طبية، بل اشرح المفاهيم ببساطة.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: question,
                config: {
                    systemInstruction,
                }
            });

            setAnswer(response.text);

        } catch (e) {
            console.error(e);
            setError('عذرًا! حدث خطأ ما. حاول مرة أخرى لاحقًا.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-sky-50 py-16 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-sky-800 mb-4">أفكار تعليمية 🧠</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">مكانك المفضل لتتعلم كل شيء عن السكري بطريقة ممتعة!</p>
                </div>

                {/* Section 1: Encyclopedia */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">📚 موسوعة السكّري للأطفال</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {encyclopediaContent.map((card, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-5xl mb-4">{card.icon}</div>
                                <h4 className="text-xl font-bold text-sky-800 mb-2">{card.title}</h4>
                                <p className="text-gray-600">{card.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Ask and Learn */}
                <div className="mb-16 bg-white p-8 rounded-2xl shadow-lg border-t-8 border-sky-400">
                    <h3 className="text-3xl font-bold text-sky-900 mb-6 text-center">🙋 اسأل وتعلّم</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 flex-shrink-0 hidden md:block">
                            <InsulinCharacter />
                        </div>
                        <div className="flex-grow w-full">
                            <p className="text-center text-gray-700 mb-4">هل لديك سؤال؟ اسأل صديقك "إنسولينو"!</p>
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                rows={2}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 transition"
                                placeholder="مثال: ليش لازم أقيس السكر؟"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAsk}
                                disabled={isLoading || !question.trim()}
                                className="w-full mt-3 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 flex items-center justify-center disabled:bg-sky-400"
                            >
                                {isLoading ? (
                                    <><Spinner /> <span>جاري التفكير...</span></>
                                ) : (
                                    'اسأل إنسولينو'
                                )}
                            </button>
                            {answer && (
                                <div className="mt-4 p-4 bg-sky-100 rounded-lg flex items-start gap-x-3" role="alert">
                                    <div className="w-10 h-10 flex-shrink-0 pt-1"><InsulinCharacter /></div>
                                    <p className="text-sky-800 whitespace-pre-wrap flex-grow">{answer}</p>
                                </div>
                            )}
                            {error && (
                                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg" role="alert">{error}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Dictionary */}
                <div>
                    <h3 className="text-3xl font-bold text-sky-900 mb-8 text-center">📖 قاموس السكّري المصوّر</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dictionaryTerms.map((term, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-x-4 border-l-4 border-sky-200">
                                <div className="text-4xl">{term.icon}</div>
                                <div>
                                    <h5 className="font-bold text-sky-800 text-lg">{term.term}</h5>
                                    <p className="text-sm text-gray-600">{term.definition}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationalContentSection;
