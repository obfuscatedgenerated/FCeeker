import {useEffect, useState} from "react";

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState<boolean>(window.matchMedia(query).matches);

    useEffect(() => {
        const list = window.matchMedia(query);

        const handle_change = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        setMatches(list.matches);
        list.addEventListener("change", handle_change);

        return () => {
            list.removeEventListener("change", handle_change);
        };
    }, [query]);

    return matches;
}
