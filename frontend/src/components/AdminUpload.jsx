import { useParams, NavLink } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { Upload, FileVideo, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { PageBackground } from './ui/Primitives';

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-200">
      <PageBackground />
      
      <div className="relative z-10 mx-auto max-w-xl px-6 py-20">
        <NavLink to="/admin/video" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 no-underline hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Library
        </NavLink>

        <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-400">
              <Upload size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Upload Editorial</h1>
            <p className="mt-2 text-sm text-slate-400">Select an MP4 video for this problem solution.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="group relative rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 transition-colors hover:border-cyan-300/30">
              <input
                type="file"
                accept="video/*"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => files?.[0]?.type.startsWith('video/') || 'Invalid video format',
                    fileSize: (files) => files?.[0]?.size <= 100 * 1024 * 1024 || 'Max size 100MB'
                  }
                })}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={uploading}
              />
              <div className="text-center">
                <FileVideo className={`mx-auto mb-4 h-10 w-10 ${selectedFile ? 'text-cyan-400' : 'text-slate-600'}`} />
                <p className="text-sm font-bold text-slate-300">
                  {selectedFile ? selectedFile.name : 'Click or drag video to upload'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedFile ? formatFileSize(selectedFile.size) : 'MP4, MKV up to 100MB'}
                </p>
              </div>
            </div>

            {errors.videoFile && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400">
                <AlertCircle size={14} /> {errors.videoFile.message}
              </div>
            )}

            {uploading && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Uploading to Cloud...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div 
                    className="h-full bg-cyan-400 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {errors.root && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                {errors.root.message}
              </div>
            )}

            {uploadedVideo && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200">
                <CheckCircle size={20} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-bold">Upload Successful!</p>
                  <p className="text-xs opacity-70">Duration: {formatDuration(uploadedVideo.duration)}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 text-sm font-extrabold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </>
              ) : (
                'Start Upload'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;