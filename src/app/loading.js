import React from 'react';
import Loader from './components/Loader';

export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100dvh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: '#ffffff', // Solid white background
            zIndex: 99999,
            overflow: 'hidden'
        }}>
            <Loader />
        </div>
    );
}
