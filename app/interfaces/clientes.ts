// Interface para Cliente
export interface Cliente {
    uid?: string;    
    nombreCompleto: string;
    telefono: string;
    preferencias: Preferencias;
    fechaRegistro:string;
    activo: boolean;  
  }
  
  // Interface para Preferencias dentro de Cliente
  interface Preferencias {
    tipoInmueble: string;
    precioMin: number;
    precioMax: number;
    direccion: string;   
    zona: string;
   
  }
  
  // Interface para Notificacion
  interface Notificacion {
    usuarioId: string; // destinatario de la notificación
    inmuebleId?: string; // opcional, si aplica
    mensaje: string;
    fechaCreacion:string;
    leida: boolean;
  }
  
  // Interface para Actividad
  interface Actividad {
    usuarioId: string; // vendedor que realiza la actividad
    fecha:string;
    reporte: string;
  }
