import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-transform duration-300 scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Hướng dẫn sử dụng</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4 text-slate-600 prose prose-slate max-w-none">
          <p>Chào mừng bạn đến với Trợ lý Soạn Giáo Án AI! Dưới đây là các bước để tạo một giáo án hoàn chỉnh:</p>
          <ol>
            <li>
              <strong>Điền thông tin bài giảng:</strong> Cung cấp các thông tin cơ bản như Tên giáo viên, Tên bài dạy, Môn học, Lớp, và các tùy chọn khác. AI có thể tự suy luận Môn học, Lớp, và Tên bài dạy nếu bạn để trống.
            </li>
            <li>
              <strong>Tải lên Sách giáo khoa:</strong> Nhấn vào khu vực tải lên để chọn hoặc kéo thả file ảnh (JPG, PNG) hoặc PDF của trang sách giáo khoa cần soạn. Bạn có thể tải lên nhiều tệp.
            </li>
            <li>
              <strong>(Tùy chọn) Sử dụng Mẫu riêng:</strong> Nếu bạn có một mẫu giáo án riêng, hãy tích vào ô "Sử dụng mẫu của riêng bạn" và tải lên tệp mẫu (.txt, .md, .pdf, .docx). AI sẽ điền nội dung vào đúng mẫu này.
            </li>
            <li>
              <strong>Tạo Giáo Án:</strong> Sau khi đã cung cấp đủ thông tin, nhấn vào nút "✨ Tạo Giáo Án". AI sẽ bắt đầu phân tích và soạn thảo.
            </li>
            <li>
              <strong>Nhận kết quả:</strong> Chờ trong giây lát, giáo án hoàn chỉnh sẽ xuất hiện ở khung bên phải. Bạn có thể xem lại, sao chép nội dung hoặc in trực tiếp.
            </li>
          </ol>
          <p className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg"><strong>Mẹo:</strong> Cung cấp hình ảnh SGK càng rõ nét và đầy đủ, chất lượng giáo án do AI tạo ra sẽ càng cao!</p>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right rounded-b-xl">
            <button onClick={onClose} className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Đã hiểu
            </button>
        </div>
      </div>
       <style>{`
        @keyframes modal-enter {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-modal-enter {
            animation: modal-enter 0.2s ease-out forwards;
        }
       `}</style>
    </div>
  );
};
