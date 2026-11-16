import {X} from "lucide-react";
import {useEffect, useRef} from "react";

interface DialogProps {
    title?: string;
    children: React.ReactNode;
    open: boolean;
    on_closed: () => void;
    className?: string;
    needs_action?: boolean;
}

export const Dialog = ({
    title,
    children,
    open,
    on_closed,
    className = "",
    needs_action = false
}: DialogProps) => {
    const dialog_ref = useRef<HTMLDialogElement | null>(null);

    // sync showmodal with open prop
    useEffect(() => {
        const dialog = dialog_ref.current;
        if (!dialog) {
            return;
        }

        if (open) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog className="modal" ref={dialog_ref} onClose={on_closed} onCancel={!needs_action && on_closed}>
            <div className={`modal-box max-w-[95vw] sm:max-w-2xl w-full ${className}`}>
                <div className="flex items-center justify-between gap-4 mb-4">
                    {title && <h3 className="font-bold text-xl">{title}</h3>}
                    {!needs_action && (
                        <form method="dialog">
                            <button className="cursor-pointer"><X /></button>
                        </form>
                    )}
                </div>

                {children}
            </div>
            {!needs_action ? (
                <form method="dialog" className="modal-backdrop">
                    <button>(close dialog)</button>
                </form>
            ) : (
                <div className="modal-backdrop" />
            )}
        </dialog>
    );
}
