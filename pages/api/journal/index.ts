import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "../../../lib/auth";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Get all journal entries for authenticated user
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const journalEntries = await prisma.journalEntry.findMany({
        where: { userId },
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

      // Ensure serializable response
      const serializedEntries = journalEntries.map(entry => ({
        id: entry.id,
        content: entry.content,
        mood: entry.mood,
        energyLevel: entry.energyLevel,
        tags: entry.tags,
        createdAt: entry.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: entry.updatedAt?.toISOString() || new Date().toISOString(),
        userId: entry.userId,
        user: entry.user
      }));

      res.status(200).json(serializedEntries);
    } 
    else if (req.method === "POST") {
      // Create a new journal entry for authenticated user
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { 
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

      if (!content || !mood) {
        return res.status(400).json({ 
          error: "Content and mood are required" 
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

export default withAuth(handler);
