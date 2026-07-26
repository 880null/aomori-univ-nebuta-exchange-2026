"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import { useUiText } from "@/hooks/use-language";
import { rassetLandCenter } from "@/lib/rasseland";

export function RasselandMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const getUiText = useUiText();

  useEffect(() => {
    let disposed = false;
    let removeMap: (() => void) | undefined;

    void (async () => {
      try {
        const L = await import("leaflet");
        const container = containerRef.current;

        if (disposed || !container) {
          return;
        }

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const map = L.map(container, {
          center: [rassetLandCenter.lat, rassetLandCenter.lng],
          zoom: 16,
          zoomAnimation: !reduceMotion,
          fadeAnimation: !reduceMotion,
          markerZoomAnimation: !reduceMotion,
        });

        removeMap = () => map.remove();

        L.tileLayer(
          "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
          {
            attribution:
              '<a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
            maxZoom: 18,
          },
        ).addTo(map);

        const pinIcon = L.divIcon({
          className: "rasseland-map-marker",
          html: '<span class="rasseland-map-pin" aria-hidden="true"><span class="rasseland-map-pin-dot"></span></span>',
          iconSize: [36, 44],
          iconAnchor: [18, 44],
        });

        L.marker([rassetLandCenter.lat, rassetLandCenter.lng], {
          icon: pinIcon,
          interactive: false,
          keyboard: false,
        }).addTo(map);
      } catch {
        // 地図を初期化できなくても、ページ内の小屋番号順リストは利用できる。
      }
    })();

    return () => {
      disposed = true;
      removeMap?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rasseland-map"
      role="region"
      aria-label={getUiText("mapAriaLabel")}
    />
  );
}
