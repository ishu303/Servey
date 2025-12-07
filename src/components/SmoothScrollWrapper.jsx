import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollWrapper({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 0.6,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.2,
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
