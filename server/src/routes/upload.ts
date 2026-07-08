import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../configs/cloudinary';
import { requireAuth, AuthRequest } from '../middlewares/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Accepted formats: PNG, JPEG, GIF, MP4'));
    }
  },
});

router.post('/', requireAuth, (req: Request, res: Response) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'File too large. Max 20MB.' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    try {
      const b64 = file.buffer.toString('base64');
      const dataUri = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'portfolio/projects',
        resource_type: 'auto',
      });

      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        },
      });
    } catch (uploadErr: any) {
      res.status(500).json({ success: false, error: uploadErr.message || 'Upload failed' });
    }
  });
});

export default router;
