import { useState } from 'react';
import { Inmueble, Servicio } from '~/interfaces/inmueble';

const initialFormData: Inmueble = {
  codigo: '',
  tipo: '',
  direccion: '',
  ubicacionUrl: '',
  zona: '',
  area: '',
  precioVenta: '',
  precioPropietario: '',
  precioM2: '',
  imagenesUrls: [],
  estado: 'disponible',
  numeroPisos: '',
  superficie: '',
  superficieConstruida: '',
  frente: '',
  caracteristicas: '',
  servicios: [],
  propietario: {
    nombreCompleto: '',
    telefono: '',
    ci: '',
    domicilio: '',
    telefonoFamiliar: '',
    nombreFamiliar: '',
    procedencia: ''
  },
  fechaRegistro: new Date().toISOString().split('T')[0],
  fechaVencimiento: ''
};

export function useFormularioInmueble() {
  const [formData, setFormData] = useState<Inmueble>(initialFormData);
  const [nuevoServicio, setNuevoServicio] = useState<Servicio>({ id: '', nombre: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePropietarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      propietario: { ...prevData.propietario, [name]: value }
    }));
  };

  const handleServicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNuevoServicio({ id: Math.random().toString(), nombre: value });
  };

  const agregarServicio = () => {
    if (nuevoServicio.nombre) {
      setFormData((prevData) => ({
        ...prevData,
        servicios: [...prevData.servicios, nuevoServicio]
      }));
      setNuevoServicio({ id: '', nombre: '' });
    }
  };

  const eliminarServicio = (id: string) => {
    setFormData((prevData) => ({
      ...prevData,
      servicios: prevData.servicios.filter((servicio) => servicio.id !== id)
    }));
  };

  const handleLocationSelect = (locationUrl: string) => {
    setFormData((prevData) => ({
      ...prevData,
      ubicacionUrl: locationUrl
    }));
  };

  const handleImageUpload = (imageUrls: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      imagenesUrls: [...prevData.imagenesUrls, ...imageUrls]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return {
    formData,
    nuevoServicio,
    handleChange,
    handlePropietarioChange,
    handleServicioChange,
    agregarServicio,
    eliminarServicio,
    handleLocationSelect,
    handleImageUpload,
    handleSubmit
  };
}
