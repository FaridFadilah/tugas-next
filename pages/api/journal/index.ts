import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Get all journal entries for a user
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const journalEntries = await prisma.journalEntry.findMany({
        where: { userId: userId as string },
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
    } 
    else if (req.method === "POST") {
      // Create a new journal entry
      const { 
        userId, 
        content, 
        mood, 
        energyLevel, 
        tags,
        title,
        weather,
        location,
        activities,
        goals 
      } = req.body;

      if (!userId || !content || !mood) {
        return res.status(400).json({ 
          error: "User ID, content, and mood are required" 
        });
      }

      // Parse tags if it's a string
      let parsedTags = tags;
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      }

      // Parse activities if it's an array of strings
      let parsedActivities = activities;
      if (Array.isArray(activities)) {
        parsedActivities = activities.filter((activity: string) => activity && activity.trim());
      }

      const journalEntry = await prisma.journalEntry.create({
        data: {
          userId,
          content,
          mood,
          energyLevel: energyLevel || 5,
          tags: parsedTags || [],
          // Additional fields that we'll store in content as JSON or separate fields
          updatedAt: new Date()
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
    } 
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Journal API error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
