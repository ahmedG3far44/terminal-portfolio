import { Request, Response } from 'express';
import { User } from '../models/User';
import { Portfolio } from '../models/Portfolio';
import { Theme } from '../models/Theme';

export async function getInsights(_req: Request, res: Response) {
  try {
    const [totalUsers, activeUsers, portfolioAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Portfolio.aggregate([
        {
          $group: {
            _id: null,
            totalProjects: { $sum: { $size: '$projects' } },
            totalSkills: { $sum: { $size: '$skills' } },
          },
        },
      ]),
      Theme.countDocuments(),
    ]);

    const totalThemes = await Theme.countDocuments();
    const data = portfolioAgg[0] || { totalProjects: 0, totalSkills: 0 };

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalProjects: data.totalProjects,
        totalSkills: data.totalSkills,
        totalThemes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    if (search && typeof search === 'string') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).select('-__v').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({ success: true, data: users, total, page: pageNum, limit: limitNum });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function blockUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function activateUser(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getThemes(_req: Request, res: Response) {
  try {
    const themes = await Theme.find().sort({ name: 1 });
    res.json({ success: true, data: themes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createTheme(req: Request, res: Response) {
  const { name, slug, primary, rgb } = req.body;
  if (!name || !slug || !primary || !rgb) {
    return res.status(400).json({ success: false, error: 'name, slug, primary, and rgb are required' });
  }

  try {
    const existing = await Theme.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Theme with this slug already exists' });
    }

    const theme = await Theme.create({ name, slug, primary, rgb });
    res.status(201).json({ success: true, data: theme });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateTheme(req: Request, res: Response) {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    res.json({ success: true, data: theme });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteTheme(req: Request, res: Response) {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' });
    }
    res.json({ success: true, data: { _id: req.params.id } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getActiveThemes(_req: Request, res: Response) {
  try {
    const themes = await Theme.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: themes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
