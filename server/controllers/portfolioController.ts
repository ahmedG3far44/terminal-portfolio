import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Portfolio } from '../models/Portfolio';
import { User } from '../models/User';

export async function getPortfolio(req: AuthRequest, res: Response) {
  try {
    let portfolio;
    if (req.user) {
      portfolio = await Portfolio.findOne({ userId: req.user.userId });
    } else {
      portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    res.json({ success: true, data: portfolio });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePortfolio(req: AuthRequest, res: Response) {
  try {
    const allowedFields = ['personalInfo', 'skills', 'projects', 'activeTheme'];
    const setFields: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        setFields[field] = req.body[field];
      }
    }

    if (Object.keys(setFields).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user!.userId },
      { $set: setFields },
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    res.json({ success: true, data: portfolio });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPortfolioByUsername(req: AuthRequest, res: Response) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }
    res.json({ success: true, data: portfolio });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getProjectByUsernameAndId(req: AuthRequest, res: Response) {
  try {
    const { username, projectId } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }
    const project = (portfolio.projects as any).id(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data: { project, activeTheme: portfolio.activeTheme } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const { projectId } = req.params;

    let portfolio;
    if (req.user) {
      portfolio = await Portfolio.findOne({ userId: req.user.userId });
    } else {
      portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const project = (portfolio.projects as any).id(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: { project, activeTheme: portfolio.activeTheme } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function resetPortfolio(req: AuthRequest, res: Response) {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    portfolio.personalInfo = { name: '', title: '', bio: '', availableForHire: false } as any;
    portfolio.skills = [];
    portfolio.projects = [];
    portfolio.contacts = [];
    await portfolio.save();

    res.json({ success: true, data: portfolio });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
