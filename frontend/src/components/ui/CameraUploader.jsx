import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FiCamera, FiUpload, FiX, FiCheck, FiRefreshCcw } from 'react-icons/fi';
import { Button } from './Button';

export default function CameraUploader({ onPhotoSelected, uploading, currentPhotoUrl }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [mode, setMode] = useState('idle'); // 'idle', 'camera', 'preview'
  const [previewSrc, setPreviewSrc] = useState(null);

  // Convert base64 data URL to a File object
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreviewSrc(imageSrc);
      setMode('preview');
    }
  }, [webcamRef]);

  const handleUsePhoto = () => {
    if (previewSrc) {
      const file = dataURLtoFile(previewSrc, 'camera_capture.jpg');
      onPhotoSelected(file, previewSrc);
      setMode('idle');
      setPreviewSrc(null);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onPhotoSelected(file, previewUrl);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  if (mode === 'camera') {
    return (
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] sm:aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-md">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-10">
          <button 
            type="button"
            onClick={() => setMode('idle')}
            className="w-10 h-10 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition"
          >
            <FiX size={18} />
          </button>
          <button 
            type="button"
            onClick={handleCapture}
            className="w-14 h-14 bg-white border-4 border-gray-300 hover:border-gray-100 rounded-full shadow-lg transition flex items-center justify-center"
          >
            <div className="w-10 h-10 bg-white rounded-full"></div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'preview' && previewSrc) {
    return (
      <div className="relative w-full max-w-sm mx-auto aspect-[3/4] sm:aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
        <img src={previewSrc} alt="Captured preview" className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end gap-3">
          <Button 
            type="button"
            variant="outline"
            onClick={() => { setPreviewSrc(null); setMode('camera'); }}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 flex items-center justify-center gap-2 text-sm h-10"
          >
            <FiRefreshCcw size={14} /> Retake
          </Button>
          <Button 
            type="button"
            onClick={handleUsePhoto}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent flex-1 flex items-center justify-center gap-2 text-sm h-10"
          >
            <FiCheck size={16} /> Use Photo
          </Button>
        </div>
      </div>
    );
  }

  // Idle mode
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => setMode('camera')}
          disabled={uploading}
          className="flex flex-col items-center justify-center h-28 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-2 transition-colors">
            <FiCamera size={20} className="text-gray-700" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Open Camera</span>
        </button>

        <label className="flex flex-col items-center justify-center h-28 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group">
          <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center mb-2 transition-colors">
            <FiUpload size={20} className="text-gray-700" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Upload File</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            disabled={uploading}
            className="hidden"
            ref={fileInputRef}
          />
        </label>
      </div>
    </div>
  );
}
