import { useEffect, useRef } from "react";
import galleryImage1 from "../assets/galleryImage1.png";
import galleryImage2 from "../assets/galleryImage2.png";
import galleryImage3 from "../assets/galleryImage3.png";
import galleryImage4 from "../assets/galleryImage4.png";

export function Gallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const images = [
        galleryImage1, galleryImage2, galleryImage3, galleryImage4,
        galleryImage1, galleryImage2, galleryImage3, galleryImage4
    ];

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const handleScroll = () => {
            const rect = container.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const totalHeight = rect.height;
            const scrolled = -rect.top;
            const maxScroll = totalHeight - viewHeight;

            if (maxScroll <= 0) return;

            // Clamped scroll progress (0 to 1)
            const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
            
            // Calculate limit (total scrollable horizontal width)
            const limit = Math.max(0, track.scrollWidth - window.innerWidth);
            
            // Apply horizontal transform on the track
            track.style.transform = `translateX(-${progress * limit}px)`;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        
        // Timeout to ensure elements are measured after paint/images loaded
        const timer = setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <section ref={containerRef} className="relative h-[180vh] w-full">
            {/* Sticky view wrapper */}
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                
                {/* Horizontal scroll track */}
                <div ref={trackRef} className="flex gap-5 px-4 md:px-16 lg:px-24 xl:px-32 py-16 md:py-20 will-change-transform transition-transform duration-300 ease-out">
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Gallery Image ${index + 1}`} className="w-91 h-114.25 object-cover shrink-0 pointer-events-none" />
                    ))}
                </div>

            </div>
        </section>
    );
}