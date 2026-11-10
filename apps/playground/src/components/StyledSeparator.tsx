import {Ellipsis} from "lucide-react";
import {Separator} from "react-resizable-panels";

export const StyledSeparator = ({vertical = false}: {vertical?: boolean}) => (
    <Separator title={`Drag to resize panel ${vertical ? "horizontally" : "vertically"}`} className={`group ${vertical ? "w-3 hover:w-5" : "h-2 hover:h-8"} bg-base-300 flex items-center justify-center hover:bg-base-200 transition-[width,height,background-color]`}>
        <Ellipsis className={`opacity-25 group-hover:opacity-100 transition-opacity ${vertical ? "rotate-90" : ""}`} />
    </Separator>
);
