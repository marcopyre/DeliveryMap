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

// Cache global pour éviter de recharger MapTiler
let mapTilerSDKCache: {
  loaded: boolean;
  loading: boolean;
  callbacks: (() => void)[];
} = {
  loaded: false,
  loading: false,
  callbacks: [],
};

// Cache pour les instances de cartes
const mapInstanceCache = new Map<string, any>();

// Cache pour les styles de cartes
const mapStyleCache = new Map<string, any>();

export const DeliveryMap = forwardRef<DeliveryMapRef, DeliveryMapProps>(
  ({ customers, maptilerApiKey }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isMapTilerLoaded, setIsMapTilerLoaded] = useState(
      mapTilerSDKCache.loaded
    );
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const customerMarkersRef = useRef<Map<string, any>>(new Map());
    const cacheKey = `map_${maptilerApiKey}`;

    useImperativeHandle(ref, () => ({
      focusOnCustomer: (customerId: string) => {
        const customer = customers.find((c) => c.id === customerId);
        const marker = customerMarkersRef.current.get(customerId);

        if (customer && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo({
            center: [customer.longitude, customer.latitude],
            zoom: 16,
            pitch: 90,
            duration: 1500,
          });

          if (marker) {
            marker.togglePopup();
          }
        }
      },
    }));

    // Fonction pour charger MapTiler SDK avec cache
    const loadMapTilerSDK = () => {
      return new Promise<void>((resolve) => {
        // Si déjà chargé, résoudre immédiatement
        if (mapTilerSDKCache.loaded) {
          resolve();
          return;
        }

        // Ajouter le callback à la liste
        mapTilerSDKCache.callbacks.push(() => {
          resolve();
        });

        // Si déjà en cours de chargement, ne pas recharger
        if (mapTilerSDKCache.loading) {
          return;
        }

        mapTilerSDKCache.loading = true;

        // Vérifier si les éléments existent déjà
        const existingCSS = document.querySelector(
          'link[href*="maptiler-sdk.css"]'
        );
        const existingScript = document.querySelector(
          'script[src*="maptiler-sdk.umd.js"]'
        );

        if (!existingCSS) {
          const cssLink = document.createElement("link");
          cssLink.rel = "stylesheet";
          cssLink.href =
            "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css";
          document.head.appendChild(cssLink);
        }

        if (!existingScript) {
          const maptilerScript = document.createElement("script");
          maptilerScript.src =
            "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.js";
          maptilerScript.onload = () => {
            console.log("MapTiler SDK loaded successfully");
            mapTilerSDKCache.loaded = true;
            mapTilerSDKCache.loading = false;

            // Exécuter tous les callbacks en attente
            mapTilerSDKCache.callbacks.forEach((callback) => callback());
            mapTilerSDKCache.callbacks = [];
          };
          maptilerScript.onerror = () => {
            console.error("Failed to load MapTiler SDK");
            mapTilerSDKCache.loading = false;
          };
          document.head.appendChild(maptilerScript);
        } else if (window.maptilersdk) {
          // Script déjà présent et chargé
          mapTilerSDKCache.loaded = true;
          mapTilerSDKCache.loading = false;
          mapTilerSDKCache.callbacks.forEach((callback) => callback());
          mapTilerSDKCache.callbacks = [];
        }
      });
    };

    useEffect(() => {
      loadMapTilerSDK().then(() => {
        setIsMapTilerLoaded(true);
      });
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

      // Vérifier le cache d'instance
      const cachedInstance = mapInstanceCache.get(cacheKey);
      if (cachedInstance && cachedInstance.getContainer()) {
        try {
          // Réutiliser l'instance existante si possible
          cachedInstance.setContainer(mapRef.current);
          mapInstanceRef.current = cachedInstance;
          setIsMapInitialized(true);
          return;
        } catch (e) {
          // En cas d'erreur, supprimer du cache et créer une nouvelle instance
          mapInstanceCache.delete(cacheKey);
        }
      }

      window.maptilersdk.config.apiKey = maptilerApiKey;

      const styleUrl = `https://api.maptiler.com/maps/0198aaaf-2337-7c76-9595-11d180a7d752/style.json?key=${maptilerApiKey}`;

      // Vérifier le cache de style
      let mapOptions: any = {
        container: mapRef.current,
        center: [5.7245, 45.1885],
        language: "fr",
        zoom: 10,
        pitch: 100,
        bearing: 0,
        attributionControl: false,
        navigationControl: false,
        geolocateControl: false,
        logoControl: false,
      };

      if (mapStyleCache.has(styleUrl)) {
        // Utiliser le style en cache
        mapOptions.style = mapStyleCache.get(styleUrl);
      } else {
        mapOptions.style = styleUrl;
      }

      const map = new window.maptilersdk.Map(mapOptions);

      map.on("load", () => {
        console.log("Map loaded successfully");

        // Mettre en cache le style une fois chargé
        if (!mapStyleCache.has(styleUrl)) {
          mapStyleCache.set(styleUrl, map.getStyle());
        }

        setIsMapInitialized(true);
      });

      // Mettre en cache l'instance
      mapInstanceCache.set(cacheKey, map);
      mapInstanceRef.current = map;

      return () => {
        // Ne pas supprimer l'instance du cache, juste nettoyer les références
        if (
          mapInstanceRef.current &&
          mapInstanceRef.current !== cachedInstance
        ) {
          // Seulement si c'est une nouvelle instance, pas celle en cache
          mapInstanceRef.current.remove();
        }
        mapInstanceRef.current = null;
      };
    }, [isMapTilerLoaded, maptilerApiKey, cacheKey]);

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

      customerMarkersRef.current.forEach((marker) => {
        marker.remove();
      });
      customerMarkersRef.current.clear();

      const bounds = new window.maptilersdk.LngLatBounds();

      customers.forEach((customer, index) => {
        console.log(
          `Adding marker for customer ${index + 1}:`,
          customer.name,
          customer.latitude,
          customer.longitude
        );

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
            position: relative;
            z-index: 1;
          ">
            📍
          </div>
        `;

        markerElement.addEventListener("mouseenter", (e) => {
          e.stopPropagation();
          const innerDiv = markerElement.querySelector("div") as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = "scale(1.1)";
            innerDiv.style.zIndex = "999";
          }
        });

        markerElement.addEventListener("mouseleave", (e) => {
          e.stopPropagation();
          const innerDiv = markerElement.querySelector("div") as HTMLElement;
          if (innerDiv) {
            innerDiv.style.transform = "scale(1)";
            innerDiv.style.zIndex = "1";
          }
        });

        const marker = new window.maptilersdk.Marker({
          element: markerElement,
        })
          .setLngLat([customer.longitude, customer.latitude])
          .addTo(mapInstanceRef.current);

        const popup = new window.maptilersdk.Popup({
          offset: [0, -35],
          closeButton: true,
          closeOnClick: true,
        }).setHTML(`
          <div style="font-family: 'Urbanist', sans-serif; min-width: 200px; padding: 8px;">
            <strong style="color: #1f2937; font-size: 16px; display: block; margin-bottom: 8px;">
              ${customer.name}
            </strong>
            <div style="color: #6b7280; font-size: 13px; margin-bottom: 8px; line-height: 1.4;">
              📍 ${customer.address}
            </div>
          </div>
          <style>
            .maplibregl-popup-close-button {
              width: 24px !important;
              height: 24px !important;
              font-size: 18px !important;
              font-weight: bold !important;
              line-height: 20px !important;
              transition: all 0.2s ease !important;
            }
          </style>
        `);

        marker.setPopup(popup);
        customerMarkersRef.current.set(customer.id, marker);

        bounds.extend([customer.longitude, customer.latitude]);
      });

      console.log("All markers added successfully");

      if (customers.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: 40,
          maxZoom: 15,
          zoom: 14,
          pitch: 5,
        });
      }
    }, [customers, isMapInitialized]);

    const isLoading = !isMapTilerLoaded || !isMapInitialized;

    return (
      <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full" />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <p className="text-gray-700 font-urbanist font-medium">
                {mapTilerSDKCache.loaded
                  ? "Initialisation de la carte..."
                  : "Chargement de MapTiler..."}
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
