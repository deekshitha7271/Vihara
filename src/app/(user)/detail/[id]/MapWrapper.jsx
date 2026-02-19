'use client';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/components/MapComponent'), {
    ssr: false,
    loading: () => <div style={{ height: "480px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>,
});

export default function MapWrapper({ hotels }) {
    return <MapComponent hotels={hotels} />;
}
