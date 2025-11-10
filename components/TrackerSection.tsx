
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SugarReading } from '../types';

const initialData: SugarReading[] = [
  { day: 'الأحد', before: 110, after: 165, notes: 'بدأ الأسبوع بشكل جيد' },
  { day: 'الإثنين', before: 125, after: 180, notes: 'تناول قطعة كيك صغيرة' },
  { day: 'الثلاثاء', before: 95, after: 150, notes: 'نشاط رياضي في المدرسة' },
  { day: 'الأربعاء', before: 130, after: 190, notes: '' },
  { day: 'الخميس', before: 105, after: 160, notes: 'قياس ممتاز' },
  { day: 'الجمعة', before: 140, after: 200, notes: 'وجبة غداء خارج المنزل' },
  { day: 'السبت', before: 115, after: 170, notes: '' },
];


const TrackerSection: React.FC = () => {
  const [readings, setReadings] = useState<SugarReading[]>(initialData);
  const [before, setBefore] = useState<string>('');
  const [after, setAfter] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [day, setDay] = useState<string>('الأحد');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simplified add/update. In a real app, logic would be more robust.
    const newReading: SugarReading = {
      day,
      before: before ? parseInt(before, 10) : null,
      after: after ? parseInt(after, 10) : null,
      notes,
    };
    
    // Replace if day exists, else add.
    const existingIndex = readings.findIndex(r => r.day === day);
    const updatedReadings = [...readings];
    if (existingIndex > -1) {
        updatedReadings[existingIndex] = newReading;
    } else {
        updatedReadings.push(newReading);
    }
    setReadings(updatedReadings);

    // Clear form
    setBefore('');
    setAfter('');
    setNotes('');
  };


  return (
    <div className="bg-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-sky-800 mb-12">مفكرة السكر الأسبوعية</h2>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-1 bg-sky-50 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-sky-900 mb-6">إضافة قراءة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="day" className="block text-md font-medium text-gray-700">اليوم</label>
                <select id="day" value={day} onChange={e => setDay(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500">
                  {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="before" className="block text-md font-medium text-gray-700">قراءة السكر قبل الأكل</label>
                <input type="number" id="before" value={before} onChange={e => setBefore(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 110" />
              </div>
              <div>
                <label htmlFor="after" className="block text-md font-medium text-gray-700">قراءة السكر بعد الأكل</label>
                <input type="number" id="after" value={after} onChange={e => setAfter(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., 160" />
              </div>
              <div>
                <label htmlFor="notes" className="block text-md font-medium text-gray-700">ملاحظات</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" placeholder="أي نشاط أو وجبة خاصة..."></textarea>
              </div>
              <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300">
                حفظ القراءة
              </button>
            </form>
          </div>
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-gray-50 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-sky-900 mb-6 text-center">تغير مستوى السكر خلال الأسبوع</h3>
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                    data={readings}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="before" name="قبل الأكل" stroke="#0ea5e9" activeDot={{ r: 8 }} strokeWidth={2}/>
                    <Line type="monotone" dataKey="after" name="بعد الأكل" stroke="#0284c7" strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerSection;
