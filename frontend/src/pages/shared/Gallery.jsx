import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import img1 from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import img2 from '../../assets/18297.jpg';
import img3 from '../../assets/Mangrove-Forest-Coast-2000x1237-1.jpg';
import img4 from '../../assets/4k-wallpaper-clouds-cropland-dawn.jpg';
import img5 from '../../assets/pexels-adnan-atasoy-261355608-12644453.jpg';
import img6 from '../../assets/wp9161748.jpg';

const Gallery = () => {
  const originalImages = [img1, img2, img3, img4, img5, img6];
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch
    const fetchGallery = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setImages(originalImages);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Compact Retro Title */}
        <h1 className="logo-retro text-4xl md:text-6xl lg:text-[60px] mb-12 text-white uppercase tracking-tight" style={{ WebkitTextFillColor: 'white', background: 'none' }}>
          GALLERY
        </h1>

        {/* Clean Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full aspect-video md:aspect-[4/3] bg-[#1a1a1a] animate-pulse rounded-none"
              ></div>
            ))
          ) : (
            images.map((img, index) => (
              <div
                key={index}
                className="w-full aspect-video md:aspect-[4/3] overflow-hidden bg-[#1a1a1a]"
              >
                <img
                  src={img}
                  alt={`Gallery visual ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
