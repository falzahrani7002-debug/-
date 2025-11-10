import React, { useState, useCallback } from 'react';
import { Page } from './types';
import Header from './components/Header';
import HomePage from './components/HomePage';
import KidsSection from './components/KidsSection';
import ParentsSection from './components/ParentsSection';
import TrackerSection from './components/TrackerSection';
import MyJourneySection from './components/MyJourneySection';
import SmartChoicesSection from './components/SmartChoicesSection';
import CommunitySection from './components/CommunitySection';
import GamesSection from './components/GamesSection';
import EducationalContentSection from './components/EducationalContentSection';
import ContactPage from './components/ContactPage';
import InsulinFriendSection from './components/InsulinFriendSection';
import StarCollectionSection from './components/StarCollectionSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage navigateTo={navigateTo} />;
      case Page.Kids:
        return <KidsSection />;
      case Page.Games:
        return <GamesSection />;
      case Page.Parents:
        return <ParentsSection />;
      case Page.Tracker:
        return <TrackerSection />;
      case Page.MyJourney:
        return <MyJourneySection />;
      case Page.SmartChoices:
        return <SmartChoicesSection />;
      case Page.Community:
        return <CommunitySection />;
      case Page.Educational:
        return <EducationalContentSection />;
      case Page.InsulinFriend:
        return <InsulinFriendSection />;
      case Page.StarCollection:
        return <StarCollectionSection />;
      case Page.Contact:
        return <ContactPage />;
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header navigateTo={navigateTo} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;