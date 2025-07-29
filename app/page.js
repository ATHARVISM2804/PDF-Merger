'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload } from 'lucide-react';

export default function AadhaarUploadPage() {
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('No');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [mergedPreviewUrl, setMergedPreviewUrl] = useState('');

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'front') {
        setFrontImage(file);
        setFrontImageUrl(url);
      } else {
        setBackImage(file);
        setBackImageUrl(url);
      }
    }
  };

  // 🛠️ Fix: useEffect to auto-generate preview when both images are present
  useEffect(() => {
    if (frontImageUrl && backImageUrl) {
      generatePreview();
    }
  }, [frontImageUrl, backImageUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { password, phoneNumber, frontImage, backImage });
  };

  const generatePreview = async () => {
    if (!frontImageUrl || !backImageUrl) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const loadImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = url;
        });
      };

      const [frontImg, backImg] = await Promise.all([
        loadImage(frontImageUrl),
        loadImage(backImageUrl)
      ]);

      const standardHeight = 600;
      const standardWidth = (standardHeight * frontImg.width) / frontImg.height;

      canvas.width = standardWidth * 2 + 20;
      canvas.height = standardHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(frontImg, 0, 0, standardWidth, standardHeight);
      ctx.drawImage(backImg, standardWidth + 20, 0, standardWidth, standardHeight);

      ctx.beginPath();
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 2;
      ctx.moveTo(standardWidth + 10, 0);
      ctx.lineTo(standardWidth + 10, standardHeight);
      ctx.stroke();

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setMergedPreviewUrl(dataUrl);

    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const generatePDF = async () => {
    if (!frontImage || !backImage) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const loadImage = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = url;
        });
      };

      const [frontImg, backImg] = await Promise.all([
        loadImage(frontImageUrl),
        loadImage(backImageUrl)
      ]);

      const targetHeight = 2400;
      const targetWidth = (targetHeight * frontImg.width) / frontImg.height;

      canvas.width = targetWidth * 2;
      canvas.height = targetHeight;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(frontImg, 0, 0, targetWidth, targetHeight);
      ctx.drawImage(backImg, targetWidth, 0, targetWidth, targetHeight);

      const link = document.createElement('a');
      link.download = 'aadhaar-card.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Make Aadhaar (Cards)</h1>

        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-8">
          <h2 className="text-green-400 text-xl font-semibold mb-2">Notice</h2>
          <p className="text-green-300">
            We only support original aadhaar PDF files downloaded from UIDAI with valid signature.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Make Aadhaar (Cards)</h2>
              <p className="text-gray-400 mb-6">
                Please enter the Aadhaar number in the input field(s) to generate the Aadhaar card(s).
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-white text-base mb-4 block">
                    Select Aadhaar PDF <span className="text-red-500">*</span>
                  </Label>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="front-upload"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                        className="hidden"
                      />
                      <label
                        htmlFor="front-upload"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {frontImage ? frontImage.name : 'Choose Front Page Image'}
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="file"
                        id="back-upload"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        className="hidden"
                      />
                      <label
                        htmlFor="back-upload"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {backImage ? backImage.name : 'Choose Back Page Image'}
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-white text-base mb-2 block">Phone Number</Label>
                  <Select value={phoneNumber} onValueChange={setPhoneNumber}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Aadhaar Card Preview</h2>
                <p className="text-gray-400 text-sm mt-1">Both sides will be displayed together</p>
              </div>

              <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-600">
                  <div className="text-sm text-gray-300">Aadhaar Card Preview</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 min-h-[500px]">
                  <div className="bg-white rounded-lg shadow-lg p-2">
                    <div className="text-gray-600 font-medium mb-2 text-center">Front Side</div>
                    {frontImageUrl ? (
                      <img
                        src={frontImageUrl}
                        alt="Front side"
                        className="w-full h-[400px] object-contain rounded border border-gray-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded border border-dashed border-gray-300">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500">Upload front side image</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-2">
                    <div className="text-gray-600 font-medium mb-2 text-center">Back Side</div>
                    {backImageUrl ? (
                      <img
                        src={backImageUrl}
                        alt="Back side"
                        className="w-full h-[400px] object-contain rounded border border-gray-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded border border-dashed border-gray-300">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500">Upload back side image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Preview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">Combined Preview</h2>
              <p className="text-gray-400 text-sm mt-1">Front and back combined in single page</p>
            </div>

            <div className="relative bg-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-600">
                <div className="text-sm text-gray-300">Combined PDF Preview</div>
              </div>

              <div className="p-4 bg-gray-100">
                {mergedPreviewUrl ? (
                  <img
                    src={mergedPreviewUrl}
                    alt="Combined preview"
                    className="w-full h-[600px] object-contain rounded border border-gray-300"
                  />
                ) : (
                  <div className="h-[600px] flex flex-col items-center justify-center bg-gray-50 rounded">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-gray-500">Upload both images to see combined preview</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 p-4 border-t border-gray-600">
                <Button
                  onClick={generatePDF}
                  disabled={!frontImage || !backImage}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Combined PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
