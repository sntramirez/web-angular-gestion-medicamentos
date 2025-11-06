export interface Medicamento {
  id: number;
  nombre: string;
  descripcion: string;
  lote: string;
  fechaCaducidad: Date;
  cantidad: number;
  ubicacion: string;
  proveedor: string;
  alertaCaducidad?: boolean;
  diasParaCaducar?: number;
}

export interface MedicamentoRequest {
  nombre: string;
  descripcion: string;
  lote: string;
  fechaCaducidad: Date;
  cantidad: number;
  ubicacion: string;
  proveedor: string;
}
