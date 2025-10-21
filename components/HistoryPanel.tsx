import React from 'react';
import { HistoryEntry } from '../types';
import { RestoreIcon } from './icons/RestoreIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRestore: (plan: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryItem: React.FC<{ item: HistoryEntry; onRestore: (plan: string) => void; onDelete: (id: string) => void }> = ({ item, onRestore, onDelete }) => {
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    return "Vài giây trước";
  };
  
  return (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <p className="font-semibold text-slate-800 text-sm truncate">{item.title}</p>
        <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">{timeAgo(item.timestamp)}</span>
            <div className="flex items-center space-x-1">
                <button onClick={() => onRestore(item.lessonPlan)} title="Khôi phục" className="p-1.5 text-slate-500 rounded-md hover:bg-indigo-100 hover:text-indigo-600">
                    <RestoreIcon />
                </button>
                 <button onClick={() => onDelete(item.id)} title="Xóa" className="p-1.5 text-slate-500 rounded-md hover:bg-red-100 hover:text-red-600">
                    <TrashIcon />
                </button>
            </div>
        </div>
    </div>
  )
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onRestore, onDelete, onClear }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-slate-800">Lịch sử Soạn thảo</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {history.length > 0 ? (
                    history.map(item => <HistoryItem key={item.id} item={item} onRestore={onRestore} onDelete={onDelete} />)
                ) : (
                    <div className="text-center text-slate-500 pt-10">
                        <p className="text-4xl mb-2">🗂️</p>
                        <p className="font-semibold">Chưa có lịch sử</p>
                        <p className="text-sm">Các giáo án bạn tạo sẽ được lưu ở đây.</p>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="p-4 border-t">
                    <button 
                        onClick={() => { if(window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) onClear(); }}
                        className="w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors"
                    >
                        Xóa toàn bộ lịch sử
                    </button>
                </div>
            )}
        </div>
      </aside>
    </>
  );
};
