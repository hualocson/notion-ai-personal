interface ITransaction {
  name: string;
  amount: number;
  date: string;
  account: string;
}

interface ITransfer {
  name: string;
  amount: number;
  date: string;
  fromAccount: string;
  toAccount: string;
}

interface IGeminiOutput {
  name: string;
  amount: number;
  date: string | null;
  fromAccount: string;
  toAccount: string | null;
}
