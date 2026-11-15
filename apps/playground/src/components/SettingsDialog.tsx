import {Dialog} from "./Dialog.tsx";

export const SettingsDialog = ({open, on_closed}: { open: boolean, on_closed: () => void }) => {
    return (
        <Dialog title="Settings" open={open} on_closed={on_closed}>
            TODO
        </Dialog>
    );
}
