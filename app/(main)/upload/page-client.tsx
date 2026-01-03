"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { uploadExcelData } from "./actions";
import { ModelType } from "@/lib/validate-excel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UploadPageClient() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("Transaction");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    errors?: Array<{ row: number; field: string; message: string }>;
    insertedCount?: number;
  } | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is Excel format
      const validExtensions = [".xlsx", ".xls", ".csv"];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setUploadResult({
          success: false,
          message: "Please upload a valid Excel file (.xlsx, .xls, or .csv)",
        });
        setShowResultDialog(true);
        return;
      }

      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadResult({
        success: false,
        message: "Please select a file to upload",
      });
      setShowResultDialog(true);
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("modelType", selectedModel);
      
      const result = await uploadExcelData(formData);
      setUploadResult(result);
      setShowResultDialog(true);

      if (result.success) {
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        message: error.message || "An error occurred while uploading the file",
      });
      setShowResultDialog(true);
    } finally {
      setIsUploading(false);
    }
  };

  const getExpectedColumns = (modelType: ModelType): string[] => {
    switch (modelType) {
      case "Transaction":
        return [
          "amount (required)",
          "date (required)",
          "type (required: INCOME, EXPENSE, INVESTMENT, TRANSFER)",
          "status (required: COMPLETED, PENDING, FAILED)",
          "description (optional)",
          "paymentMethod (optional: UPI, ONLINE, CARD, BANK, WALLET)",
          "bankAccountName (optional: SBI, AXIS, FEDERAL_BANK, SBI_CARD, ICICI_CARD)",
          "category (optional: category name)",
          "subCategory (optional: sub-category name)",
        ];
      case "Category":
        return ["name (required)", "description (optional)"];
      case "SubCategory":
        return [
          "name (required)",
          "category (required: category name)",
          "description (optional)",
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-8 sm:py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Upload Data</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload Excel files to bulk import transactions, categories, or sub-categories
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Excel File</CardTitle>
              <CardDescription>
                Select a model type and upload your Excel file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="modelType">Select Model Type</Label>
                <Select
                  id="modelType"
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value as ModelType);
                    setSelectedFile(null);
                    setUploadResult(null);
                  }}
                  className="w-full"
                >
                  <option value="Transaction">Transaction</option>
                  <option value="Category">Category</option>
                  <option value="SubCategory">SubCategory</option>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select Excel File</Label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-6 hover:bg-accent"
                  >
                    <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Excel files (.xlsx, .xls, .csv)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Expected Format */}
          <Card>
            <CardHeader>
              <CardTitle>Expected Excel Format</CardTitle>
              <CardDescription>
                Your Excel file should have the following columns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">For {selectedModel}:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {getExpectedColumns(selectedModel).map((col, index) => (
                    <li key={index}>{col}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-md bg-muted p-4">
                <p className="text-xs font-medium mb-2">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li>First row should contain column headers</li>
                  <li>Date format: YYYY-MM-DD or YYYY-MM-DD HH:mm</li>
                  <li>Enum values must match exactly (case-sensitive)</li>
                  <li>For SubCategory, category name must exist in database</li>
                  <li>For Transaction, category/subcategory names are optional but must exist if provided</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {uploadResult?.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Upload Successful
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Upload Failed
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {uploadResult?.message}
            </DialogDescription>
          </DialogHeader>

          {uploadResult?.errors && uploadResult.errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Validation Errors:</p>
              <div className="rounded-md border bg-muted p-4 max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Row</th>
                      <th className="text-left p-2">Field</th>
                      <th className="text-left p-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadResult.errors.map((error, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{error.row}</td>
                        <td className="p-2 font-medium">{error.field}</td>
                        <td className="p-2 text-red-600">{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadResult?.success && uploadResult.insertedCount !== undefined && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Successfully inserted {uploadResult.insertedCount} record
                {uploadResult.insertedCount !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowResultDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

