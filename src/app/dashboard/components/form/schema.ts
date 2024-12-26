import { z } from "zod";

const formSchema = z.object({
  fromAccount: z.string(),
  toAccount: z.string(),
  amount: z.coerce.number().min(0),
  name: z.string(),
  date: z.coerce.date(),
});

export { formSchema };
