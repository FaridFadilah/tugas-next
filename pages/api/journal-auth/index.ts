import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth';

const prisma = new PrismaClient();

async function journalHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }

    if (req.method === 'GET') {
      // Get all journal entries for the authenticated user
      const journalEntries = await prisma.journalEntry.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(200).json(journalEntries);

    } else if (req.method === 'POST') {
      // Create a new journal entry
      const { content, mood, energyLevel, tags, weather, location, activities, goals } = req.body;

      if (!content || !mood) {
        return res.status(400).json({ error: 'Content and mood are required' });
      }

      const journalEntry = await prisma.journalEntry.create({
        data: {
          userId: userId,
          content,
          mood,
          energyLevel: energyLevel || null,
          tags: tags || [],
          // Add other fields as needed
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json(journalEntry);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Journal API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

export default withAuth(journalHandler);
