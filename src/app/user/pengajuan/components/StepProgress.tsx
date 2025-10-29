export default function StepProgress({
  steps,
  step,
}: {
  steps: string[];
  step: number;
}) {
  return (
    <div className="flex justify-center w-full mb-12">
      <div className="flex justify-between items-center max-w-2xl w-full">
        {steps.map((label, i) => {
          const isActive = i === step;
          const isCompleted = i < step;

          return (
            <div key={i} className="flex items-center w-full">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border-2 transition-all
                  ${
                    isActive
                      ? "bg-bni-orange text-white border-bni-orange scale-110 shadow-md"
                      : isCompleted
                      ? "bg-bni-orange text-white border-bni-orange"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }
                `}
              >
                {i + 1}
              </div>

              <span
                className={`ml-2 whitespace-nowrap text-xs md:text-sm font-semibold transition
                  ${isActive || isCompleted ? "text-gray-900" : "text-gray-400"}
                `}
              >
                {label}
              </span>

              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors
                    ${isCompleted ? "bg-bni-orange" : "bg-gray-300"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
