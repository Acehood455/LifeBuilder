// pages/api/teachers/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const teachers = await prisma.teacher.findMany({
        select: {
          id: true,
          name: true,
          surnName: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return res.status(200).json(teachers);
    } catch (error) {
      console.error("[GET_TEACHERS]", error);
      return res.status(500).json({ message: "Failed to fetch teachers" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
