




export default function PageLayout({title, description}){

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
    
          {/*  HERO 30vh */}
          <div className="h-[30vh] flex items-center justify-center bg-[#0b1220] border-b border-slate-700">
    
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-400 text-center px-4">
              {title}
            </h1>
    
          </div>
    
          {/*  DESCRIPTION */}
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
    
            {/* <div
              className="prose prose-invert max-w-none text-gray-300 leading-8"
              dangerouslySetInnerHTML={{
                __html:description ?? ""
              }}
            /> */}
             <div
  className="bg-(--webiste-text) text-(--text-color) border border-(--primary-color) my-10 p-10 rounded-xl prose max-w-none overflow-hidden break-words"
  dangerouslySetInnerHTML={{ __html: description ?? "" }}
/>
    
    
          </div>
    
        </div>
      )
}