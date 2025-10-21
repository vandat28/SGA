import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from './Spinner';
import { ChatInput } from './ChatInput';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { PrintIcon } from './icons/PrintIcon';
import { EditIcon } from './icons/EditIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CancelIcon } from './icons/CancelIcon';

interface LessonPlanDisplayProps {
  lessonPlan: string;
  isLoading: boolean;
  error: string | null;
  onUpdate: (newPlan: string) => void;
  chatSessionActive: boolean;
  onRefinementSubmit: (message: string) => void;
  isRefining: boolean;
}

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ 
  lessonPlan, 
  isLoading, 
  error, 
  onUpdate,
  chatSessionActive,
  onRefinementSubmit,
  isRefining
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && !isEditing) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [lessonPlan, isEditing]);
  
  useEffect(() => {
    if (!isLoading) {
      setEditedContent(lessonPlan);
    }
  }, [lessonPlan, isLoading]);
  
  const handleEdit = () => {
    setEditedContent(lessonPlan);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCopy = () => {
    const contentToCopy = isEditing ? editedContent : lessonPlan;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && contentRef.current) {
        printWindow.document.write('<html><head><title>In Giáo Án</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style> @page { size: A4; margin: 1in; } body { font-family: sans-serif; } .prose { max-width: 100% !important; } .prose table { border-collapse: collapse; width: 100%; } .prose th, .prose td { border: 1px solid #ccc; padding: 8px; } </style>');
        printWindow.document.write('</head><body class="p-4">');
        printWindow.document.write(`<div class="prose prose-sm max-w-none">${contentRef.current.innerHTML}</div>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
  };

  const renderContent = () => {
    if (isLoading && !lessonPlan) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Spinner />
          <p className="mt-4 text-slate-600 font-semibold">AI đang soạn giáo án...</p>
          <p className="mt-2 text-sm text-slate-500">Nội dung sẽ xuất hiện ngay khi có. Vui lòng chờ.</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>;
    }
    if (lessonPlan || isEditing) {
      if (isEditing) {
        return (
           <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[calc(100vh-250px)] lg:min-h-0 resize-none bg-white border border-indigo-300 rounded-md p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            aria-label="Trình soạn thảo giáo án"
          />
        )
      }
      return (
        <>
          <div ref={contentRef} className="prose prose-slate max-w-none prose-h3:text-center prose-h3:text-3xl prose-h3:font-extrabold prose-h3:tracking-tight prose-h3:text-slate-900 prose-h3:mb-2 prose-h4:font-bold prose-h4:text-xl prose-h4:text-indigo-700 prose-h4:mt-8 prose-h4:mb-4 prose-h4:border-b-2 prose-h4:border-indigo-200 prose-h4:pb-2 prose-h5:font-semibold prose-h5:text-lg prose-h5:text-slate-800 prose-h5:mt-6 prose-h5:mb-3 prose-p:leading-7 prose-ul:pl-5 prose-li:my-1 prose-strong:font-semibold prose-strong:text-slate-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {lessonPlan}
            </ReactMarkdown>
          </div>
          {isLoading && <span className="blinking-cursor">▍</span>}
        </>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-slate-700">Khu vực hiển thị giáo án</h3>
        <p className="max-w-md mt-2">Giáo án sẽ được hiển thị ở đây sau khi bạn nhập thông tin, tải ảnh lên và nhấn "Tạo Giáo Án".</p>
      </div>
    );
  };

  const hasContent = lessonPlan || editedContent;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80 lg:sticky lg:top-8 flex flex-col max-h-[calc(100vh-5rem)]">
        <div className="flex justify-between items-center p-6 pb-3 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold text-slate-800">Kết quả Giáo án</h2>
            {hasContent && !isLoading && (
                 <div className="flex items-center space-x-1">
                    {isEditing ? (
                        <>
                         <button onClick={handleSave} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-green-600 transition-colors" title="Lưu thay đổi">
                            <SaveIcon />
                          </button>
                          <button onClick={handleCancel} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors" title="Hủy">
                            <CancelIcon />
                          </button>
                        </>
                    ) : (
                        <>
                         <button onClick={handleEdit} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="Chỉnh sửa">
                            <EditIcon />
                         </button>
                         <button onClick={handleCopy} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title={copied ? "Đã sao chép!" : "Sao chép"}>
                             <ClipboardIcon copied={copied} />
                         </button>
                         <button onClick={handlePrint} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors" title="In">
                             <PrintIcon />
                         </button>
                        </>
                    )}
                </div>
            )}
        </div>
      <style>{`
        .blinking-cursor {
          animation: blink 1s step-end infinite;
          font-weight: 600;
          color: #4f46e5;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        /* Cải thiện hiển thị bảng cho dễ nhìn hơn */
        .prose table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5em;
            margin-bottom: 1.5em;
            font-size: 0.95em;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .prose th, .prose td {
            border: 1px solid #e2e8f0; /* slate-200 */
            padding: 0.75rem 1rem;
            text-align: left;
            vertical-align: top;
        }
        .prose thead {
            background-color: #f8fafc; /* slate-50 */
        }
        .prose thead th {
            font-weight: 600;
            color: #334155; /* slate-700 */
            border-bottom: 2px solid #cbd5e1; /* slate-300 */
        }
        .prose table p:first-child {
            margin-top: 0;
        }
        .prose table p:last-child {
            margin-bottom: 0;
        }
      `}</style>
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6">
        {renderContent()}
      </div>
       {chatSessionActive && (
        <div className="p-6 pt-4 border-t bg-white rounded-b-xl flex-shrink-0">
          <ChatInput
            onSendMessage={onRefinementSubmit}
            isLoading={isRefining}
          />
        </div>
      )}
    </div>
  );
};