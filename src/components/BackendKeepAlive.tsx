import React, { useEffect } from "react";

// Hook para mantener vivo el backend
const useKeepAlive = (url: string, interval: number = 30000): void => { 
    useEffect(() => {
        const keepAlive = async () => {
            try {
                await fetch(url);
            } catch (error) {
                console.error("Error manteniendo vivo el backend:", error);
            }
        };

        keepAlive();
        const intervalId = setInterval(keepAlive, interval); 

        return () => clearInterval(intervalId); 
    }, [url, interval]);
};

const BackendKeepAlive: React.FC = () => {
    useKeepAlive("https://deploybackenddiancrochet.onrender.com/", 30000);
    return null;
};

export default BackendKeepAlive;
