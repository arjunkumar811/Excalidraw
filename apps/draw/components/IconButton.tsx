import { ReactNode } from "react";

export function IconButton({
    icon,
    onClick,
    activated
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return (
        <div 
            className={`cursor-pointer p-2 rounded transition duration-200 hover:bg-[#403E6A] ${activated ? "text-red-500" : "text-white"}`} 
            onClick={onClick}
        >
            {icon}
        </div>
    );
}
