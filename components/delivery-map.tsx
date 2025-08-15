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
            pitch: 90,
            duration: 1500,
          });

          if (marker) {
            marker.togglePopup();
          }
        }
      },
    }));

    useEffect(() => {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css";
      document.head.appendChild(cssLink);

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

      window.maptilersdk.config.apiKey = maptilerApiKey;

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

        // Correction du problème de hover
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
          <style>
            .maplibregl-popup-close-button {
              width: 24px !important;
              height: 24px !important;
              font-size: 18px !important;
              font-weight: bold !important;
              line-height: 20px !important;
              transition: all 0.2s ease !important;
            }
            .maptilersdk-popup-close-button:hover {
              background: rgba(239, 68, 68, 0.2) !important;
              color: #dc2626 !important;
              transform: scale(1.1) !important;
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
