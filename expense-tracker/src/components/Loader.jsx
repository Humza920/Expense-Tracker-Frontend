export default function Loader({ message = "Loading...", bg }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-4"
      style={{ backgroundColor: bg}}
    >
      <div className="relative w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-t-pink-400 border-pink-200/40 rounded-full animate-spin" />

        {/* Inner bouncing dots */}
        <div className="absolute inset-0 flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:120ms]" />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:240ms]" />
        </div>
      </div>

      <p className="mt-6 text-pink-300 font-semibold text-lg animate-pulse text-center">
        {message}
      </p>
      <p className="mt-2 text-xs text-slate-400 tracking-wide uppercase">
        Please wait a moment
      </p>
    </div>
  );
}
