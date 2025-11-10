import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white py-20 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-sky-100 rounded-full opacity-60"></div>
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-blue-100 rounded-full opacity-60"></div>
        </div>
        <div className="container mx-auto max-w-2xl text-center relative z-10">
            <h2 className="text-4xl font-bold text-sky-800 mb-4">نحن هنا من أجلك!</h2>
            <p className="text-lg text-gray-600 mb-12">لا تتردد في التواصل معنا لأي سؤال أو استفسار. فريقنا جاهز للمساعدة.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
                <div className="flex flex-col items-center">
                    <div className="text-5xl mb-3">💌</div>
                    <h3 className="text-xl font-bold text-sky-900">البريد الإلكتروني</h3>
                    <a href="mailto:support@mosaedy.sokary" className="text-sky-600 hover:underline">support@mosaedy.sokary</a>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-5xl mb-3">☎️</div>
                    <h3 className="text-xl font-bold text-sky-900">الهاتف</h3>
                    <a href="tel:+966123456789" className="text-sky-600 hover:underline">+966 123 456 789</a>
                </div>
                <div className="flex flex-col items-center">
                    <div className="text-5xl mb-3">📱</div>
                    <h3 className="text-xl font-bold text-sky-900">واتساب</h3>
                    <a href="https://wa.me/966123456789" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">اضغط هنا للمحادثة</a>
                </div>
            </div>

            <button className="bg-sky-600 text-white font-bold py-4 px-12 text-xl rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105 duration-300">
                تحدث معنا الآن
            </button>
        </div>
    </div>
  );
};

export default ContactPage;