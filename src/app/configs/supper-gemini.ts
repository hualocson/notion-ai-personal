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
      nullable: true,
    },
    amount: {
      type: SchemaType.NUMBER,
      description: "Transaction amount",
    },
    fromAccount: {
      type: SchemaType.STRING,
      description: "Transaction from account (required)",
      enum: ["bidv", "momo", "gp", "fund_food", "cash", "badminton", "kindle"],
    },
    toAccount: {
      type: SchemaType.STRING,
      description: "Transaction to account (null if can not detect from input)",
      enum: ["bidv", "momo", "gp", "fund_food", "cash", "badminton", "kindle"],
      nullable: true,
    },
  },
  required: ["name", "amount", "fromAccount"],
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
    1. Detect from account and to account in transaction input if not have 'to account' from input set 'toAccount' is null value
    2. The system will extract the date (DD/MM/YY) or (DD/MM) from your message and return it as YYYY-MM-DD based on the current time (${now}), if not provide date return null value or ${now}.
    3. With from account field: Return a account in my enum array, if not valid value return cash
    4. With to account field:  Return a account in my enum array, if not valid value return null
    5. Handle amount value in my input like '100k' return 100000 or '30 ngàn' return 30000
    6. You can check typo and improve name in my input (in Vietnamese).`,
});

export default model;
