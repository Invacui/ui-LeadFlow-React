import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFile: (file: File) => void;
  accept?: Record<string, string[]>;
  className?: string;
  file?: File | null;
}

export function FileDropzone({ onFile, accept, className, file }: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) onFile(acceptedFiles[0]);
    },
    [onFile],
  );

  const dropzoneOptions = {
    onDrop,
    maxFiles: 1,
    ...(accept !== undefined && { accept }),
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
        className,
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="h-8 w-8 text-muted-foreground" />
      {file ? (
        <p className="text-sm font-medium">{file.name}</p>
      ) : (
        <>
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-muted-foreground">CSV or XLSX</p>
        </>
      )}
    </div>
  );
}
