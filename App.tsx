import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormState, ImageFile, HistoryEntry } from './types';
import { Chat, Part } from '@google/genai';
import { startChatSession } from './services/geminiService';
import { fileToGenerativeParts } from './utils/fileUtils';
import { loadHistory, saveHistory, addToHistory } from './utils/historyUtils';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { CIRCULAR_OPTIONS } from './constants';

const initialFormState: FormState = {
  teacherName: '',
  lessonTitle: '',
  subject: '',
  classLevel: '',
  program: 'GDPT 2018',
  circulars: [CIRCULAR_OPTIONS[0].id],
  duration: '1 tiết (45 phút)',
  notes: '',
  useCustomTemplate: false,
  customTemplate: '',
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [lessonPlan, setLessonPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleSubmit = async () => {
    if (imageFiles.length === 0) {
      setError('Vui lòng tải lên ít nhất một hình ảnh sách giáo khoa.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLessonPlan('');
    setChatSession(null); // Reset chat on new generation
    let accumulatedPlan = '';

    try {
      const chat = startChatSession(formData);
      setChatSession(chat);

      const nestedParts = await Promise.all(
        imageFiles.map(imageFile => fileToGenerativeParts(imageFile.file))
      );
      const imageParts: Part[] = nestedParts.flat();

      const responseStream = await chat.sendMessageStream({ message: [
          ...imageParts,
          { text: "Dựa vào (các) hình ảnh sách giáo khoa này, hãy tạo giáo án." }
      ]});
      
      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        accumulatedPlan += chunkText;
        setLessonPlan(prev => prev + chunkText);
      }

      if (accumulatedPlan.trim()) {
        const newEntry: HistoryEntry = {
          id: uuidv4(),
          timestamp: Date.now(),
          title: formData.lessonTitle || accumulatedPlan.split('\n')[0].replace(/#+\s*/, '').substring(0, 50) || 'Giáo án không có tiêu đề',
          lessonPlan: accumulatedPlan,
        };
        const updatedHistory = addToHistory(newEntry, history);
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
      }

    } catch (e: any) {
      setError(`Đã xảy ra lỗi khi tạo giáo án: ${e.message}`);
      setChatSession(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefinementSubmit = async (message: string) => {
    if (!chatSession || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setLessonPlan(''); // Clear previous plan to show the new one streaming in
    let accumulatedPlan = '';

    try {
        const responseStream = await chatSession.sendMessageStream({ message });

        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            accumulatedPlan += chunkText;
            setLessonPlan(prev => prev + chunkText);
        }

        if (accumulatedPlan.trim()) {
            const newEntry: HistoryEntry = {
                id: uuidv4(),
                timestamp: Date.now(),
                title: `(Tinh chỉnh) ${formData.lessonTitle || 'Giáo án'}`,
                lessonPlan: accumulatedPlan,
            };
            const updatedHistory = addToHistory(newEntry, history);
            setHistory(updatedHistory);
            saveHistory(updatedHistory);
        }
    } catch (e: any) {
         setError(`Đã xảy ra lỗi khi tinh chỉnh giáo án: ${e.message}`);
    } finally {
        setIsLoading(false);
    }
};


  const handleReset = () => {
    setFormData(initialFormState);
    setImageFiles([]);
    setLessonPlan('');
    setError(null);
    setChatSession(null);
  };

  const handleLessonPlanUpdate = (newPlan: string) => {
    setLessonPlan(newPlan);
  };

  const handleRestoreFromHistory = (plan: string) => {
    setLessonPlan(plan);
    setError(null);
    setChatSession(null); // Reset chat when restoring old plan
    setIsHistoryOpen(false);
  };
  
  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header onToggleHistory={() => setIsHistoryOpen(prev => !prev)} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputForm
            formData={formData}
            setFormData={setFormData}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isLoading}
          />
          <div>
            <LessonPlanDisplay
              lessonPlan={lessonPlan}
              isLoading={isLoading}
              error={error}
              onUpdate={handleLessonPlanUpdate}
              chatSessionActive={!!chatSession && !error}
              onRefinementSubmit={handleRefinementSubmit}
              isRefining={isLoading}
            />
          </div>
        </div>
      </main>
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreFromHistory}
        onDelete={handleDeleteHistoryItem}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;