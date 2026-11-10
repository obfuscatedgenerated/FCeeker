import {Eye, X} from "lucide-react";

export const StatusWidget = () => {
    return (
        <div className=" absolute bottom-7 left-1/2 -translate-x-1/2 bg-base-100 rounded-3xl w-100 h-15 px-3 py-1 flex items-center justify-between">
            Running...

            <span>
                XX%
            </span>

            <span>
                X found
            </span>

            <div className="flex gap-1">
                <button className="flex items-center justify-center cursor-pointer">
                    <Eye />
                </button>

                <button className="flex items-center justify-center cursor-pointer text-error">
                    <X />
                </button>
            </div>
        </div>
    );
}
