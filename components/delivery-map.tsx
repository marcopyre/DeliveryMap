"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { Customer } from "@/types/delivery";

interface DeliveryMapProps {
  customers: Customer[];
  maptilerApiKey: string;
}

export interface DeliveryMapRef {
  focusOnCustomer: (customerId: string) => void;
}

declare global {
  interface Window {
    maptilersdk: any;
  }
}

export const DeliveryMap = forwardRef<DeliveryMapRef, DeliveryMapProps>(
  ({ customers, maptilerApiKey }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isMapTilerLoaded, setIsMapTilerLoaded] = useState(false);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const customerMarkersRef = useRef<Map<string, any>>(new Map());

    useImperativeHandle(ref, () => ({
      focusOnCustomer: (customerId: string) => {
        const customer = customers.find((c) => c.id === customerId);
        const marker = customerMarkersRef.current.get(customerId);

        if (customer && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [customer.longitude, customer.latitude],
            zoom: 16,
            pitch: 90, // Vue 3D lors du focus
            duration: 1500,
          });

          // Ouvrir le popup du marqueur
          if (marker) {
            marker.togglePopup();
          }
        }
      },
    }));

    useEffect(() => {
      // Charger MapTiler CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css";
      document.head.appendChild(cssLink);

      // Charger MapTiler SDK JS
      const maptilerScript = document.createElement("script");
      maptilerScript.src =
        "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.js";
      maptilerScript.onload = () => {
        console.log("MapTiler SDK loaded successfully");
        setIsMapTilerLoaded(true);
      };
      maptilerScript.onerror = () => {
        console.error("Failed to load MapTiler SDK");
      };
      document.head.appendChild(maptilerScript);

      return () => {
        [maptilerScript, cssLink].forEach((element) => {
          if (document.head.contains(element)) {
            document.head.removeChild(element);
          }
        });
      };
    }, []);

    useEffect(() => {
      if (
        !isMapTilerLoaded ||
        !mapRef.current ||
        !window.maptilersdk ||
        !maptilerApiKey
      ) {
        console.log("Map initialization skipped:", {
          isMapTilerLoaded,
          mapRef: !!mapRef.current,
          maptilersdk: !!window.maptilersdk,
          apiKey: !!maptilerApiKey,
        });
        return;
      }

      console.log("Initializing MapTiler map...");

      // Configurer la clé API
      window.maptilersdk.config.apiKey = maptilerApiKey;

      // Créer la carte
      const map = new window.maptilersdk.Map({
        container: mapRef.current,
        style: `https://api.maptiler.com/maps/0198aaaf-2337-7c76-9595-11d180a7d752/style.json?key=${maptilerApiKey}`,
        center: [5.7245, 45.1885],
        language: "fr",
        zoom: 10,
        pitch: 100,
        bearing: 0,
        attributionControl: false,
        navigationControl: false,
        geolocateControl: false,
        logoControl: false,
      });

      map.on("load", () => {
        console.log("Map loaded successfully");
        setIsMapInitialized(true);
      });

      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [isMapTilerLoaded, maptilerApiKey]);

    useEffect(() => {
      if (
        !mapInstanceRef.current ||
        !window.maptilersdk ||
        customers.length === 0 ||
        !isMapInitialized
      ) {
        console.log("Markers update skipped:", {
          map: !!mapInstanceRef.current,
          maptilersdk: !!window.maptilersdk,
          customersCount: customers.length,
          isMapInitialized,
        });
        return;
      }

      console.log("Adding markers for", customers.length, "customers");

      // Nettoyer les marqueurs existants
      customerMarkersRef.current.forEach((marker) => {
        marker.remove();
      });
      customerMarkersRef.current.clear();

      // Créer les marqueurs pour chaque client
      const bounds = new window.maptilersdk.LngLatBounds();

      customers.forEach((customer, index) => {
        console.log(
          `Adding marker for customer ${index + 1}:`,
          customer.name,
          customer.latitude,
          customer.longitude
        );

        // Créer un élément DOM pour le marqueur personnalisé
        const markerElement = document.createElement("div");
        markerElement.className = "custom-customer-marker";
        markerElement.innerHTML = `
          <div style="
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            📍
          </div>
        `;

        // Animation hover
        markerElement.addEventListener("mouseenter", () => {
          markerElement.style.transform = "scale(1.1)";
        });
        markerElement.addEventListener("mouseleave", () => {
          markerElement.style.transform = "scale(1)";
        });

        // Créer le marqueur
        const marker = new window.maptilersdk.Marker({
          element: markerElement,
        })
          .setLngLat([customer.longitude, customer.latitude])
          .addTo(mapInstanceRef.current);

        // Créer le popup
        const popup = new window.maptilersdk.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
        }).setHTML(`
          <div style="font-family: 'Urbanist', sans-serif; min-width: 200px; padding: 8px;">
            <strong style="color: #1f2937; font-size: 16px; display: block; margin-bottom: 8px;">
              ${customer.name}
            </strong>
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px; line-height: 1.4;">
              📍 ${customer.address}
            </div>
            <div style="
              background: linear-gradient(135deg, #10B981 0%, #059669 100%);
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 600;
              text-align: center;
              display: inline-block;
            ">
              🚚 Client disponible
            </div>
          </div>
        `);

        marker.setPopup(popup);
        customerMarkersRef.current.set(customer.id, marker);

        // Ajouter les coordonnées aux bounds
        bounds.extend([customer.longitude, customer.latitude]);
      });

      console.log("All markers added successfully");

      // Ajuster la vue pour inclure tous les marqueurs
      if (customers.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: 40,
          maxZoom: 15,
          zoom: 14,
          pitch: 5, // Maintenir la vue 3D lors du fit bounds
        });
      }
    }, [customers, isMapInitialized]);

    const isLoading = !isMapTilerLoaded || !isMapInitialized;

    return (
      <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay de chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-urbanist font-medium">
                Chargement de MapTiler...
              </p>
              <p className="text-gray-500 font-urbanist text-sm mt-1">
                Chargement de la vue 3D terrain
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DeliveryMap.displayName = "DeliveryMap";
