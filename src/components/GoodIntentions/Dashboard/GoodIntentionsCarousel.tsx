import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/themes/splide-default.min.css'; // Import the Splide CSS
import { Center } from '@mantine/core';

type VtmCarouselProps = {
    images: string[]
}

const VtmCarousel = ({ images }: VtmCarouselProps) => {
    return (
        <Center>
        <Splide
            options={{
                type: 'loop',
                drag: 'free',
                focus: 'center',
                perPage: Math.min(images.length, 4),
                perMove: 1,
                gap: '1rem', // Adjust this as needed
                arrows: false, // Hide left and right arrows
                pagination: false, // Hide bottom dots
                AutoScroll: {
                    speed: 1
                },
                pauseOnHover: false, // Disable pause on hover
                interval: 2000, // Autoplay interval in milliseconds
                width: 450
            }}
            extensions={{ AutoScroll }}
        >
            {images.map((image, index) => (
                <SplideSlide key={index} className="enlarged-slide">
                    <img src={image} alt={`Image ${index + 1}`} style={{ height: '150px', objectFit: 'cover' }} />
                </SplideSlide>
            ))}
        </Splide>
        </Center>
    );
}

export default VtmCarousel