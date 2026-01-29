'use client';

import { useState } from 'react';

export default function HotelImage({ src, alt, className, fallbackSrc = '/resort-2.jpg' }) {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
}
