import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Get all AI summaries for a user
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const summaries = await prisma.aISummary.findMany({
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

      res.status(200).json(summaries);
    } 
    else if (req.method === "POST") {
      // Create a new AI summary
      const { 
        userId, 
        weekStart,
        weekEnd,
        summary,
        aiModel 
      } = req.body;

      if (!userId || !weekStart || !weekEnd || !summary || !aiModel) {
        return res.status(400).json({ 
          error: "User ID, week start, week end, summary, and AI model are required" 
        });
      }

      const aiSummary = await prisma.aISummary.create({
        data: {
          userId,
          weekStart: new Date(weekStart),
          weekEnd: new Date(weekEnd),
          summary,
          aiModel
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

      res.status(201).json(aiSummary);
    } 
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("AI Summaries API error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
