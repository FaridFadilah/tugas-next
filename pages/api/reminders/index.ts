import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Get all reminders for a user
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const reminders = await prisma.reminder.findMany({
        where: { userId: userId as string },
        orderBy: { sentAt: 'desc' },
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

      res.status(200).json(reminders);
    } 
    else if (req.method === "POST") {
      // Create a new reminder
      const { 
        userId, 
        reminderType, 
        sentAt,
        via 
      } = req.body;

      if (!userId || !reminderType || !sentAt || !via) {
        return res.status(400).json({ 
          error: "User ID, reminder type, sent at, and via are required" 
        });
      }

      const reminder = await prisma.reminder.create({
        data: {
          userId,
          reminderType,
          sentAt: new Date(sentAt),
          via
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

      res.status(201).json(reminder);
    } 
    else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: unknown) {
    console.error("Reminders API error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
