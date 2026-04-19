'use client';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/components/MapComponent'), {
    ssr: false,
    loading: () => <div className="mapLoadingFallback">Loading Map...</div>,
});

export default function MapWrapper({ hotels }) {
    return <MapComponent hotels={hotels} />;
}
