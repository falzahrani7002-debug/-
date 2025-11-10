import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

// Loading spinner component for reuse
const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const ParentsSection: React.FC = () => {
  const articles = [
    {
      title: "كيف أتعامل مع انخفاض السكر؟",
      content: "الانخفاض المفاجئ في سكر الدم قد يكون مقلقاً. تعلم الخطوات السريعة والفعالة للتعامل مع الموقف بأمان..."
    },
    {
      title: "وجبات خفيفة آمنة للأطفال السكّريين",
      content: "اكتشف مجموعة من الأفكار لوجبات خفيفة وصحية ولذيذة، مثالية للحفاظ على استقرار مستوى السكر طوال اليوم..."
    },
    {
      title: "نصائح من أطباء مختصين",
      content: "جمعنا لكم أهم النصائح من أطباء الغدد الصماء وأخصائيي التغذية لمساعدتكم في رحلة العناية بطفلكم..."
    }
  ];
  
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
      const systemInstruction = `أنت مساعد ذكي متخصص في تقديم الدعم لأولياء أمور الأطفال المصابين بالسكري. 
      قدم إجابات واضحة ومبسطة وعملية. ركز على النصائح العامة والآمنة. 
      لا تقدم تشخيصًا طبيًا أو وصفات علاجية. 
      دائمًا، وفي نهاية كل إجابة، شدد على أهمية استشارة الطبيب المختص قبل اتخاذ أي إجراء. 
      يجب أن تكون إجاباتك باللغة العربية.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: question,
        config: {
            systemInstruction: systemInstruction,
        }
      });
      
      setAnswer(response.text);

    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء محاولة الحصول على إجابة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-sky-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center text-sky-800 mb-4">دليل أولياء الأمور</h2>
        <p className="text-center text-lg text-gray-600 mb-12">أنتم السند الأول لأبطالنا، وهنا تجدون الدعم والمعلومات.</p>
        
        <div className="space-y-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md border-r-8 border-sky-500">
              <h3 className="text-2xl font-bold text-sky-900 mb-4">{article.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{article.content}</p>
              <button className="bg-sky-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-800 transition-colors duration-300">
                اقرأ المزيد
              </button>
            </div>
          ))}
        </div>

        {/* New Inquiries Section */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg border-r-8 border-blue-500">
          <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">هل لديك سؤال؟ استشر مساعدنا الذكي</h3>
          <p className="text-gray-700 leading-relaxed mb-6 text-center">
            اكتب سؤالك حول رعاية طفلك السكري، وسيقوم مساعدنا الذكي بتقديم إجابة إرشادية.
          </p>
          
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="مثال: ما هي أفضل الأطعمة لوجبة الإفطار لطفل مصاب بالسكري من النوع الأول؟"
            disabled={isLoading}
            aria-label="اكتب سؤالك هنا"
          />

          <button 
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed"
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>جاري البحث...</span>
              </>
            ) : (
              'احصل على إجابة'
            )}
          </button>

          {answer && (
            <div className="mt-6 p-6 rounded-lg bg-sky-50 border border-sky-200" role="alert">
              <h4 className="font-bold text-sky-800 mb-2">إجابة المساعد الذكي:</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
            </div>
          )}

          {error && (
             <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700" role="alert">
              <p>{error}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-6 text-center">
            ملاحظة: هذه الإجابة إرشادية ولا تغني عن استشارة الطبيب المختص.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentsSection;