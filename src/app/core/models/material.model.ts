import { Area } from './area.model';
import { MaterialConsumption } from './material-consumption.model';

export interface Material {
  id_material: number;
  id_area: number;
  name: string;
  current_stock: number;
  min_stock: number;
  area?: Area;
  consumptions?: MaterialConsumption[];
}