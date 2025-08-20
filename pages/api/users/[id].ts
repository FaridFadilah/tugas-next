import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Valid user ID is required" });
  }

  try {
    if (req.method === "GET") {
      // Get user profile with stats
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              journalEntries: true,
              reminders: true,
              aiSummaries: true,
              exportLogs: true
            }
          },
          journalEntries: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              mood: true,
              createdAt: true,
              tags: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } 
    else if (req.method === "PUT") {
      // Update user profile
      const { name, email, currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateData: any = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Handle password change
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Current password is required" });
        }

        // Ensure stored password hash exists before comparing
        if (!user.password) {
          return res.status(400).json({ error: "Current password is not set" });
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ error: "Current password is incorrect" });
        }

        updateData.password = await bcrypt.hash(newPassword, 12);
      }

      updateData.updatedAt = new Date();

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.status(200).json(updatedUser);
    } 
    else if (req.method === "DELETE") {
      // Delete user account
      await prisma.user.delete({
        where: { id }
      });

      res.status(200).json({ message: "User account deleted successfully" });
    } 
    else {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("User profile API error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
