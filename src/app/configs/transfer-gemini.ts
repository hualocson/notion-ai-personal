import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from "@google/generative-ai";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const schema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: {
      type: SchemaType.STRING,
      description: "Name of the transaction",
    },
    date: {
      type: SchemaType.STRING,
      description:
        "Transaction date in YYYY-MM-DD format. If not provided, the current date will be used.",
    },
    amount: {
      type: SchemaType.NUMBER,
      description: "Transaction amount",
    },
    fromAccount: {
      type: SchemaType.STRING,
      description: "Transfer from account",
      enum: ["bidv", "momo", "gp", "fund_food", "cash", "badminton", "kindle"],
    },
    toAccount: {
      type: SchemaType.STRING,
      description: "Transfer to account",
      enum: ["bidv", "momo", "gp", "fund_food", "cash", "badminton", "kindle"],
    },
  },
  required: ["name", "amount", "fromAccount", "toAccount"],
};

const now = dayjs().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");

const token = process.env.GEMINI_TOKEN ?? "";
const genAI = new GoogleGenerativeAI(token);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
  systemInstruction: `You are a my finance assistant and I want your process my input to output format i were provided and valid condition:
    1. Detect from account and to account in transfer input
    2. The system will extract the date (DD/MM/YY) or (DD/MM) from your message and return it as YYYY-MM-DD based on the current time (${now}), if not provide date return null value or ${now}.
    3. return a account in my enum array, if not valid value return cash
    4. Handle amount value in my input like '100k' return 100000 or '30 ngàn' return 30000`,
});

export default model;
