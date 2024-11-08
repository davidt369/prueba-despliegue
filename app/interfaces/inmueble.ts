// Piso interface
export interface Piso {
    uid?: string; // UID único para el piso (opcional si necesitas identificar cada piso)
    numero: number;
    descripcion: string;
    imagenes: string[]; // URLs de imágenes almacenadas en Firebase Storage
}

// types.ts

export interface Propietario {
  nombreCompleto: string;
  telefono: string;
  ci: string;
  domicilio: string;
  telefonoFamiliar: string;
  nombreFamiliar: string;
  procedencia: string;
}

export interface Servicio {
  nombre: string;
}

export interface Inmueble {
  id?: string
  codigo: string;
  tipo: string;
  direccion: string;
  ubicacionUrl: string;
  zona: string;
  area: string;
  precioVenta: number | string;
  precioPropietario: number | string;
  precioM2: number | string;
  imagenesUrls?: string[];
  estado: 'disponible' | 'en_tramite' | 'vendido' | 'vencido';
  numeroPisos: number | string;
  superficie: number | string;
  superficieConstruida: number | string;
  frente: number | string;
  caracteristicas: string;
  servicios: Servicio[];
  propietario: Propietario;
  fechaRegistro: string;
  fechaVencimiento: string;
  eliminar: boolean;
}

