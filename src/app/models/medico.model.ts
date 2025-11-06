export interface Medico {
  id: number;
  nombre: string;
  apellidos: string;
  especialidad: string;
  numeroLicencia: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
  fechaRegistro: Date;
}

export interface MedicoRequest {
  nombre: string;
  apellidos: string;
  especialidad: string;
  numeroLicencia: string;
  telefono: string;
  email: string;
  estado: 'activo' | 'inactivo';
}
