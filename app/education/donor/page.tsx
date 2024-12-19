"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// File Upload Component for Donors
const DonorPage = () => {
  const [donorName, setDonorName] = useState<string>(""); // Name state
  const [file, setFile] = useState<File | null>(null); // File state
  const [uploadStatus, setUploadStatus] = useState<string>(""); // Status messages
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator

  // Handle File Change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]); // Update file state
      setUploadStatus(""); // Reset status
    }
  };

  // Simulated File Upload Handler
  const handleFileUpload = async () => {
    if (!file || donorName.trim() === "") {
      toast.error("Please enter your name and select a file.");
      return;
    }

    setLoading(true);
    setUploadStatus("Uploading...");

    // Simulated API call for uploading
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("donorName", donorName);

      // Mock API call (replace with your actual upload logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadStatus("File uploaded successfully!");
      toast.success("File uploaded successfully!");
    } catch (error) {
      setUploadStatus("Failed to upload file. Try again.");
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
      setFile(null); // Reset file input
    }
  };

  return (
    <div className="flex items-center justify-center bg-blue-50 min-h-screen">
      <Card className="max-w-lg w-full shadow-md">
        <CardContent className="p-6 space-y-6">
          <CardTitle className="text-center mb-4">Donor Upload Page</CardTitle>

          <div className="space-y-4">
            {/* Donor Name Input */}
            <label htmlFor="donorName" className="block text-gray-600">
              Donor Name:
            </label>
            <Input
              id="donorName"
              type="text"
              placeholder="Enter your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
            />

            {/* File Upload */}
            <label htmlFor="fileInput" className="block text-gray-600">
              Upload Your File:
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".jpg, .png, .pdf"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />

            {/* Upload Button */}
            <Button
              onClick={handleFileUpload}
              className="w-full bg-[#0077B6] hover:bg-[#00689F] font-inter"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </div>

          {/* Display Status */}
          {uploadStatus && (
            <p
              className={`text-center ${
                uploadStatus.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {uploadStatus}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default DonorPage;
