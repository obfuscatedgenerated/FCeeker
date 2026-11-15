import {Dialog} from "./Dialog.tsx";
import {useSettings} from "../contexts/SettingsContext.tsx";

export const SettingsDialog = ({open, on_closed}: { open: boolean, on_closed: () => void }) => {
    const {settings} = useSettings();

    return (
        <Dialog title="Settings" open={open} on_closed={on_closed}>
            TODO

            {JSON.stringify(settings, null, 2)}
        </Dialog>
    );
}
