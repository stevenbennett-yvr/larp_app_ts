import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css'; // Import the Splide CSS
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

import { coverMage, coverArrow, coverTome, coverFree, coverGuardians, coverMyster, coverSilver } from '../../../assets/images/TatteredVeil';

import "./carousel.css"

const images: string[] = [coverMage, coverGuardians, coverTome, coverFree, coverMyster, coverArrow, coverSilver];

const links: string[] = [
  "https://www.drivethrurpg.com/product/2743",
  "https://www.drivethrurpg.com/product/3549",
  "https://www.drivethrurpg.com/product/23534",
  "https://www.drivethrurpg.com/product/25983",
  "https://www.drivethrurpg.com/product/50486",
  "https://www.drivethrurpg.com/product/51534",
  "https://www.drivethrurpg.com/product/56644"
];

const MageCarousel = () => {
  return (
    <Splide
      options={{
        type: 'loop',
        drag   : 'free',
        focus  : 'center',
        perPage: 3,
        perMove: 1,
        gap: '1rem', // Adjust this as needed
        arrows: false, // Hide left and right arrows
        pagination: false, // Hide bottom dots
        AutoScroll: {
          speed: 1
        },
        pauseOnHover: false, // Disable pause on hover
        interval: 2000, // Autoplay interval in milliseconds
      }}
      extensions={{ AutoScroll }}
    >
      {images.map((image, index) => (
        <SplideSlide key={index} className="enlarged-slide">
          <a href={links[index]} target="_blank" rel="noopener noreferrer">
            <img height={250} src={image} alt={`Image ${index + 1}`} />
          </a>
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default MageCarousel;
