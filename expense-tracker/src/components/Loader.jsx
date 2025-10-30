export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-t-pink-400 border-pink-200 rounded-full animate-spin"></div>

        {/* Inner bouncing dots */}
        <div className="absolute inset-0 flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-300"></div>
          <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-450"></div>
        </div>
      </div>

      <p className="absolute bottom-20 text-pink-400 font-semibold text-lg animate-pulse">
        Loading...
      </p>
    </div>
  );
}
