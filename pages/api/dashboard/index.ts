import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth';

const prisma = new PrismaClient();

async function dashboardHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID not found' });
      }

      // Get dashboard statistics
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get total counts
      const totalJournalEntries = await prisma.journalEntry.count({
        where: { userId: userId }
      });

      const totalReminders = await prisma.reminder.count({
        where: { userId: userId }
      });

      const totalSummaries = await prisma.aISummary.count({
        where: { userId: userId }
      });

      // Get weekly stats
      const weeklyJournalEntries = await prisma.journalEntry.count({
        where: {
          userId: userId,
          createdAt: {
            gte: startOfWeek
          }
        }
      });

      const weeklyReminders = await prisma.reminder.count({
        where: {
          userId: userId,
          sentAt: {
            gte: startOfWeek
          }
        }
      });

      // Get recent journal entries
      const recentJournalEntries = await prisma.journalEntry.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          content: true,
          mood: true,
          energyLevel: true,
          tags: true,
          createdAt: true
        }
      });

      // Get mood distribution
      const moodDistribution = await prisma.journalEntry.groupBy({
        by: ['mood'],
        where: { userId: userId },
        _count: {
          mood: true
        }
      });

      // Get daily activity for the last 7 days
      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const journalCount = await prisma.journalEntry.count({
          where: {
            userId: userId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });

        const reminderCount = await prisma.reminder.count({
          where: {
            userId: userId,
            sentAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });

        dailyActivity.push({
          date: startOfDay.toISOString().split('T')[0],
          journalEntries: journalCount,
          reminders: reminderCount
        });
      }

      const dashboardData = {
        totalStats: {
          journalEntries: totalJournalEntries,
          reminders: totalReminders,
          summaries: totalSummaries
        },
        weeklyStats: {
          journalEntries: weeklyJournalEntries,
          reminders: weeklyReminders
        },
        recentJournalEntries,
        moodDistribution: moodDistribution.map(item => ({
          mood: item.mood,
          count: item._count.mood
        })),
        dailyActivity
      };

      res.status(200).json(dashboardData);

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}

export default withAuth(dashboardHandler);
