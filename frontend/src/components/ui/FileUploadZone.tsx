'use client';

import { useCallback, useState } from 'react';
import { Upload, X, FileText, FileSpreadsheet, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface UploadedFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
}

interface FileUploadZoneProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesChange?: (files: UploadedFile[]) => void;
  className?: string;
}

function getFileIcon(file: File) {
  if (file.type === 'application/pdf') return <FileText className="w-5 h-5 text-rose-500" />;
  if (file.type.includes('spreadsheet') || file.type.includes('excel'))
    return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
  if (file.type.startsWith('image/'))
    return <ImageIcon className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-slate-500" />;
}

export default function FileUploadZone({
  label = 'Drag & drop file di sini, atau klik untuk memilih',
  accept = 'application/pdf,.xlsx,.xls',
  maxSizeMB = 10,
  multiple = true,
  onFilesChange,
  className,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError('');
      const fileArray = Array.from(newFiles);
      const valid: UploadedFile[] = [];

      for (const file of fileArray) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File "${file.name}" melebihi ukuran maksimum ${maxSizeMB}MB.`);
          continue;
        }
        valid.push({ file, id: Math.random().toString(36).slice(2), status: 'pending' });
      }

      const updated = multiple ? [...files, ...valid] : valid.slice(0, 1);
      setFiles(updated);
      onFilesChange?.(updated);
    },
    [files, maxSizeMB, multiple, onFilesChange]
  );

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {/* Drop zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn('drop-zone cursor-pointer group', isDragging && 'dragging')}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <input
          id="file-upload-input"
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
            isDragging ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-50'
          )}>
            <Upload className={cn(
              'w-5 h-5 transition-colors',
              isDragging ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'
            )} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="text-xs text-slate-400 mt-1">
              PDF, XLSX &mdash; Maks. {maxSizeMB}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg animate-fade-in"
            >
              {getFileIcon(f.file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{f.file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(f.file.size)}</p>
              </div>
              {f.status === 'uploading' && (
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin shrink-0" />
              )}
              {f.status !== 'uploading' && (
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 shrink-0 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
