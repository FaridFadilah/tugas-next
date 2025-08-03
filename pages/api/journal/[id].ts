import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Valid journal entry ID is required" });
  }

  try {
    if (req.method === "GET") {
      // Get a specific journal entry
      const journalEntry = await prisma.journalEntry.findUnique({
        where: { id },
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

      if (!journalEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      res.status(200).json(journalEntry);
    } 
    else if (req.method === "PUT") {
      // Update a journal entry
      const { 
        content, 
        mood, 
        energyLevel, 
        tags 
      } = req.body;

      // Parse tags if it's a string
      let parsedTags = tags;
      if (typeof tags === 'string') {
        parsedTags = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      }

      const updatedEntry = await prisma.journalEntry.update({
        where: { id },
        data: {
          ...(content && { content }),
          ...(mood && { mood }),
          ...(energyLevel !== undefined && { energyLevel }),
          ...(parsedTags && { tags: parsedTags }),
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

      res.status(200).json(updatedEntry);
    } 
    else if (req.method === "DELETE") {
      // Delete a journal entry
      await prisma.journalEntry.delete({
        where: { id }
      });

      res.status(200).json({ message: "Journal entry deleted successfully" });
    } 
    else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Journal entry API error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Journal entry not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
