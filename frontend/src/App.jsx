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

import {
  fetchMeetings,
  fetchActionItems,
  fetchDecisions,
  fetchKnowledgeDocs,
  fetchNotifications,
  getCurrentUser
} from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [meetings, setMeetings] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-sky-50/70 to-sky-100/80 text-slate-900 font-sans">
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
          onOpenAuthModal={() => setShowAuthModal(true)}
          onLogout={() => {
            setCurrentUser(getCurrentUser());
            setShowAuthModal(true);
          }}
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
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadAllData();
        }}
      />
    </div>
  );
}
