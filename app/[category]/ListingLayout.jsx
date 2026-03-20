import PageContent from "@/components/Home/PageContent";
import CardShower from "@/components/search/CardSower";
import PopularArea from "@/components/search/PopularArea";
import Alert from "@/components/ui/Alert";
import Breadcrumb from "@/components/ui/Breadcurm";




export default function ListingLayout({slug , list , currentPage , setCurrentPage , totalPages , city , htmlContent , is_category}){
     return (
        <div>
     <Breadcrumb />
          
         
          <div className=" mx-2 md:mx-20">
            <div className="mt-10">
            <Alert />
            </div>
            
            
        
          <div className=" grid grid-cols-1 md:grid-cols-4  ">
          <div className="col-span-3">
          <CardShower
            slug={slug}
            items={list}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
          </div>
          <div className="hidden md:block mx-5 mt-10">
          <PopularArea areas={city} slug={slug} is_category={is_category}/>
          </div>
          
          </div>
          <div>
             <PageContent html={htmlContent}/>
          </div>
          </div>
    
        </div>
      )
}