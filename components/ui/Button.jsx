"use client";

export default function Button({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-disabled={loading || disabled}
      className={`w-full cursor-pointer rounded-md py-3 text-sm font-semibold tracking-widest transition
        flex items-center justify-center gap-2 text-white
        ${
          loading || disabled
            ? "bg-orange-600/70 cursor-not-allowed"
            : "bg-orange-600 hover:bg-[#c84312]"
        }
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
