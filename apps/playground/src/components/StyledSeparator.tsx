import {Ellipsis} from "lucide-react";
import {Separator} from "react-resizable-panels";

export const StyledSeparator = ({vertical = false}: {vertical?: boolean}) => (
    <Separator className="bg-base-300 flex items-center justify-center hover:bg-base-200 transition-colors">
        <Ellipsis className={vertical ? "rotate-90" : ""} />
    </Separator>
);
