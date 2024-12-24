import { NextApiRequest, NextApiResponse } from "next";

export async function POST(_: NextApiRequest, res: NextApiResponse) {
  try {
    await res.revalidate("/dashboard");
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
