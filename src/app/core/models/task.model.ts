import { Product } from './product.model';
import { Employee } from './employee.model';
import { Area } from './area.model';
import { State } from './state.model';
import { MaterialConsumption } from './material-consumption.model';

export interface Task {
  id_task: number;
  id_product: number;
  id_employee: number;
  id_area: number;
  id_state: number;
  sequence: number;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  product?: Product;
  employee?: Employee;
  area?: Area;
  state?: State;
  materialConsumptions?: MaterialConsumption[];
}