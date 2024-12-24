import { Client, LogLevel } from "@notionhq/client";

const token = process.env.NOTION_TOKEN ?? "";

const notion = new Client({
  auth: token,
  notionVersion: "2022-06-28",
  logLevel: LogLevel.DEBUG,
});

export default notion;
