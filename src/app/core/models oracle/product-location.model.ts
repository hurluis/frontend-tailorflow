export interface ProductLocation {
  id_product: number;
  product_name: string;
  category: string;
  general_product_status: string;
  id_order: number;
  customer: string;
  id_task: number;
  process_number: number;
  task_status: string;
  id_area: number;
  production_area: string;
  worker: string;
  worker_cc: string;
  worker_role: string;
  start_date: string;
  end_date: string;
  task_progress: string;
  total_tasks: number;
  completed_tasks: number;
  next_area: string;
  consumed_materials: string;
}