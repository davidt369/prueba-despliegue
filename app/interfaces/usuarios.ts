export default interface Usuario {
    uid?: string;
    email: string;
    nombre: string;
    apellidos: string;
    contrasena?: string;
    rol: "administrador" | "empleado" | "vendedor";
    telefono: string;
    estado: boolean;
  }
  