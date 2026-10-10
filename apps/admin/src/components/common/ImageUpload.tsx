import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, X, CheckCircle2, Search, CloudUpload } from 'lucide-react';
import { api } from '../../lib/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
  searchQuery?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'blinkit/products',
  label = 'Image',
  placeholder = 'https://images.unsplash.com/... or upload from computer',
  searchQuery,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCloudinaryUploaded, setIsCloudinaryUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.includes('cloudinary.com')) {
      setIsCloudinaryUploaded(true);
    } else {
      setIsCloudinaryUploaded(false);
    }
  }, [value]);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await api.cloudinary.upload(file, folder);
      onChange(res.secure_url);
      setIsCloudinaryUploaded(true);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlUpload = async (urlToUpload: string) => {
    if (!urlToUpload || !urlToUpload.trim().startsWith('http')) return;
    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await api.cloudinary.uploadUrl(urlToUpload.trim(), folder);
      onChange(res.secure_url);
      setIsCloudinaryUploaded(true);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload remote image to Cloudinary.');
      // Keep the URL as fallback if upload failed
      onChange(urlToUpload);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // 1. Check if files were dropped from local filesystem
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      return;
    }

    // 2. Check if image / link was dragged from Google Search or another browser tab
    let droppedUrl =
      e.dataTransfer.getData('text/uri-list') ||
      e.dataTransfer.getData('text/plain') ||
      '';

    if (!droppedUrl || !droppedUrl.startsWith('http')) {
      const htmlData = e.dataTransfer.getData('text/html');
      if (htmlData) {
        const match = htmlData.match(/src=["'](https?:\/\/[^"']+)["']/i);
        if (match && match[1]) {
          droppedUrl = match[1];
        }
      }
    }

    if (droppedUrl && droppedUrl.startsWith('http')) {
      handleUrlUpload(droppedUrl);
    }
  };

  const isCurrentUrlCloudinary = Boolean(value && value.includes('cloudinary.com'));

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
          {isCloudinaryUploaded && value && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-brand-green, #0c831f)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} /> Integrated with Cloudinary
            </span>
          )}
        </div>

        {/* Quick Google Images search button */}
        {searchQuery?.trim() && (
          <a
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery.trim())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              padding: '2px 8px',
              fontSize: '11px',
              height: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
            title="Search this product on Google Images then drag the first image directly here!"
          >
            <Search size={12} /> Search on Google
          </a>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Upload & Preview Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${
            isDragging
              ? 'var(--color-brand-green, #0c831f)'
              : 'var(--color-border-default, #e2e8f0)'
          }`,
          borderRadius: 'var(--radius-md, 8px)',
          padding: '12px',
          backgroundColor: isDragging
            ? 'rgba(12, 131, 31, 0.05)'
            : 'var(--color-bg-subtle, #f8fafc)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Image Preview Thumbnail */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-sm, 6px)',
              backgroundColor: 'var(--color-bg-surface, #ffffff)',
              border: '1px solid var(--color-border-default, #e2e8f0)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <ImageIcon size={24} color="var(--color-text-muted, #94a3b8)" />
            )}
          </div>

          {/* Action buttons & info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '32px',
                }}
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload Image File
                  </>
                )}
              </button>

              {value && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '32px',
                    color: 'var(--color-danger, #ef4444)',
                  }}
                  onClick={() => {
                    onChange('');
                    setIsCloudinaryUploaded(false);
                    setUploadError(null);
                  }}
                >
                  <X size={14} /> Remove
                </button>
              )}
            </div>

            <div
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted, #64748b)',
                marginTop: '4px',
              }}
            >
              {isUploading
                ? 'Uploading directly to Cloudinary...'
                : 'Drag and drop an image or Google image search result directly here (auto-uploaded to Cloudinary)'}
            </div>
          </div>
        </div>

        {/* Manual URL input fallback + Cloudinary integration button */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="url"
            className="form-control"
            style={{ fontSize: '13px', height: '36px', flex: 1 }}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />

          {value && value.startsWith('http') && !isCurrentUrlCloudinary && (
            <button
              type="button"
              className="btn btn-outline"
              disabled={isUploading}
              onClick={() => handleUrlUpload(value)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '36px',
                whiteSpace: 'nowrap',
              }}
              title="Upload this URL image to Cloudinary"
            >
              {isUploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CloudUpload size={14} />
              )}
              Upload to Cloudinary
            </button>
          )}
        </div>
      </div>

      {uploadError && (
        <span className="form-error" style={{ marginTop: '4px', display: 'block' }}>
          {uploadError}
        </span>
      )}
    </div>
  );
};
