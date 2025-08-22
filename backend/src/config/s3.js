import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class S3Service {
  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    });
    this.bucketName = config.aws.bucketName;
  }

  // Upload file
  async uploadFile(file, key, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: 'public-read',
      });

      const result = await this.client.send(command);
      const fileUrl = `https://${this.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;

      logInfo('File uploaded successfully:', { key, fileUrl });
      return { fileUrl, etag: result.ETag };
    } catch (error) {
      logError('Error uploading file:', error);
      throw error;
    }
  }

  // Generate presigned URL for file upload
  async getPresignedUploadUrl(key, contentType, expiresIn = 3600) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      });

      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn,
      });

      return {
        uploadUrl: signedUrl,
        fileUrl: `https://${this.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`,
      };
    } catch (error) {
      logError('Error generating presigned upload URL:', error);
      throw error;
    }
  }

  // Generate presigned URL for file download
  async getPresignedDownloadUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn,
      });

      return signedUrl;
    } catch (error) {
      logError('Error generating presigned download URL:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);
      logInfo('File deleted successfully:', key);
      return true;
    } catch (error) {
      logError('Error deleting file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files) {
    try {
      const uploadPromises = files.map(({ file, key, contentType }) =>
        this.uploadFile(file, key, contentType)
      );

      const results = await Promise.all(uploadPromises);
      logInfo('Multiple files uploaded successfully');
      return results;
    } catch (error) {
      logError('Error uploading multiple files:', error);
      throw error;
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(keys) {
    try {
      const deletePromises = keys.map(key => this.deleteFile(key));
      await Promise.all(deletePromises);
      logInfo('Multiple files deleted successfully');
      return true;
    } catch (error) {
      logError('Error deleting multiple files:', error);
      throw error;
    }
  }

  // Generate file key
  generateFileKey(folder, filename) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${folder}/${timestamp}-${randomString}-${filename}`;
  }

  // Get file URL
  getFileUrl(key) {
    return `https://${this.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
  }
}

// Create and export S3 service instance
const s3Service = new S3Service();
export default s3Service;