export interface OrderTracking {

  id_order?: number; 
  entry_date?: string; 
  estimated_delivery_date?: string; 
  order_status: string; 


  id_customer: number; 
  customer_name?: string; 
  customer_phone?: string; 
  customer_address?: string; 


  id_product: number; 
  product_name?: string; 
  product_category?: string;
  product_status: string; 
  customized?: string; 
  fabric?: string; 
  dimensions?: string; 


  id_task: number; 
  sequence: number; 
  production_area?: string; 
  task_status: string; 
  assigned_worker_name?: string; 
  worker_cc?: string; 
  task_start_date?: string; 
  task_end_date?: string; 
  task_duration?: string; 
}