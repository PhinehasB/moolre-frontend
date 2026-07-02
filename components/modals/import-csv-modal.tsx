"use client";

import { Modal } from "@/components/ui/modal";
import { Download, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  onDownloadTemplate?: () => void;
  isSubmitting?: boolean;
}

export function ImportCSVModal({
  isOpen,
  onClose,
  onImport,
  onDownloadTemplate,
  isSubmitting = false,
}: ImportCSVModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (file: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (
      validTypes.includes(file.type) ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")
    ) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleContinue = () => {
    if (selectedFile) {
      onImport(selectedFile);
      resetState();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import employees"
      description="Upload a spreadsheet to onboard your whole team at once."
      footer={
        <>
          <button
            onClick={handleClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedFile || isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm active:scale-95 duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Importing…" : "Continue"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
            isDragging
              ? "border-green-400 bg-green-50/50"
              : selectedFile
                ? "border-green-600 bg-green-50/30"
                : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
          }`}
          onClick={handleBrowse}
        >
          <div
            className={`flex items-center justify-center size-12 rounded-full transition-colors ${
              selectedFile
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Upload className="size-5" />
          </div>

          {selectedFile ? (
            <>
              <p className="text-sm font-semibold text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">
                  Drop your CSV or Excel file here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Columns: name, email, phone, salary
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowse();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Browse files
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Download template link */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onDownloadTemplate?.();
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors w-fit"
        >
          <Download className="size-4" />
          <span>Download the template CSV</span>
        </button>
      </div>
    </Modal>
  );
}
