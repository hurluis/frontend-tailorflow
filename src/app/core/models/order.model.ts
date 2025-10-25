export interface Order {
  id_order: number;
  state_name: string;
  customer_name: string;
  entry_date: string;
  estimated_delivery_date?: string;
}