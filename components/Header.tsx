import React, { useState } from 'react';
import { HelpModal } from './HelpModal';
import { QuestionMarkIcon } from './icons/QuestionMarkIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
    onToggleHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
              </svg>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Trợ Lý Soạn Giáo Án AI
              </h1>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                  onClick={onToggleHistory}
                  className="flex items-center space-x-2 text-sm font-semibold p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Lịch sử soạn thảo"
                >
                    <HistoryIcon />
                    <span className="hidden md:block">Lịch sử</span>
                </button>
                <button 
                  onClick={() => setIsHelpModalOpen(true)}
                  className="flex items-center space-x-2 text-sm font-semibold p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Hướng dẫn sử dụng"
                >
                    <QuestionMarkIcon />
                    <span className="hidden md:block">Hướng dẫn</span>
                </button>
            </div>
          </div>
        </div>
      </header>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};
