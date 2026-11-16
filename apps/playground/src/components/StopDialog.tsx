import {Dialog} from "./Dialog.tsx";

export const StopDialog = ({
    open,
    on_dismiss,
    on_confirmed
}: {
    open: boolean;
    on_dismiss: () => void;
    on_confirmed: () => void;
}) => (
    <Dialog title="Are you sure you want to stop the query?" open={open} on_closed={on_dismiss} needs_action className="sm:max-w-md">
        <div className="flex flex-col gap-10">
            <p className="text-sm text-gray-500">
                You will not be able to resume it later.
            </p>

            <div className="flex justify-end gap-2">
                <button className="btn" onClick={on_dismiss}>Keep running</button>
                <button className="btn btn-error" onClick={on_confirmed}>Stop</button>
            </div>
        </div>
    </Dialog>
);
