import type {WorkerRequestMesssageEvent, WorkerResponseMessage} from "./message_types.ts";
import {execute} from "@fceeker/core";

const send = (message: WorkerResponseMessage) => self.postMessage(message);

let exec_id_counter = 0;

self.addEventListener("message", (e: WorkerRequestMesssageEvent) => {
    const message = e.data;

    if (message.type !== "execute") {
        send({
            type: "error",
            message: "Unknown message type"
        });

        return;
    }

    const exec_id = ++exec_id_counter;

    try {
        const result = execute(message.ast, message.input_word, {
            progress_start: (total) => send({
                type: "progress_start",
                exec_id,
                total
            }),
            // TODO: tick batching
            progress_tick: (count) => send({
                type: "progress_tick",
                exec_id,
                count
            }),
            // TODO: result batching
            on_found: (assignments) => send({
                type: "result_batch",
                exec_id,
                rows: [assignments]
            })
        });

        send({
            type: "finished",
            exec_id,
            result
        });
    } catch (err) {
        send({
            type: "error",
            exec_id,
            message: err instanceof Error ? err.message : String(err)
        });
    }
});
