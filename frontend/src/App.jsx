import React, { useState, useEffect } from 'react';
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

const pathToTabMap = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/meetings': 'meetings',
  '/chat': 'chat',
  '/action-items': 'action-items',
  '/decisions': 'decisions',
  '/reports': 'reports',
  '/notifications': 'notifications',
  '/profile': 'profile',
  '/settings': 'settings'
};

const tabToPathMap = {
  'dashboard': '/',
  'meetings': '/meetings',
  'chat': '/chat',
  'action-items': '/action-items',
  'decisions': '/decisions',
  'reports': '/reports',
  'notifications': '/notifications',
  'profile': '/profile',
  'settings': '/settings'
};

export default function App() {
  const getTabFromLocation = () => {
    const path = window.location.pathname;
    return pathToTabMap[path] || 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromLocation);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const targetPath = tabToPathMap[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromLocation();
      setActiveTabState(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to your AI Conversational Knowledge Assistant. I have indexed all meeting transcripts, decision logs, action items, and enterprise SOPs into ChromaDB. How can I help you today?",
      citations: []
    }
  ]);

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('theme', mode);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [themeMode]);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  const loadAllData = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [mList, aList, dList, kList, nList] = await Promise.all([
        fetchMeetings(),
        fetchActionItems(),
        fetchDecisions(),
        fetchKnowledgeDocs(),
        fetchNotifications()
      ]);
      setMeetings(mList || []);
      setActionItems(aList || []);
      setDecisions(dList || []);
      setKnowledgeDocs(kList || []);
      setNotifications(nList || []);
      if (mList && mList.length > 0 && !selectedMeeting) {
        setSelectedMeeting(mList[0]);
      }
    } catch (err) {
      console.error("Failed to load workspace data:", err);
      setDataError(err.message || "Failed to load workspace data");
    } finally {
      setDataLoading(false);
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
    setActiveTab('dashboard');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

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
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Navbar
          onOpenUploadModal={() => setActiveTab('meetings')}
          onSearchClick={() => setActiveTab('chat')}
          unreadCount={unreadNotificationsCount}
          currentUser={currentUser}
          onNavigateToProfile={() => setActiveTab('profile')}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto min-h-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              meetings={meetings}
              actionItems={actionItems}
              decisions={decisions}
              notifications={notifications}
              setActiveTab={setActiveTab}
              setSelectedMeeting={setSelectedMeeting}
              loading={dataLoading}
              error={dataError}
              onRefreshData={loadAllData}
              onOpenUploadModal={() => setActiveTab('meetings')}
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
              actionItems={actionItems}
              decisions={decisions}
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
            <ChatPage
              messages={chatMessages}
              setMessages={setChatMessages}
              meetings={meetings}
            />
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
              setNotifications={setNotifications}
              setActiveTab={setActiveTab}
              setSelectedMeeting={setSelectedMeeting}
              refreshNotifications={loadAllData}
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
