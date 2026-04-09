'use client'

export default function PageContent({html}){

  

  return(
    <div className="px-5 mx-1 md:max-w-7xl md:mx-auto mt-10 ">
     <div
  className="bg-(--webiste-text) text-(--text-color) border-2 border-(--primary-color) my-10 p-10 rounded-xl prose max-w-none overflow-hidden break-words"
  dangerouslySetInnerHTML={{ __html: html }}
  style={{
    borderWidth: '5px '
  }}
/>
    </div>
  )
}