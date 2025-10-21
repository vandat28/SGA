import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up the worker for pdf.js. This is crucial for performance and to avoid errors.
// The worker is fetched from a reliable CDN.
try {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
} catch (e) {
    console.error("Failed to set PDF.js worker source.", e)
}


/**
 * Reads the text content from various file types (txt, md, pdf, docx).
 * @param file The file to read.
 * @returns A promise that resolves with the text content of the file.
 */
export async function readTemplateFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    if (extension === 'txt' || extension === 'md' || mimeType === 'text/plain') {
        return readTextFile(file);
    }
    if (extension === 'pdf' || mimeType === 'application/pdf') {
        return readPdfFile(file);
    }
    if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return readDocxFile(file);
    }

    throw new Error('Định dạng tệp không được hỗ trợ.');
}

function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target?.result as string);
        };
        reader.onerror = (error) => {
            reject(new Error('Không thể đọc tệp văn bản.'));
        };
        reader.readAsText(file);
    });
}

async function readPdfFile(file: File): Promise<string> {
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

async function readDocxFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
