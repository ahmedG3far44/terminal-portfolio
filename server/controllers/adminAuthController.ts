import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { signAdminJwt } from '../utils/jwt';
import { AdminAuthRequest } from '../middlewares/adminAuth';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = signAdminJwt({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'super_admin',
    });

    res.json({
      success: true,
      data: {
        token,
        admin: { _id: admin._id, email: admin.email, username: admin.username, role: admin.role },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getMe(req: AdminAuthRequest, res: Response) {
  try {
    const admin = await Admin.findById(req.admin?.adminId).select('-password -__v');
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.json({ success: true, data: admin });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
