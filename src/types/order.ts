export type OrderStatus = "pending" | "paid" | "delivered" | "cancelled";

export interface Order {
  id: string;
  accountId: string;
  amountBp: number;
  totalVnd: number;
  status: OrderStatus;
  createdAt: string;
}
