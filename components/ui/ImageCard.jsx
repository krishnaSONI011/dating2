

export default function ImageCard({
    image,
    city = "Chennai",
    state = "Tamil Nadu",
  }) {
    return (
      <div className="relative group w-full max-w-xl h-[320px] rounded-3xl overflow-hidden cursor-pointer">
  
        {/* Background Image */}
        <img
          src={image}
          alt={city}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
  
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
  
        {/* Content */}
        <div className="absolute bottom-10 left-10 z-10">
          <p className="text-sm tracking-[4px] text-orange-500 mb-2">
            EXPLORE IN
          </p>
  
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {city}
          </h2>
  
          <p className="text-gray-300 text-lg">
            {state}
          </p>
        </div>
      </div>
    );
  }
  