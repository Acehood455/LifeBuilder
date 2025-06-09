import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { assessmentId } = req.query;

  if (!assessmentId || Array.isArray(assessmentId)) {
    return res.status(400).json({ error: "Invalid assessment ID" });
  }

  const parsedId = parseInt(assessmentId, 10);
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: "Assessment ID must be a number" });
  }

  try {
    const results = await prisma.assessmentResult.findMany({
      where: { assessmentId: parsedId },
      include: { student: true, gradedBy: true },
    });
    return res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
