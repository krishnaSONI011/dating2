'use client'

export default function PageContent({html}){

  

  return(
    <div className="px-0 md:px-20 mt-10 ">
     <div
  className="bg-[#1f2937] border border-orange-300 my-10 p-10 rounded-xl prose max-w-none overflow-hidden break-words"
  dangerouslySetInnerHTML={{ __html: html }}
/>
    </div>
  )
}