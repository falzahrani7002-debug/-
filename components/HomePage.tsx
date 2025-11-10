
import React from 'react';
import { Page } from '../types';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const InsulinPumpHeroIcon: React.FC = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Background Blob */}
    <path fill="#0EA5E9" d="M47.7,-64.8C61.8,-53.3,73.4,-39,78.2,-22.7C83,-6.4,81,11.8,73,26.4C65,41.1,51.1,52.2,36.2,60.5C21.3,68.7,5.5,74.1,-11.2,74.7C-27.9,75.3,-45.6,71.1,-58.5,60.7C-71.4,50.3,-79.5,33.7,-81.4,16.5C-83.3,-0.7,-79,-18.5,-70.1,-33.5C-61.2,-48.5,-47.7,-60.7,-33,-69.1C-18.3,-77.5,-2.5,-82,14.1,-79.8C30.7,-77.6,47.7,-68.8,47.7,-64.8Z" transform="translate(100 100)" />
    
    {/* Insulin Pump Body */}
    <g transform="translate(60, 50) scale(0.8)">
      <rect x="10" y="20" width="80" height="120" rx="15" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="4"/>
      {/* Screen */}
      <rect x="25" y="35" width="50" height="50" rx="5" fill="#E0F2FE" />
      {/* Smile */}
      <path d="M 40 65 Q 50 75 60 65" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="52" r="3" fill="#0284C7" />
      <circle cx="58" cy="52" r="3" fill="#0284C7" />
      {/* Tube */}
      <path d="M 90 80 C 110 70, 120 100, 140 90" stroke="#38BDF8" strokeWidth="4" fill="none" />
      {/* Buttons */}
      <circle cx="50" cy="105" r="8" fill="#38BDF8" />
    </g>
     {/* Cape */}
    <g transform="translate(125, 75) rotate(15)">
       <path d="M 0 0 C 20 10, 20 40, 0 50 L -10 25 Z" fill="#F43F5E"/>
    </g>
  </svg>
);

const InsulinPenIcon: React.FC = () => (
    <svg viewBox="0 0 50 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main body */}
        <rect x="10" y="25" width="30" height="115" rx="8" fill="#a5f3fc"/>
        {/* Top cap */}
        <rect x="10" y="10" width="30" height="25" rx="8" fill="#38BDF8"/>
        {/* Button on cap */}
        <rect x="18" y="15" width="14" height="6" rx="3" fill="#0EA5E9"/>
        {/* Needle area */}
        <rect x="15" y="140" width="20" height="10" rx="5" fill="#E0F2FE"/>
    </svg>
);

// New Rain Effect Component
const RainEffect: React.FC = () => {
    const dropCount = 75;
    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                {Array.from({ length: dropCount }).map((_, i) => {
                    const style = {
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${0.6 + Math.random() * 0.6}s`,
                        animationDelay: `${Math.random() * 8}s`,
                        opacity: `${0.2 + Math.random() * 0.4}`,
                    };
                    return <i key={i} className="raindrop" style={style} />;
                })}
            </div>
            <style>{`
                .raindrop {
                    position: absolute;
                    bottom: 100%;
                    width: 2px;
                    height: 60px;
                    background: linear-gradient(to top, rgba(14, 165, 233, 0), rgba(56, 189, 248, 0.5));
                    animation: fall linear infinite;
                }
                @keyframes fall {
                    0% {
                        transform: translateY(0vh);
                    }
                    100% {
                        transform: translateY(115vh);
                    }
                }
            `}</style>
        </>
    );
};


const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="relative bg-gradient-to-br from-sky-100 to-yellow-50 text-center py-20 px-6 min-h-[calc(100vh-68px)] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute top-10 -left-24 w-72 h-72 bg-sky-200 rounded-full opacity-50 filter blur-xl z-0"></div>
      <div className="absolute bottom-10 -right-24 w-72 h-72 bg-blue-200 rounded-full opacity-50 filter blur-xl z-0"></div>
      
      <RainEffect />

      {/* Decorative Insulin Pens */}
      <div className="absolute top-8 left-8 w-16 h-16 transform -rotate-45 opacity-60 z-0 hidden md:block"><InsulinPenIcon /></div>
      <div className="absolute top-8 right-8 w-16 h-16 transform rotate-45 opacity-60 z-0 hidden md:block"><InsulinPenIcon /></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 transform rotate-45 opacity-60 z-0 hidden md:block"><InsulinPenIcon /></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 transform -rotate-45 opacity-60 z-0 hidden md:block"><InsulinPenIcon /></div>


      <div className="container mx-auto max-w-4xl z-10">
        <div className="w-56 h-56 mx-auto mb-8">
          <InsulinPumpHeroIcon />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-sky-800 mb-4">أهلاً بك في عالم أبطال السكري!</h1>
        <p className="text-lg text-gray-600 mb-12">مكانك الآمن لتتعلم، تلعب، وتشارك رحلتك مع السكري بكل قوة وإيجابية.</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button 
            onClick={() => navigateTo(Page.Kids)}
            className="w-full md:w-auto bg-sky-500 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-sky-600 transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            🔹 أنا طفل سكّري
          </button>
          <button 
            onClick={() => navigateTo(Page.Parents)}
            className="w-full md:w-auto bg-blue-500 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 duration-300 ease-in-out"
          >
            🔹 أنا ولي أمر
          </button>
        </div>
        
        <p className="mt-16 text-gray-500">مضخة الأنسولين الصديقة، رفيقك في رحلة البطولة!</p>
      </div>
    </div>
  );
};

export default HomePage;
