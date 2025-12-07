import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollWrapper({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
            normalizeWheel: true,
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
