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
