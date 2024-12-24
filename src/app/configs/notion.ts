import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN ?? "";

const notion = new Client({ auth: token });

export default notion;
