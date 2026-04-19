import Image from "next/image";
import React from "react";

const Loader = ({ width = 100, height = 100 }) => {
    return (
        <div className="loaderContainer">
            <Image
                src="/loader.gif"
                alt="Loading..."
                width={width}
                height={height}
                unoptimized // GIFs often need unoptimized to animate correctly if Next.js image optimization is aggressive
            />
        </div>
    );
};

export default Loader;
