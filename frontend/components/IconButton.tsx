import { ReactNode, useState } from "react";

export function IconButton({
  icon,
  onClick,
  activated,
  tooltip,
}: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center justify-center group">
      <button
        className={`p-2 rounded-xl transition-all duration-150 ease-out flex items-center justify-center ${
          activated
            ? "bg-violet-100 text-violet-700 shadow-sm scale-105"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
        }`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon}
      </button>

      {tooltip && showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-[11px] font-medium tracking-wide rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          {tooltip}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-transparent border-b-slate-800"></div>
        </div>
      )}
    </div>
  );
}
