import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import MeetingsPage from './pages/MeetingsPage';
import ActionItemsPage from './pages/ActionItemsPage';
import DecisionsPage from './pages/DecisionsPage';
import ChatPage from './pages/ChatPage';
import KnowledgePage from './pages/KnowledgePage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import {
  fetchMeetings,
  fetchActionItems,
  fetchDecisions,
  fetchKnowledgeDocs,
  fetchNotifications,
  getCurrentUser,
  logoutUser
} from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [meetings, setMeetings] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState('login');
  const [authModalAutoDemo, setAuthModalAutoDemo] = useState(false);

  const loadAllData = async () => {
    const [mList, aList, dList, kList, nList] = await Promise.all([
      fetchMeetings(),
      fetchActionItems(),
      fetchDecisions(),
      fetchKnowledgeDocs(),
      fetchNotifications()
    ]);
    setMeetings(mList);
    setActionItems(aList);
    setDecisions(dList);
    setKnowledgeDocs(kList);
    setNotifications(nList);
    if (mList.length > 0 && !selectedMeeting) {
      setSelectedMeeting(mList[0]);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenAuth = (mode = 'login', autoDemo = false) => {
    setAuthModalInitialMode(mode);
    setAuthModalAutoDemo(autoDemo);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    loadAllData();
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(getCurrentUser());
    setActiveTab('landing');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  // Full Screen Landing Page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onLaunchApp={() => setActiveTab('dashboard')}
          isUserLoggedIn={Boolean(localStorage.getItem('token'))}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authModalInitialMode}
          autoQuickDemo={authModalAutoDemo}
        />
      </>
    );
  }

  // Main Workspace Application
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenUploadModal={() => setActiveTab('meetings')}
          onSearchClick={() => setActiveTab('chat')}
          unreadCount={unreadNotificationsCount}
          currentUser={currentUser}
          onNavigateToProfile={() => setActiveTab('profile')}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              meetings={meetings}
              actionItems={actionItems}
              decisions={decisions}
              notifications={notifications}
              setActiveTab={setActiveTab}
              setSelectedMeeting={setSelectedMeeting}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              currentUser={currentUser}
              onProfileUpdated={(updated) => setCurrentUser(updated)}
              onLogout={handleLogout}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsPage
              meetings={meetings}
              selectedMeeting={selectedMeeting}
              setSelectedMeeting={setSelectedMeeting}
              refreshMeetings={loadAllData}
            />
          )}

          {activeTab === 'action-items' && (
            <ActionItemsPage
              actionItems={actionItems}
              refreshData={loadAllData}
            />
          )}

          {activeTab === 'decisions' && (
            <DecisionsPage
              decisions={decisions}
            />
          )}

          {activeTab === 'chat' && (
            <ChatPage />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgePage
              docs={knowledgeDocs}
              refreshDocs={loadAllData}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              meetings={meetings}
              actionItems={actionItems}
              decisions={decisions}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onProfileUpdated={(updated) => setCurrentUser(updated)}
            />
          )}
        </main>
      </div>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalInitialMode}
        autoQuickDemo={authModalAutoDemo}
      />
    </div>
  );
}
