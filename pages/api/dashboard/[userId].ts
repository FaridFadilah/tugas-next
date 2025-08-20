import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Get dashboard statistics
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  // const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get total counts
      const totalJournalEntries = await prisma.journalEntry.count({
        where: { userId: userId as string }
      });

      const totalReminders = await prisma.reminder.count({
        where: { userId: userId as string }
      });

      const totalSummaries = await prisma.aISummary.count({
        where: { userId: userId as string }
      });

      // Get weekly stats
      const weeklyJournalEntries = await prisma.journalEntry.count({
        where: { 
          userId: userId as string,
          createdAt: { gte: startOfWeek }
        }
      });

      const weeklyReminders = await prisma.reminder.count({
        where: { 
          userId: userId as string,
          sentAt: { gte: startOfWeek }
        }
      });

      // Get recent journal entries
      const recentJournalEntries = await prisma.journalEntry.findMany({
        where: { userId: userId as string },
        take: 5,
        orderBy: { createdAt: 'desc' },
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
      const moodStats = await prisma.journalEntry.groupBy({
        by: ['mood'],
        where: { userId: userId as string },
        _count: {
          mood: true
        }
      });

      // Get daily activity for the past 7 days
      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const journalCount = await prisma.journalEntry.count({
          where: {
            userId: userId as string,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });

        const reminderCount = await prisma.reminder.count({
          where: {
            userId: userId as string,
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
        moodDistribution: moodStats.map((stat: any) => ({
          mood: stat.mood,
          count: stat._count.mood
        })),
        dailyActivity
      };

      res.status(200).json(dashboardData);
    } 
    else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
