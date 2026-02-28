export default function ImageCard({
  image,
  city = "Hyderabad",
  count = "1,400+"
}) {
  return (
    <div className="
      relative group w-full 
      h-[180px] sm:h-[220px] md:h-[260px] lg:h-[270px]
      rounded-2xl md:rounded-3xl 
      overflow-hidden cursor-pointer
    ">

      {/* Image */}
      <img
        src={image}
        alt={city}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

      {/* Count Badge */}
      <div className="absolute top-3 right-3 md:top-5 md:right-5 z-20">
        <div className="
          bg-orange-500 text-white 
          text-xs md:text-sm 
          font-semibold 
          px-3 py-1.5 md:px-4 md:py-2 
          rounded-full shadow-lg
        ">
          {count}
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">

        {/* City */}
        <h2 className="
          text-white font-bold 
          text-lg sm:text-xl md:text-2xl lg:text-3xl
          mb-2 drop-shadow-lg
        ">
          {city}
        </h2>

        {/* Button wrapper */}
        <div className="overflow-hidden h-[45px] md:h-[55px]">

          <button className="
            translate-y-12 opacity-0
            group-hover:translate-y-0 group-hover:opacity-100
            transition-all duration-500 ease-out
            
            flex items-center gap-2
            bg-[#0f172a]/80 backdrop-blur-md
            border border-orange-500/40
            text-orange-400
            text-sm md:text-base
            px-4 py-2 md:px-6 md:py-2.5
            rounded-full
            font-semibold
            hover:bg-orange-500 hover:text-white
            shadow-md
          ">
            View Call Girls
            <span className="text-lg">›</span>
          </button>

        </div>
      </div>
    </div>
  );
}