/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { AppState, Customer, Project, Room } from './types';
import { getInitialState, saveStateToStorage, recalculateProject, recalculateRoom } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { QuickActionModal } from './components/QuickActionModal';
import { DashboardView } from './components/DashboardView';
import { CustomerManagementView } from './components/CustomerManagementView';
import { ProjectManagementView } from './components/ProjectManagementView';
import { RoomManagementView } from './components/RoomManagementView';
import { LoadCalculatorView } from './components/LoadCalculatorView';
import { CableCalculatorView } from './components/CableCalculatorView';
import { BreakerCalculatorView } from './components/BreakerCalculatorView';
import { MaterialsView } from './components/MaterialsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { CostAndBillView } from './components/CostAndBillView';
import { ReportPrintView } from './components/ReportPrintView';
import { SettingsView } from './components/SettingsView';
import { ApkAndInstallModal } from './components/ApkAndInstallModal';

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Exit confirmation modal state for Android Back Button
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return state.settings.theme === 'dark';
  });

  // Quick Action Modal state
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'customer' | 'project' | 'room' | 'calc'>('customer');

  // APK & Phone Install Guide Modal state
  const [apkModalOpen, setApkModalOpen] = useState(false);

  // Android Hardware Back Button Handler with Exit Dialog
  useEffect(() => {
    const handleBackButton = CapacitorApp.addListener('backButton', () => {
      if (currentTab !== 'dashboard') {
        // If not on home/dashboard, go back to dashboard
        setCurrentTab('dashboard');
      } else {
        // If already on dashboard, show exit confirmation popup
        setExitConfirmOpen(true);
      }
    });

    return () => {
      handleBackButton.then(subscriber => subscriber.remove());
    };
  }, [currentTab]);

  // Sync theme with DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-save state changes to LocalStorage
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Current active records
  const activeProject = state.projects.find((p) => p.id === state.activeProjectId) || state.projects[0] || null;
  const activeCustomer = state.customers.find((c) => c.id === state.activeCustomerId) || state.customers[0] || null;

  // CUSTOMER ACTIONS
  const handleSelectCustomer = (id: string) => {
    setState((prev) => ({ ...prev, activeCustomerId: id }));
  };

  const handleAddCustomer = (customer: Customer) => {
    setState((prev) => ({
      ...prev,
      customers: [customer, ...prev.customers],
      activeCustomerId: customer.id
    }));
  };

  const handleUpdateCustomer = (customer: Customer) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === customer.id ? customer : c))
    }));
  };

  const handleDeleteCustomer = (id: string) => {
    setState((prev) => {
      const remaining = prev.customers.filter((c) => c.id !== id);
      return {
        ...prev,
        customers: remaining,
        activeCustomerId: remaining[0]?.id || null
      };
    });
  };

  // PROJECT ACTIONS
  const handleSelectProject = (id: string) => {
    setState((prev) => ({ ...prev, activeProjectId: id }));
  };

  const handleAddProject = (project: Project) => {
    const calculated = recalculateProject(project);
    setState((prev) => ({
      ...prev,
      projects: [calculated, ...prev.projects],
      activeProjectId: calculated.id
    }));
  };

  const handleUpdateProject = (project: Project) => {
    const calculated = recalculateProject(project);
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === calculated.id ? calculated : p))
    }));
  };

  const handleDeleteProject = (id: string) => {
    setState((prev) => {
      const remaining = prev.projects.filter((p) => p.id !== id);
      return {
        ...prev,
        projects: remaining,
        activeProjectId: remaining[0]?.id || null
      };
    });
  };

  // ROOM ACTIONS
  const handleAddRoom = (projectId: string, room: Room) => {
    setState((prev) => {
      const targetProj = prev.projects.find((p) => p.id === projectId);
      if (!targetProj) return prev;

      const calcRoom = recalculateRoom(room, targetProj.voltage, targetProj.powerFactor);
      const updatedRooms = [...targetProj.rooms, calcRoom];
      const updatedProj = recalculateProject({ ...targetProj, rooms: updatedRooms });

      return {
        ...prev,
        projects: prev.projects.map((p) => (p.id === projectId ? updatedProj : p))
      };
    });
  };

  const handleUpdateRoom = (projectId: string, room: Room) => {
    setState((prev) => {
      const targetProj = prev.projects.find((p) => p.id === projectId);
      if (!targetProj) return prev;

      const calcRoom = recalculateRoom(room, targetProj.voltage, targetProj.powerFactor);
      const updatedRooms = targetProj.rooms.map((r) => (r.id === calcRoom.id ? calcRoom : r));
      const updatedProj = recalculateProject({ ...targetProj, rooms: updatedRooms });

      return {
        ...prev,
        projects: prev.projects.map((p) => (p.id === projectId ? updatedProj : p))
      };
    });
  };

  const handleDeleteRoom = (projectId: string, roomId: string) => {
    setState((prev) => {
      const targetProj = prev.projects.find((p) => p.id === projectId);
      if (!targetProj) return prev;

      const updatedRooms = targetProj.rooms.filter((r) => r.id !== roomId);
      const updatedProj = recalculateProject({ ...targetProj, rooms: updatedRooms });

      return {
        ...prev,
        projects: prev.projects.map((p) => (p.id === projectId ? updatedProj : p))
      };
    });
  };

  const handleDuplicateRoom = (projectId: string, sourceRoom: Room) => {
    const duplicatedRoom: Room = {
      ...sourceRoom,
      id: `room-${Date.now()}`,
      name: `${sourceRoom.name} (কপি)`,
      devices: sourceRoom.devices.map((d) => ({
        ...d,
        id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      })),
      materials: sourceRoom.materials.map((m) => ({
        ...m,
        id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleAddRoom(projectId, duplicatedRoom);
  };

  const handleOpenQuickAction = (type: 'customer' | 'project' | 'room' | 'calc' = 'customer') => {
    setQuickActionType(type);
    setQuickActionOpen(true);
  };

  // Badge counts
  const totalRooms = state.projects.reduce((sum, p) => sum + p.rooms.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        setActiveProjectId={handleSelectProject}
        onOpenQuickAction={handleOpenQuickAction}
        onOpenApkGuide={() => setApkModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenApkGuide={() => setApkModalOpen(true)}
          counts={{
            customers: state.customers.length,
            projects: state.projects.length,
            rooms: totalRooms
          }}
        />

        {/* Content View Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              state={state}
              onNavigateTo={setCurrentTab}
              onSelectProject={handleSelectProject}
              onOpenQuickAction={handleOpenQuickAction}
            />
          )}

          {currentTab === 'customers' && (
            <CustomerManagementView
              customers={state.customers}
              projects={state.projects}
              activeCustomerId={state.activeCustomerId}
              onSelectCustomer={handleSelectCustomer}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onSelectProject={handleSelectProject}
              onNavigateTo={setCurrentTab}
              onOpenQuickAction={handleOpenQuickAction}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectManagementView
              projects={state.projects}
              customers={state.customers}
              activeProjectId={state.activeProjectId}
              onSelectProject={handleSelectProject}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onNavigateTo={setCurrentTab}
              onOpenQuickAction={handleOpenQuickAction}
            />
          )}

          {currentTab === 'rooms' && (
            <RoomManagementView
              project={activeProject}
              projects={state.projects}
              onSelectProject={handleSelectProject}
              onAddRoom={handleAddRoom}
              onUpdateRoom={handleUpdateRoom}
              onDeleteRoom={handleDeleteRoom}
              onDuplicateRoom={handleDuplicateRoom}
            />
          )}

          {currentTab === 'load-calculator' && (
            <LoadCalculatorView
              activeProject={activeProject}
              onNavigateTo={setCurrentTab}
            />
          )}

          {currentTab === 'cable-calculator' && <CableCalculatorView />}

          {currentTab === 'breaker-calculator' && <BreakerCalculatorView />}

          {currentTab === 'materials' && (
            <MaterialsView
              activeProject={activeProject}
              onUpdateProject={handleUpdateProject}
              onOpenQuickAction={handleOpenQuickAction}
            />
          )}

          {currentTab === 'knowledge' && <KnowledgeBaseView />}

          {currentTab === 'billing' && (
            <CostAndBillView
              activeProject={activeProject}
              onUpdateProject={handleUpdateProject}
              onNavigateTo={setCurrentTab}
            />
          )}

          {currentTab === 'reports' && (
            <ReportPrintView
              project={activeProject}
              customer={activeCustomer}
              settings={state.settings}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              state={state}
              onUpdateState={setState}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </main>
      </div>

      {/* Global Quick Action Modal */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        defaultAction={quickActionType}
        customers={state.customers}
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        onAddCustomer={handleAddCustomer}
        onAddProject={handleAddProject}
        onAddRoom={handleAddRoom}
        onNavigateTo={setCurrentTab}
      />

      {/* Exit Confirmation Modal (Yes / No) */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              অ্যাপ থেকে প্রস্থান
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              আপনি কি সত্যিই অ্যাপস থেকে বের হতে চান?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setExitConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
              >
                না
              </button>
              <button
                onClick={() => CapacitorApp.exitApp()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
              >
                হ্যাঁ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
