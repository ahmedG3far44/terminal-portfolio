import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { Portfolio } from '../models/Portfolio';

const CONTACT_VALIDATORS: Record<string, (value: string) => string | null> = {
  linkedin: (v) =>
    /^https:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v)
      ? null
      : 'Must be a valid LinkedIn URL (https://linkedin.com/in/...)',
  github: (v) =>
    /^https:\/\/(www\.)?github\.com\/.+/.test(v)
      ? null
      : 'Must be a valid GitHub URL (https://github.com/...)',
  x: (v) =>
    /^https:\/\/(www\.)?(x|twitter)\.com\/.+/.test(v)
      ? null
      : 'Must be a valid X/Twitter URL (https://x.com/...)',
  instagram: (v) =>
    /^https:\/\/(www\.)?instagram\.com\/.+/.test(v)
      ? null
      : 'Must be a valid Instagram URL (https://instagram.com/...)',
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? null
      : 'Must be a valid email address',
  phone: (v) =>
    /^\+?[\d\s\-()]{7,20}$/.test(v)
      ? null
      : 'Must be a valid phone number',
  website: (v) =>
    /^https?:\/\/.+/.test(v)
      ? null
      : 'Must be a valid URL starting with http:// or https://',
  youtube: (v) =>
    /^https:\/\/(www\.)?youtube\.com\/.+/.test(v) ||
    /^https:\/\/youtu\.be\/.+/.test(v)
      ? null
      : 'Must be a valid YouTube URL',
  dribbble: (v) =>
    /^https:\/\/(www\.)?dribbble\.com\/.+/.test(v)
      ? null
      : 'Must be a valid Dribbble URL',
  behance: (v) =>
    /^https:\/\/(www\.)?behance\.net\/.+/.test(v)
      ? null
      : 'Must be a valid Behance URL',
  medium: (v) =>
    /^https:\/\/(www\.)?medium\.com\/.+/.test(v)
      ? null
      : 'Must be a valid Medium URL',
  other: (v) =>
    /^https?:\/\/.+/.test(v)
      ? null
      : 'Must be a valid URL starting with http:// or https://',
};

function validateContact(type: string, value: string): string | null {
  const validator = CONTACT_VALIDATORS[type];
  if (!validator) return 'Unknown contact type';
  return validator(value);
}

export async function addContact(req: AuthRequest, res: Response) {
  try {
    const { type, value, label } = req.body;
    if (!type || !value) {
      return res.status(400).json({ success: false, error: 'Type and value are required' });
    }
    const validationError = validateContact(type, value);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    portfolio.contacts.push({ type, value, label: label || '' } as any);
    await portfolio.save();

    const added = portfolio.contacts[portfolio.contacts.length - 1];
    res.status(201).json({ success: true, data: added });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateContact(req: AuthRequest, res: Response) {
  try {
    const { contactId } = req.params;
    const { type, value, label } = req.body;

    if (!type && !value && label === undefined) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const contact = (portfolio.contacts as any).id(contactId);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    if (type !== undefined) contact.type = type;
    if (value !== undefined) {
      const validationError = validateContact(type || contact.type, value);
      if (validationError) {
        return res.status(400).json({ success: false, error: validationError });
      }
      contact.value = value;
    }
    if (label !== undefined) contact.label = label;

    await portfolio.save();
    res.json({ success: true, data: contact });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteContact(req: AuthRequest, res: Response) {
  try {
    const { contactId } = req.params;

    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const contact = (portfolio.contacts as any).id(contactId);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    contact.deleteOne();
    await portfolio.save();

    res.json({ success: true, data: { message: 'Contact deleted' } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function migrateSocialFields(req: AuthRequest, res: Response) {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }

    const oldPersonalInfo = portfolio.personalInfo as any;
    const migrated: string[] = [];

    if (oldPersonalInfo.email) {
      portfolio.contacts.push({ type: 'email', value: oldPersonalInfo.email, label: '' } as any);
      migrated.push('email');
    }
    if (oldPersonalInfo.linkedin) {
      portfolio.contacts.push({ type: 'linkedin', value: oldPersonalInfo.linkedin, label: '' } as any);
      migrated.push('linkedin');
    }
    if (oldPersonalInfo.github) {
      portfolio.contacts.push({ type: 'github', value: oldPersonalInfo.github, label: '' } as any);
      migrated.push('github');
    }

    if (migrated.length > 0) {
      const personalInfo = oldPersonalInfo.toObject ? oldPersonalInfo.toObject() : { ...oldPersonalInfo };
      delete personalInfo.email;
      delete personalInfo.linkedin;
      delete personalInfo.github;
      portfolio.personalInfo = personalInfo;
      await portfolio.save();
    }

    res.json({ success: true, data: { migrated, contacts: portfolio.contacts } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getContacts(req: AuthRequest, res: Response) {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user!.userId });
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found' });
    }
    res.json({ success: true, data: portfolio.contacts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
