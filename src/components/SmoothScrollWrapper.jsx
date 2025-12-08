import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollWrapper({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.3,
            easing: (t) => t,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.5,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            normalizeWheel: true,
            lerp: 0.15,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Make lenis accessible globally for debugging
        window.lenis = lenis;

        return () => {
            lenis.destroy();
            delete window.lenis;
        };
    }, []);

    return <>{children}</>;
}
