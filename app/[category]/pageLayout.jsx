import Breadcrumb from "@/components/ui/Breadcurm";





export default function PageLayout({title, description}){

    return (
     <>
     <Breadcrumb />
        <div className="min-h-screen bg-gradient-to-b ">
    
          {/*  HERO 30vh */}
          <div
  className="h-[30vh] flex items-center justify-center border-t border-b border-(--primary-color)"
  style={{
    borderBottomWidth: "3px",
  }}
>
    
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-(--second-color) text-center px-4">
              {title}
            </h1>
    
          </div>
    
          {/*  DESCRIPTION */}
          <div className="mx-5 md:container md:mx-auto px-5 sm:px-8 py-12">
    
            {/* <div
              className="prose prose-invert max-w-none text-gray-300 leading-8"
              dangerouslySetInnerHTML={{
                __html:description ?? ""
              }}
            /> */}
             <div
  className="bg-(--webiste-text) text-(--text-color) border border-(--primary-color) my-10 p-10 rounded-xl prose max-w-none overflow-hidden break-words"
  dangerouslySetInnerHTML={{ __html: description ?? "" }}
  style={{
    borderWidth : "5px"
  }}
/>
    
    
          </div>
    
        </div>
        </>
      )

    
}