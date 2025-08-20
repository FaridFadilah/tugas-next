import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { withAuth, AuthenticatedRequest } from "../../../lib/auth";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Valid journal entry ID is required" });
  }

  try {
    if (req.method === "GET") {
      // Get a specific journal entry (only if it belongs to the authenticated user)
      const journalEntry = await prisma.journalEntry.findFirst({
        where: { 
          id,
          userId // Ensure user can only access their own entries
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

      if (!journalEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      res.status(200).json(journalEntry);
    } 
    else if (req.method === "PUT") {
      // Update a journal entry (only if it belongs to the authenticated user)
      const { 
        content, 
        mood, 
        energyLevel, 
        tags 
      } = req.body;

      // Check if the entry belongs to the authenticated user
      const existingEntry = await prisma.journalEntry.findFirst({
        where: { id, userId }
      });

      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

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
      // Delete a journal entry (only if it belongs to the authenticated user)
      const existingEntry = await prisma.journalEntry.findFirst({
        where: { id, userId }
      });

      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

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

export default withAuth(handler);
