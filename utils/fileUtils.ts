import { Part } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for pdf.js. This is crucial for performance and to avoid errors.
// The worker is fetched from a reliable CDN.
try {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
} catch (e) {
    console.error("Failed to set PDF.js worker source.", e)
}


function fileToB64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the header: 'data:image/png;base64,'
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
}

async function extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
        fullText += pageText + '\n\n'; // Add newlines between pages
    }

    return fullText;
}


export async function fileToGenerativeParts(file: File): Promise<Part[]> {
    const base64EncodedData = await fileToB64(file);
    const filePart: Part = {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type,
        },
    };

    if (file.type === 'application/pdf') {
        try {
            const extractedText = await extractTextFromPdf(file);
            if (extractedText.trim()) {
                const textPart: Part = {
                    text: `Nội dung văn bản được trích xuất từ tệp PDF đính kèm: \n\n---\n\n${extractedText}\n\n---\n\nHãy sử dụng nội dung này cùng với việc phân tích tệp PDF gốc để có kết quả tốt nhất.`,
                };
                return [filePart, textPart];
            }
        } catch (error) {
            console.error(`Không thể trích xuất văn bản từ PDF ${file.name}:`, error);
            // Fallback to just sending the file if text extraction fails
        }
    }

    return [filePart];
}
