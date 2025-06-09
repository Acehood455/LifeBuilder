import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid result ID" });
  }

  const resultId = parseInt(id, 10);
  if (isNaN(resultId)) {
    return res.status(400).json({ error: "Result ID must be a number" });
  }

  const { score, remarks, gradedById } = req.body;

  try {
    const validGradedById = gradedById && gradedById.trim() !== "" ? gradedById : null;
    // console.log("Incoming gradedById:", gradedById);
    // console.log("Validated gradedById:", validGradedById);
    // console.log("Score:", score, "Remarks:", remarks);

    if (validGradedById) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: validGradedById },
      });

      if (!teacher) {
        return res.status(400).json({ error: "Invalid gradedById (Teacher not found)" });
      }
    }

    const updated = await prisma.assessmentResult.update({
      where: { id: resultId },
      data: {
        score,
        remarks,
        gradedById: validGradedById || null,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating result:", err);
    return res.status(500).json({ error: "Failed to update result." });
  }
}
