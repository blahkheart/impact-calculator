import csv from "csv-parser";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
// import { ImpactVectors, Metadata, RetroPGF3Results } from "~~/app/types/data";
import { RetroPGF3Results } from "~~/app/types/data";

const dataFilePath = path.join(process.cwd(), "public", "data/RPGF3Results.csv");

// interface DataSet {
//   total: number;
//   data: { [key in keyof ImpactVectors]: number };
//   metadata: Metadata;
// }

// interface VectorWeight {
//   vector: keyof ImpactVectors;
//   weight: number;
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }
  //   const { vector } = req;
  console.log("XXXXX:::", req.body);

  const projectData = (await new Promise((resolve, reject) => {
    const data: RetroPGF3Results[] = [];
    fs.createReadStream(dataFilePath)
      .pipe(csv())
      .on("data", row => {
        data.push(row);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", error => {
        reject(error);
      });
  })) as unknown as RetroPGF3Results[];
  //   console.log("XAX::", projectData);
  return res.json(projectData);
}
