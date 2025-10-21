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
          <p>Chào mừng bạn đến với <strong>Trợ lý Soạn Giáo Án AI</strong>! Công cụ này được thiết kế để giúp bạn tạo giáo án chất lượng cao một cách nhanh chóng và hiệu quả.</p>
          
          <h3 className="!text-lg !font-semibold !text-slate-800 !mt-6 !mb-2">Quy trình 3 bước đơn giản</h3>
          <ol>
            <li>
              <strong>Cung cấp thông tin:</strong>
              <ul className="!mt-1 !mb-3">
                <li>Điền các thông tin cơ bản về bài dạy. AI có thể tự suy luận một số mục nếu để trống.</li>
                <li>Chọn số tiết và thời lượng sẽ được tự động tính toán theo quy định.</li>
                <li>Tùy chọn, bạn có thể tải lên mẫu giáo án riêng (.docx, .pdf, .txt...) để AI điền vào.</li>
              </ul>
            </li>
            <li>
              <strong>Tải lên Sách giáo khoa:</strong>
              <ul className="!mt-1 !mb-3">
                  <li>Nhấn vào khu vực tải lên để chọn hoặc kéo thả file ảnh (JPG, PNG) hoặc PDF của trang sách giáo khoa.</li>
                  <li>Bạn có thể tải lên nhiều tệp để cung cấp đầy đủ ngữ cảnh cho AI.</li>
              </ul>
            </li>
            <li>
              <strong>Tạo và Tinh chỉnh:</strong>
              <ul className="!mt-1 !mb-3">
                  <li>Nhấn nút <strong>"✨ Tạo Giáo Án"</strong>.</li>
                  <li>Giáo án sẽ xuất hiện ở khung bên phải. Đừng dừng lại ở đó! Hãy sử dụng hộp chat bên dưới để yêu cầu AI tinh chỉnh thêm (ví dụ: <i>"thêm 3 câu hỏi trắc nghiệm"</i>, <i>"rút gọn hoạt động 2"</i>).</li>
              </ul>
            </li>
          </ol>

          <h3 className="!text-lg !font-semibold !text-slate-800 !mt-6 !mb-2">Các tính năng hữu ích khác</h3>
            <ul className="!list-none !pl-0">
                <li className="flex items-start">
                    <span className="mr-3 text-indigo-500 pt-1">✏️</span>
                    <div><strong>Chỉnh sửa trực tiếp:</strong> Nhấn nút "Chỉnh sửa" để sửa đổi nội dung giáo án trực tiếp trên trang.</div>
                </li>
                <li className="flex items-start mt-2">
                    <span className="mr-3 text-indigo-500 pt-1">📋</span>
                    <div><strong>Sao chép &amp; In ấn:</strong> Dễ dàng sao chép toàn bộ nội dung hoặc in giáo án ra giấy với định dạng chuẩn.</div>
                </li>
                <li className="flex items-start mt-2">
                    <span className="mr-3 text-indigo-500 pt-1">🕒</span>
                    <div><strong>Lịch sử soạn thảo:</strong> Xem lại, khôi phục hoặc xóa các giáo án đã tạo trước đây từ thanh lịch sử.</div>
                </li>
            </ul>

          <p className="text-sm text-indigo-600 bg-indigo-50 p-3 rounded-lg !mt-6">
            <strong>Mẹo:</strong> Cung cấp hình ảnh SGK rõ nét và ghi chú cụ thể sẽ giúp AI tạo ra giáo án chất lượng và sát với yêu cầu của bạn nhất!
          </p>
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