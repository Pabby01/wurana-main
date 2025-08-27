import File from '../models/file.model.js';
import createError from 'http-errors';
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.AWS_REGION || 'us-east-1'
});

export const getUploadUrl = async (req, res, next) => {
  try {
    const { fileType, purpose, relatedModel, relatedId } = req.body;
    if (!fileType || !purpose || !relatedModel || !relatedId) {
      throw createError(400, 'Missing required parameters');
    }

    const key = `${req.user.id}/${purpose}/${uuidv4()}-${Date.now()}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
      Expires: 300 // URL expires in 5 minutes
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const file = new File({
      originalName: req.body.fileName,
      key,
      url: fileUrl,
      mimeType: fileType,
      size: req.body.fileSize,
      uploadedBy: req.user.id,
      relatedTo: {
        model: relatedModel,
        id: relatedId
      },
      purpose,
      status: 'temporary'
    });
    await file.save();

    res.json({
      uploadUrl,
      fileUrl,
      fileId: file._id
    });
  } catch (error) {
    next(error);
  }
};

export const confirmUpload = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      uploadedBy: req.user.id,
      status: 'temporary'
    });
    if (!file) throw createError(404, 'File not found');

    file.status = 'permanent';
    if (req.body.metadata) {
      file.metadata = req.body.metadata;
    }
    await file.save();

    res.json(file);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      _id: req.params.fileId,
      uploadedBy: req.user.id
    });
    if (!file) throw createError(404, 'File not found');

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: file.key
    };

    await s3.send(new DeleteObjectCommand(params));
    file.status = 'deleted';
    await file.save();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getFiles = async (req, res, next) => {
  try {
    const { relatedModel, relatedId, purpose } = req.query;
    const query = { uploadedBy: req.user.id, status: { $ne: 'deleted' } };

    if (relatedModel) query['relatedTo.model'] = relatedModel;
    if (relatedId) query['relatedTo.id'] = relatedId;
    if (purpose) query.purpose = purpose;

    const files = await File.find(query).sort('-createdAt');
    res.json(files);
  } catch (error) {
    next(error);
  }
};

export const cleanupTemporaryFiles = async () => {
  try {
    const expirationTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const expiredFiles = await File.find({
      status: 'temporary',
      createdAt: { $lt: expirationTime }
    });

    for (const file of expiredFiles) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: file.key
      };

      await s3.deleteObject(params).promise();
      file.status = 'deleted';
      await file.save();
    }

    console.log(`Cleaned up ${expiredFiles.length} temporary files`);
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
};