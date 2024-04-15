import { Vector, VectorList } from "/app/types/data";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "~~/services/db/dbConnect";

// import { getVectors } from "/utils/impactCalculator/data";

// import dbConnect from "/lib/dbConnect";
// import List from "/models/List";
// import Project from "/models/Project";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // connect to db
  await dbConnect();
  const db = client.db("impact_calculator");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }
  const { term, limit } = req.query;
  if (!term && !limit) return res.status(400).json({ massage: "Bad request" });

  const searchTerm = term as string;
  const searchLimit = limit as string;

  const vectorMatches = db.collection<Vector>("impactVectors").find({
    $or: [{ name: new RegExp(searchTerm, "i") }, { description: new RegExp(searchTerm, "i") }],
  });

  let listMatches = db.collection<VectorList>("vectorLists").find({ name: new RegExp(searchTerm, "i") });
  //   let projectMatches = await Project.find({ name: new RegExp(searchTerm, "i") });

  if (!term) {
    listMatches = await List.find({}).limit(parseInt(searchLimit));
    vectorMatches = db.collection<Vector>("impactVectors").find({}).limit(parseInt(searchLimit));
  }

  const listResult = listMatches.map(list => ({
    ...list._doc,
    type: "list",
  }));

  const projectResult = vectorMatches.map(project => ({
    ...project._doc,
    type: "project",
  }));
  console.log("GET /api/search");
  return res.status(200).json([...projectResult, ...listResult]);
}