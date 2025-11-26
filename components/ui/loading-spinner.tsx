export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#23527c] animate-spin" />
      </div>
    </div>
  );
}

export function LoadingSpinnerSmall() {
  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-[#23527c] animate-spin" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#23527c] animate-spin" />
        </div>
        <p
          className="mt-4 text-gray-600"
          style={{ fontFamily: "var(--font-proba)" }}
        >
          Завантаження...
        </p>
      </div>
    </div>
  );
}

