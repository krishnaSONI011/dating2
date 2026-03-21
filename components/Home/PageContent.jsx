'use client'

export default function PageContent({html}){

  

  return(
    <div className="px-5 md:px-20 mt-10 ">
     <div
  className="bg-(--webiste-text) text-(--text-color) border border-(--primary-color) my-10 p-10 rounded-xl prose max-w-none overflow-hidden break-words"
  dangerouslySetInnerHTML={{ __html: html }}
/>
    </div>
  )
}