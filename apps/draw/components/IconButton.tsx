import { ReactNode } from "react";

export function IconButton({
    icon, onClick
}: {
    icon: ReactNode,
    onClick: () => void
}) {
    return <div className="cursor-pointer p-2 text-white hover:bg-[#403E6A] rounded transition duration-200" onClick={onClick}>
        {icon}
    </div>
}