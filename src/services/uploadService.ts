/**
 * Upload Service
 * Handles file uploads, media processing, and storage management
 */

import { apiClient, API_ENDPOINTS } from './api';

export interface UploadOptions {
  category?: 'profile' | 'gig' | 'portfolio' | 'document' | 'message' | 'general';
  compress?: boolean;
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  allowedTypes?: string[];
  maxSize?: number; // in bytes
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  ipfsHash?: string;
  category: string;
  uploadedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for videos/audio
    dimensions?: string;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
}

export interface BatchUploadResult {
  successful: UploadedFile[];
  failed: Array<{
    file: File;
    error: string;
  }>;
  totalUploaded: number;
  totalFailed: number;
}

class UploadService {
  private activeUploads = new Map<string, AbortController>();

  /**
   * Upload a single file
   */
  async uploadFile(
    file: File,
    options: UploadOptions = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadedFile> {
    // Validate file before upload
    this.validateFile(file, options);

    const uploadId = this.generateUploadId();
    const abortController = new AbortController();
    this.activeUploads.set(uploadId, abortController);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', options.category || 'general');

      if (options.compress) formData.append('compress', 'true');
      if (options.generateThumbnail) formData.append('generateThumbnail', 'true');
      if (options.maxWidth) formData.append('maxWidth', options.maxWidth.toString());
      if (options.maxHeight) formData.append('maxHeight', options.maxHeight.toString());
      if (options.quality) formData.append('quality', options.quality.toString());

      const response = await this.uploadWithProgress(
        API_ENDPOINTS.UPLOAD,
        formData,
        onProgress,
        abortController.signal
      );

      return response as UploadedFile;
    } finally {
      this.activeUploads.delete(uploadId);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[],
    options: UploadOptions = {},
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<BatchUploadResult> {
    const successful: UploadedFile[] = [];
    const failed: Array<{ file: File; error: string }> = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const uploadedFile = await this.uploadFile(
          files[i],
          options,
          onProgress ? (progress) => onProgress(i, progress) : undefined
        );
        successful.push(uploadedFile);
      } catch (error: unknown) {
        failed.push({
          file: files[i],
          error: (error as Error).message || 'Upload failed',
        });
      }
    }

    return {
      successful,
      failed,
      totalUploaded: successful.length,
      totalFailed: failed.length,
    };
  }

  /**
   * Upload with progress tracking
   */
  private async uploadWithProgress(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: UploadProgress) => void,
    signal?: AbortSignal
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload cancelled'));
        });
      }

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      xhr.open('POST', `${apiClient.config.baseURL}${endpoint}`);

      // Add auth header if available
      const token = apiClient.getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formData);
    });
  }

  /**
   * Cancel an active upload
   */
  cancelUpload(uploadId: string): void {
    const controller = this.activeUploads.get(uploadId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(uploadId);
    }
  }

  /**
   * Cancel all active uploads
   */
  cancelAllUploads(): void {
    this.activeUploads.forEach((controller) => controller.abort());
    this.activeUploads.clear();
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File, options: UploadOptions): void {
    // Check file size
    const maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB default
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${this.formatBytes(maxSize)}`);
    }

    // Check file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const isAllowed = options.allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isAllowed) {
        throw new Error(`File type ${file.type} is not allowed`);
      }
    }

    // Basic file validation
    if (file.size === 0) {
      throw new Error('File is empty');
    }

    if (!file.name.trim()) {
      throw new Error('File must have a name');
    }
  }

  /**
   * Get uploaded file by ID
   */
  async getUploadedFile(fileId: string): Promise<UploadedFile> {
    const response = await apiClient.get<UploadedFile>(`${API_ENDPOINTS.UPLOAD}/${fileId}`);
    return response.data;
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.UPLOAD}/${fileId}`);
  }

  /**
   * Get user's uploaded files
   */
  async getUserFiles(filters?: {
    category?: string;
    mimeType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    files: UploadedFile[];
    total: number;
    hasMore: boolean;
    totalSize: number;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.UPLOAD}/my-files`, filters);
    return response.data as {
      files: UploadedFile[];
      total: number;
      hasMore: boolean;
      totalSize: number;
    };
  }

  /**
   * Generate signed URL for direct upload
   */
  async generateSignedUploadUrl(
    filename: string,
    mimeType: string,
    category: string = 'general'
  ): Promise<{
    uploadUrl: string;
    fileId: string;
    expiresAt: string;
  }> {
    const response = await apiClient.post<{
      uploadUrl: string;
      fileId: string;
      expiresAt: string;
    }>(`${API_ENDPOINTS.UPLOAD}/signed-url`, {
      filename,
      mimeType,
      category,
    });
    return response.data;
  }

  /**
   * Upload directly to signed URL
   */
  async uploadToSignedUrl(
    signedUrl: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Get upload statistics
   */
  async getUploadStatistics(): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<string, {
      count: number;
      size: number;
    }>;
    byMimeType: Record<string, {
      count: number;
      size: number;
    }>;
    monthlyUploads: Array<{
      month: string;
      count: number;
      size: number;
    }>;
    storageQuota: {
      used: number;
      available: number;
      total: number;
    };
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.UPLOAD}/statistics`);
    return response.data as {
      totalFiles: number;
      totalSize: number;
      byCategory: Record<string, {
        count: number;
        size: number;
      }>;
      byMimeType: Record<string, {
        count: number;
        size: number;
      }>;
      monthlyUploads: Array<{
        month: string;
        count: number;
        size: number;
      }>;
      storageQuota: {
        used: number;
        available: number;
        total: number;
      };
    };
  }

  /**
   * Optimize image
   */
  async optimizeImage(
    fileId: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
      progressive?: boolean;
    }
  ): Promise<UploadedFile> {
    const response = await apiClient.post<UploadedFile>(
      `${API_ENDPOINTS.UPLOAD}/${fileId}/optimize`,
      options
    );
    return response.data;
  }

  /**
   * Generate image variants
   */
  async generateImageVariants(
    fileId: string,
    variants: Array<{
      name: string;
      width?: number;
      height?: number;
      quality?: number;
    }>
  ): Promise<Record<string, UploadedFile>> {
    const response = await apiClient.post<Record<string, UploadedFile>>(
      `${API_ENDPOINTS.UPLOAD}/${fileId}/variants`,
      { variants }
    );
    return response.data;
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId: string): Promise<{
    filename: string;
    mimeType: string;
    size: number;
    dimensions?: { width: number; height: number };
    duration?: number;
    bitrate?: number;
    format?: string;
    created: string;
    modified: string;
    hash: string;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.UPLOAD}/${fileId}/metadata`);
    return response.data as {
      filename: string;
      mimeType: string;
      size: number;
      dimensions?: { width: number; height: number };
      duration?: number;
      bitrate?: number;
      format?: string;
      created: string;
      modified: string;
      hash: string;
    };
  }

  /**
   * Search files
   */
  async searchFiles(query: string, filters?: {
    category?: string;
    mimeType?: string;
    minSize?: number;
    maxSize?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    files: UploadedFile[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get(`${API_ENDPOINTS.UPLOAD}/search`, {
      q: query,
      ...filters,
    });
    return response.data as {
      files: UploadedFile[];
      total: number;
      hasMore: boolean;
    };
  }

  /**
   * Utility: Generate unique upload ID
   */
  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Utility: Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Utility: Create preview for file
   */
  createFilePreview(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Utility: Compress image before upload
   */
  compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const uploadService = new UploadService();
