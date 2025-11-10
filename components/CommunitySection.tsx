import React, { useState } from 'react';
import { CommunityPost } from '../types';

const initialPosts: CommunityPost[] = [
  { id: 1, emoji: '💪', message: 'شعرت بالقوة اليوم بعد أن قمت بقياس السكر بنفسي!', timestamp: 'قبل 10 دقائق' },
  { id: 2, emoji: '😊', message: 'أنا سعيد لأنني أكلت وجبة لذيذة وصحية.', timestamp: 'قبل ساعة' },
  { id: 3, emoji: '🤔', message: 'أتساءل أحيانًا لماذا أنا فقط من بين أصدقائي لدي سكري.', timestamp: 'قبل 3 ساعات' },
  { id: 4, emoji: '🎉', message: 'كانت قراءاتي ممتازة اليوم! احتفال صغير!', timestamp: 'قبل 5 ساعات' },
];

const feelings = ['😊', '💪', '🤔', '😢', '🎉', '❤️'];

const CommunitySection: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [newMessage, setNewMessage] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('😊');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newPost: CommunityPost = {
      id: Date.now(),
      emoji: selectedEmoji,
      message: newMessage,
      timestamp: 'الآن',
    };

    setPosts([newPost, ...posts]);
    setNewMessage('');
  };

  return (
    <div className="bg-sky-50 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-sky-800 mb-4">مجتمع أصدقائي</h2>
          <p className="text-lg text-gray-600">شارك مشاعرك مع أبطال السكري الآخرين. أنت لست وحدك!</p>
        </div>

        {/* New Post Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
          <h3 className="text-2xl font-bold text-sky-900 mb-6 text-center">عبر عن مشاعرك اليوم...</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <p className="text-center text-gray-700 mb-4 font-semibold">اختر ما يصف شعورك:</p>
                <div className="flex justify-center gap-4">
                    {feelings.map(emoji => (
                        <button 
                            key={emoji} 
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`text-4xl p-2 rounded-full transition-transform transform hover:scale-125 ${selectedEmoji === emoji ? 'bg-sky-200 scale-125' : ''}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              rows={3}
              placeholder="اكتب رسالتك هنا... كيف تشعر؟ ماذا حدث اليوم؟"
            ></textarea>
            <button type="submit" className="w-full mt-4 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 text-lg">
              انشر مشاعرك
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
            <h3 className="text-3xl font-bold text-sky-800 mb-6 text-center">أحدث المشاركات من الأصدقاء</h3>
            {posts.map(post => (
                <div key={post.id} className="bg-white p-6 rounded-xl shadow-md flex items-start gap-x-5 border-l-8 border-sky-300">
                    <div className="text-5xl bg-gray-100 p-3 rounded-full">{post.emoji}</div>
                    <div className="flex-grow">
                        <p className="text-gray-800 text-lg">{post.message}</p>
                        <span className="text-sm text-gray-500 mt-2 block">{post.timestamp}</span>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default CommunitySection;
