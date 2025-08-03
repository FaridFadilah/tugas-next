import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, value } = req.body;

    try {
      const data = await prisma.data.create({
        data: { name, value },
      });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to create data" });
    }
  } else if (req.method === "GET") {
    try {
      const data = await prisma.data.findMany();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
