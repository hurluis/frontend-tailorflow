import { Material } from './material.model';
import { Task } from './task.model';

export interface MaterialConsumption {
  id_consumption: number;
  id_material: number;
  id_task: number;
  quantity: number;
  material?: Material;
  task?: Task;
}