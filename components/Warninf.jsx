export default function WarningAlert() {
    return (
      <div className="bg-[#5c1212] border-2 border-red-500 rounded-xl p-5 flex items-center gap-4 max-w-xl mb-3">
        
        {/* Icon */}
        <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
          !
        </div>
  
        {/* Text */}
        <div>
          <p className="text-red-400 text-md font-semibold">
            Never pay advance!
          </p>
          <p className="text-red-200 text-sm">
            Pay only cash after meeting.
          </p>
        </div>
  
      </div>
    );
  }