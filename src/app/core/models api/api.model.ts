
export interface CreateOrderPayload {
  id_customer: number;
  estimated_delivery_date: string;
}


export interface ProductMaterialPayload {
  id_material: number;
  quantity: number;
}


export interface CreateProductPayload {
  id_order: number;
  id_category: number;
  name: string;
  customized?: number; 
  ref_photo?: string;
  dimensions?: string;
  fabric: string; 
  description?: string;
  materials: ProductMaterialPayload[]; 
}
