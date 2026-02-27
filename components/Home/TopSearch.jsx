
import { Poppins } from "next/font/google";

const poppins = Poppins({
    
  subsets: ["latin"],
  weight : [ "600"]
})
export default function TopSearches({name}) {

    const searches = [
        "call girl in Indore",
        "call girl in Jaipur",
        "call girl in Delhi",
        "call girl in Mumbai",
        "call girl in Bangalore",
        "call girl in Pune",
        "call girl in Ahmedabad",
        "call girl in Bhopal",
        "call girl in Noida",
        "call girl in Gurugram",
        "call girl in Chandigarh",
        "call girl in Kolkata",
        "call girl in Chennai",
        "call girl in Hyderabad",
        "call girl in Surat",
        "call girl in Vadodara",
        "call girl in Udaipur",
        "call girl in Jodhpur"
      ]
      
  
    return (
      <section className=" py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
  
          {/* Heading */}
          <h2 className={`mb-8 sm:mb-12 md:mb-14 text-center font-serif text-2xl sm:text-3xl md:text-4xl lg:text-3xl text-orange-200 font-bold px-2  ${poppins.className}`}>
          Top Search 
        </h2>
  
          {/* Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {searches.map((item, index) => (
              <span
                key={index}
                className="rounded-lg sm:rounded-xl hover:bg-orange-600 hover:scale-110 bg-orange-600/70 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white transition cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
  
        </div>
      </section>
    );
  }
  