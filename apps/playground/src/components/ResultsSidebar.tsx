import {Scrim} from "./Scrim.tsx";

interface ResultsSidebarProps {
    visible: boolean;
}

export const ResultsSidebar = ({
    visible
}: ResultsSidebarProps) => {
    return (
        <>
            <Scrim className={`z-50 transition-opacity ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`} />
            <aside className={`z-100 bg-base-200 fixed top-0 right-0 w-1/3 h-full p-3 transition-transform ${visible ? "" : "translate-x-full"}`}>
                <h2 className="font-title font-semibold text-2xl">Results</h2>
            </aside>
        </>
    )
}
