import { useState, useRef, useEffect, useMemo } from "react";
import { Feature } from "ol";
import { Map, View } from "ol";
import { Point } from "ol/geom";
import { OSM } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { toLonLat, fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { Icon, Style } from "ol/style";
import "ol/ol.css";

interface LocationMapProps {
  onLocationSelect: (lat: number, lon: number, url: string) => void;
  initialLocation?: { lat: number | null; lon: number | null; url: string | null };
  onClose: () => void;
}

export default function LocationMap({ onLocationSelect, initialLocation, onClose }: LocationMapProps) {
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string | null>(initialLocation?.url || null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const iconFeatureRef = useRef<Feature<Point> | null>(null);

  const cochabambaCoords = useMemo(() => {
    return initialLocation?.lat && initialLocation?.lon ? [initialLocation.lon, initialLocation.lat] : [-66.165, -17.38];
  }, [initialLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat(cochabambaCoords)),
      });

      const vectorSource = new VectorSource({
        features: [iconFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: "https://openlayers.org/en/latest/examples/data/icon.png",
          }),
        }),
      });

      iconFeatureRef.current = iconFeature;

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat(cochabambaCoords),
          zoom: 12,
        }),
      });

      mapInstanceRef.current.on("click", (event) => {
        const coordinates = toLonLat(event.coordinate);
        const [lon, lat] = coordinates;

        if (iconFeatureRef.current) {
          iconFeatureRef.current.setGeometry(new Point(fromLonLat([lon, lat])));
        }

        const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        setSelectedCoords([lat, lon]);
        setGoogleMapsUrl(mapsUrl);
      });
    }
  }, [cochabambaCoords]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const query = `${searchQuery}, Cochabamba, Bolivia`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);

        mapInstanceRef.current?.getView().setCenter(coordinates);

        if (iconFeatureRef.current) {
          iconFeatureRef.current.setGeometry(new Point(coordinates));
        }

        const mapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        setSelectedCoords([parseFloat(lat), parseFloat(lon)]);
        setGoogleMapsUrl(mapsUrl);
      } else {
        alert("Ubicación no encontrada. Intente de nuevo.");
      }
    } catch (error) {
      console.error("Error al buscar ubicación:", error);
      alert("Ocurrió un error al buscar la ubicación.");
    }
  };

  const handleConfirmLocation = () => {
    if (selectedCoords && googleMapsUrl) {
      const [lat, lon] = selectedCoords;
      onLocationSelect(lat, lon, googleMapsUrl);
    } else {
      alert("Seleccione una ubicación en el mapa o use la búsqueda antes de enviar.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Seleccione la Ubicación</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ubicación en Cochabamba..."
            className="w-full md:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-300 transition ease-in-out duration-200"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ease-in-out duration-200"
          >
            Buscar
          </button>
        </div>

        <div
          ref={mapRef}
          className="border border-gray-300 rounded-lg overflow-hidden shadow-md mb-4"
          style={{
            height: "400px",
            width: "100%",
          }}
        ></div>

        {googleMapsUrl && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Ubicación seleccionada:{" "}
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                Abrir en Google Maps
              </a>
            </p>
          </div>
        )}

<button
  type="button"
  onClick={handleConfirmLocation}
  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:bg-green-700 
             focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95 transition-transform duration-200 ease-out"
>
  Enviar Ubicación
</button>

<button
  type="button"
  onClick={onClose}
  className="w-full mt-4 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700 
             focus:outline-none focus:ring-2 focus:ring-red-500 active:scale-95 transition-transform duration-200 ease-out"
>
  Cancelar
</button>

      
      </div>
    </div>
  );
}
