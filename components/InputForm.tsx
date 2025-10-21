import React, { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormState, ImageFile } from '../types';
import { CIRCULAR_OPTIONS } from '../constants';
import { readTemplateFile } from '../utils/templateReader';
import { UploadIcon } from './icons/UploadIcon';

interface InputFormProps {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  imageFiles: ImageFile[];
  setImageFiles: React.Dispatch<React.SetStateAction<ImageFile[]>>;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  formData,
  setFormData,
  imageFiles,
  setImageFiles,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [templateFileName, setTemplateFileName] = useState('');
  const [templateError, setTemplateError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const [numberOfPeriods, setNumberOfPeriods] = useState(1);

  const getMinutesPerPeriod = useCallback((level: string): number => {
    const match = level.match(/\d+/);
    if (match) {
        const grade = parseInt(match[0], 10);
        if (grade >= 1 && grade <= 5) {
            return 35; // Tiểu học
        }
    }
    return 45; // THCS, THPT, hoặc mặc định
  }, []);

  useEffect(() => {
    const minutesPerPeriod = getMinutesPerPeriod(formData.classLevel);
    const totalMinutes = numberOfPeriods * minutesPerPeriod;
    const newDuration = `${numberOfPeriods} tiết (${totalMinutes} phút)`;
    
    if (formData.duration !== newDuration) {
        setFormData(prev => ({ ...prev, duration: newDuration }));
    }
  }, [numberOfPeriods, formData.classLevel, formData.duration, setFormData, getMinutesPerPeriod]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => {
      const newCirculars = checked
        ? [...prev.circulars, id]
        : prev.circulars.filter(c => c !== id);
      return { ...prev, circulars: newCirculars };
    });
  };

  const handleImageFiles = useCallback((files: FileList) => {
    const newFiles: ImageFile[] = Array.from(files)
      .filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
      .map(file => ({
        id: uuidv4(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      }));
    if (newFiles.length > 0) {
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Limit to 10 files
    }
  }, [setImageFiles]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageFiles(e.target.files);
      // Reset file input to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    const imageToRemove = imageFiles.find(f => f.id === id);
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImageFiles(prev => prev.filter(f => f.id !== id));
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const handleTemplateFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateError(null);
      setTemplateFileName(file.name);
      try {
        const content = await readTemplateFile(file);
        setFormData(prev => ({ ...prev, customTemplate: content }));
      } catch (err: any) {
        setTemplateError(err.message);
        setTemplateFileName('');
      }
    }
  };
  
  const triggerImageInput = () => imageInputRef.current?.click();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 border-b pb-3 mb-4">Thông tin Giáo án</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="teacherName" className="block text-sm font-medium text-slate-700">Tên giáo viên</label>
              <input type="text" id="teacherName" name="teacherName" value={formData.teacherName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="lessonTitle" className="block text-sm font-medium text-slate-700">Tên bài dạy</label>
              <input type="text" id="lessonTitle" name="lessonTitle" value={formData.lessonTitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="AI có thể tự suy luận" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Môn học</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="AI có thể tự suy luận" />
            </div>
            <div>
              <label htmlFor="classLevel" className="block text-sm font-medium text-slate-700">Lớp</label>
              <input type="text" id="classLevel" name="classLevel" value={formData.classLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="VD: 5, 9, 11" />
            </div>
             <div>
                <label htmlFor="numberOfPeriods" className="block text-sm font-medium text-slate-700">Số tiết</label>
                <select 
                    id="numberOfPeriods" 
                    name="numberOfPeriods" 
                    value={numberOfPeriods} 
                    onChange={(e) => setNumberOfPeriods(parseInt(e.target.value, 10))} 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value={1}>1 tiết</option>
                    <option value={2}>2 tiết</option>
                    <option value={3}>3 tiết</option>
                </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Áp dụng theo</label>
              <div className="mt-2 flex space-x-4">
                {CIRCULAR_OPTIONS.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input id={option.id} name="circulars" type="checkbox" checked={formData.circulars.includes(option.id)} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <label htmlFor={option.id} className="ml-2 block text-sm text-slate-900">{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800">Thời lượng dự kiến:</strong> {formData.duration}
              <br/>
              <span className="text-xs text-slate-500 italic">
                (Tự động tính theo Công văn 4567: 35 phút/tiết cho Tiểu học, 45 phút/tiết cho THCS & THPT)
              </span>
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Ghi chú thêm</label>
          <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ví dụ: Nhấn mạnh vào hoạt động nhóm, thêm câu hỏi vận dụng cao..."></textarea>
        </div>
        
        <div>
          <h3 className="text-base font-semibold text-slate-800">Tải lên Sách Giáo Khoa</h3>
          <div
            role="button"
            tabIndex={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerImageInput}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerImageInput(); }}
            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'} border-dashed rounded-md cursor-pointer transition-colors`}
          >
            <div className="space-y-1 text-center">
              <UploadIcon />
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-indigo-600">Tải lên tệp</span> hoặc kéo và thả
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, PDF</p>
            </div>
            <input ref={imageInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageFileChange} accept="image/png, image/jpeg, application/pdf" />
          </div>
           {imageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imageFiles.map(imageFile => (
                <div key={imageFile.id} className="relative group bg-slate-100 rounded-md overflow-hidden">
                  {imageFile.file.type.startsWith('image/') ? (
                    <img src={imageFile.preview} alt={imageFile.file.name} className="h-24 w-full object-cover" />
                  ) : (
                    <div className="h-24 w-full bg-slate-100 rounded-md flex flex-col items-center justify-center p-2 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span className="text-xs text-slate-600 mt-1 truncate">{imageFile.file.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => handleRemoveImage(imageFile.id)} className="text-white bg-red-500 rounded-full h-6 w-6 flex items-center justify-center leading-none text-xl font-bold pb-1" title={`Remove ${imageFile.file.name}`}>&times;</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="useCustomTemplate"
                name="useCustomTemplate"
                type="checkbox"
                checked={formData.useCustomTemplate}
                onChange={(e) => setFormData(prev => ({...prev, useCustomTemplate: e.target.checked}))}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="useCustomTemplate" className="font-medium text-gray-700">Sử dụng mẫu của riêng bạn</label>
              <p className="text-gray-500">Tải lên tệp .txt, .md, .docx hoặc .pdf để AI điền vào mẫu của bạn.</p>
            </div>
          </div>
          {formData.useCustomTemplate && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => templateInputRef.current?.click()}
                className="w-full text-sm text-center px-4 py-2 border border-slate-300 rounded-md shadow-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                {templateFileName || 'Chọn tệp mẫu...'}
              </button>
              <input ref={templateInputRef} type="file" className="sr-only" onChange={handleTemplateFileChange} accept=".txt,.md,.pdf,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
              {templateError && <p className="mt-2 text-sm text-red-600">{templateError}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <button type="button" onClick={onReset} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Xóa hết
          </button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tạo...</span>
              </>
            ) : '✨ Tạo Giáo Án'}
          </button>
        </div>
      </form>
    </div>
  );
};