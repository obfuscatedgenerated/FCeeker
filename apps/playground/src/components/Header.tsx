export const Header = () => {
    return (
        <header className="p-3 bg-sky-950 h-16 flex items-center gap-4">
            <img src="/fceeker.svg" className="h-full" draggable={false} />

            <h1 className="font-title font-bold text-xl sm:text-3xl text-white">FCeeker Playground</h1>
        </header>
    );
}
