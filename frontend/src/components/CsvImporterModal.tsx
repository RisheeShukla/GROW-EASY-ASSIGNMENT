"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
import { X, UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";

type Step = "UPLOAD" | "PREVIEW" | "RESULT";

const displayFields = [
  "city",
  "company",
  "country",
  "country_code",
  "created_at",
  "crm_note",
  "crm_status",
  "data_source",
  "description",
  "email",
  "lead_owner",
  "mobile_without_country_code",
  "name",
  "possession_time",
  "state",
];

const formatDisplayValue = (field: string, value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (field === "crm_status" && typeof value === "string") {
    return value.replace(/_/g, " ");
  }

  return String(value);
};

export default function CsvImporterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [file, setFile] = useState<File | null>(null);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Results State
  const [results, setResults] = useState<{ imported: number; skipped: number; records: any[] } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseForPreview(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const parseForPreview = (file: File) => {
    Papa.parse(file, {
      header: true,
      preview: 5, // Show first 5 rows for preview
      complete: (results) => {
        if (results.meta.fields) {
          setPreviewHeaders(results.meta.fields);
          setPreviewRows(results.data);
          setStep("PREVIEW");
        }
      },
      error: (error) => {
        toast.error("Failed to parse CSV file client-side.");
      }
    });
  };

  const handleConfirmImport = async () => {
    if (!file) return;
    setIsProcessing(true);
    const toastId = toast.loading("AI is mapping your CSV columns to CRM fields...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/import-csv`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResults(response.data);
      console.log("Import Results:", response.data);
      toast.update(toastId, { render: "Import successful!", type: "success", isLoading: false, autoClose: 3000 });
      setStep("RESULT");
    } catch (error) {
      toast.update(toastId, { render: "Error processing CSV. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadJson = () => {
    if (!results?.records?.length) {
      toast.error("No records available to download.");
      return;
    }

    const payload = JSON.stringify(results.records, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "imported-records.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded.");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Import Leads via CSV</h2>
            <p className="text-sm text-gray-500">Upload a CSV file to bulk import leads into your system</p>
          </div>
          
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {step === "UPLOAD" && (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-white hover:border-orange-400"
              }`}
            >
              <input {...getInputProps()} />
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <UploadCloud className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Drop your CSV file here</h3>
              <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
              <p className="text-xs text-gray-400">Supported file: .csv</p>
            </div>
          )}

          {step === "PREVIEW" && (
            <div className="bg-white border rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <span className="font-medium text-sm truncate">{file?.name}</span>
                <button onClick={() => setStep("UPLOAD")} className="ml-auto text-xs text-orange-500 hover:underline">
                  Change File
                </button>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {previewHeaders.map((header, idx) => (
                        <th key={idx} className="px-6 py-3">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                        {previewHeaders.map((header, i) => (
                          <td key={i} className="px-6 py-4">{row[header] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === "RESULT" && results && (
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex-1">
                  <p className="text-sm text-green-700 font-semibold">Successfully Imported</p>
                  <p className="text-2xl font-bold text-green-800">{results.imported}</p>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex-1">
                  <p className="text-sm text-red-700 font-semibold">Skipped (Missing Contact)</p>
                  <p className="text-2xl font-bold text-red-800">{results.skipped}</p>
                </div>
              </div>

              <div className="space-y-4">
                {results.records.map((record, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">
                          Record {idx + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {record.name || "Unnamed Lead"}
                        </h3>
                      </div>

                      {record.crm_status && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          {formatDisplayValue("crm_status", record.crm_status)}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {displayFields.map((field) => (
                        <div key={field} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {field}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatDisplayValue(field, record[field])}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t bg-white flex justify-end gap-3">
          {step === "RESULT" && results?.records?.length ? (
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 focus:outline-none"
            >
              Download JSON
            </button>
          ) : null}

          <button 
          type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none"
            disabled={isProcessing}
          >
            {step === "RESULT" ? "Close" : "Cancel"}
          </button>
          
          {step === "PREVIEW" && (
            <button
            type="button"
              onClick={handleConfirmImport}
              disabled={isProcessing}
              className="px-5 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Confirm Import"}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}