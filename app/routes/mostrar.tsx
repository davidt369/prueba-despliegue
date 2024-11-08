import { LoaderFunction } from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Navbar from '~/components/Navabar';
import { Inmueble } from '~/interfaces/inmueble';
import { getLoggedUser } from '~/services/autenticacion';
import { getInmuebles, deleteInmueble } from '~/services/inmuebles';
import Inmuebler from './inmueble';

export const loader: LoaderFunction = async () => {
  const usuario = await getLoggedUser();
  if (!usuario || usuario.rol !== 'administrador') {
    return redirect('/');
  }
  const inmuebles = await getInmuebles();
  return { usuario, inmuebles };
};

const PropertySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <h4 className="text-lg font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200">{title}</h4>
    {children}
  </div>
);

const PropertyDetail = ({ label, value }: { label: string; value: string | number }) => (
  <div className="mb-1 text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{' '}
    <span className="text-gray-600">{value}</span>
  </div>
);

const ActionButtons = ({
  codigo,
  onEdit,
  onDelete,
}: {
  codigo: string;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex gap-2 mt-4">
    <button
      onClick={() => onEdit()}
      className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
    >
      Editar
    </button>
    <button
      onClick={() => onDelete()}
      className="flex-1 text-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
    >
      Eliminar
    </button>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-lg p-5 animate-pulse h-[500px]">
    <div className="h-[300px] bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/5 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export default function InmueblesList() {
  const { inmuebles: initialInmuebles } = useLoaderData<{ inmuebles: Inmueble[] }>();
  const [inmuebles, setInmuebles] = useState<Inmueble[]>(initialInmuebles);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (inmuebles.length) {
      setIsLoading(false);
    }
  }, [inmuebles]);

  const openModal = (images: string[], index: number) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleEdit = (codigo: string) => {
    console.log('Editar inmueble con código:', codigo);
    // Implement edit functionality here
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este inmueble?')) {
      try {
        await deleteInmueble(id);
        setInmuebles((prevInmuebles) => prevInmuebles.filter((inmueble) => inmueble.id !== id));
      } catch (error) {
        console.error('Error al eliminar el inmueble:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Inmuebler />v
     
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">Propiedades Disponibles</h2>
        <div className="max-w-[2000px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : inmuebles.map((inmueble) => (
                <div
                  key={inmueble.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  {/* Carrusel de Imágenes */}
                  <div className="h-[300px]">
                    {inmueble.imagenesUrls?.length ? (
                      <Carousel
                        showThumbs={false}
                        infiniteLoop
                        useKeyboardArrows
                        autoPlay
                        showStatus={false}
                        className="h-full"
                        onClickItem={(index) => openModal(inmueble.imagenesUrls!, index)}
                      >
                        {inmueble.imagenesUrls.map((url, index) => (
                          <div key={index} className="h-[300px]">
                            <img
                              src={url}
                              alt={`Propiedad ${inmueble.codigo} - ${index + 1}`}
                              className="w-full h-full object-cover cursor-pointer"
                            />
                          </div>
                        ))}
                      </Carousel>
                    ) : (
                      <div className="h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No hay imágenes disponibles</p>
                      </div>
                    )}
                  </div>

                  {/* Detalles del Inmueble */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{inmueble.tipo}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Cod: {inmueble.codigo}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <PropertySection title="Detalles de la Propiedad">
                          <PropertyDetail label="Dirección" value={inmueble.direccion} />
                          <PropertyDetail label="Zona" value={inmueble.zona} />
                          <PropertyDetail label="Superficie" value={`${inmueble.superficie} m²`} />
                          <PropertyDetail label="Sup. Construida" value={`${inmueble.superficieConstruida} m²`} />
                          <PropertyDetail label="Frente" value={`${inmueble.frente} m`} />
                          <PropertyDetail label="Número de Pisos" value={inmueble.numeroPisos} />
                          <PropertyDetail label="Estado" value={inmueble.estado} />
                        </PropertySection>

                        <PropertySection title="Precios">
                          <PropertyDetail
                            label="Precio de Venta"
                            value={`$${inmueble.precioVenta.toLocaleString()}`}
                          />
                          <PropertyDetail label="Precio Propietario" value={`$${inmueble.precioPropietario}`} />
                          <PropertyDetail label="Precio por m²" value={`$${inmueble.precioM2}`} />
                        </PropertySection>

                        <PropertySection title="Características">
                          <PropertyDetail label="Características" value={inmueble.caracteristicas} />
                        </PropertySection>

                        <PropertySection title="Fechas">
                          <PropertyDetail label="Fecha de Registro" value={inmueble.fechaRegistro} />
                          <PropertyDetail label="Fecha de Vencimiento" value={inmueble.fechaVencimiento} />
                        </PropertySection>
                      </div>

                      <div>
                        <PropertySection title="Propietario">
                          <PropertyDetail label="Nombre" value={inmueble.propietario.nombreCompleto} />
                          <PropertyDetail label="Teléfono" value={inmueble.propietario.telefono} />
                          <PropertyDetail label="CI" value={inmueble.propietario.ci} />
                          <PropertyDetail label="Domicilio" value={inmueble.propietario.domicilio} />
                          <PropertyDetail label="Familiar Contacto" value={inmueble.propietario.nombreFamiliar} />
                          <PropertyDetail label="Tel. Familiar" value={inmueble.propietario.telefonoFamiliar} />
                          <PropertyDetail label="Procedencia" value={inmueble.propietario.procedencia} />
                        </PropertySection>

                        <PropertySection title="Servicios">
                          <div className="flex flex-wrap gap-1">
                            {inmueble.servicios.map((servicio, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                              >
                                {servicio.nombre}
                              </span>
                            ))}
                          </div>
                        </PropertySection>
                      </div>
                    </div>

                    <a
                      href={inmueble.ubicacionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mt-4"
                    >
                      Ver Ubicación en Google Maps
                    </a>

                    <ActionButtons
                      codigo={inmueble.codigo}
                      onEdit={() => handleEdit(inmueble.codigo)}
                      onDelete={() => inmueble.id && handleDelete(inmueble.id)}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* Modal de Imágenes */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full max-w-4xl p-4">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={modalImages[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentImageIndex((currentImageIndex - 1 + modalImages.length) % modalImages.length)
                  }
                  className="bg-gray-500 bg-opacity-80 hover:bg-opacity-90 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % modalImages.length)}
                  className="bg-gray-500 bg-opacity-80 hover:bg-opacity-90 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
