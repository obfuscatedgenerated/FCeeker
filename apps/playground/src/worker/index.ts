import type {WorkerRequestMesssageEvent, WorkerResponseMessage} from "./message_types.ts";
import {execute} from "@fceeker/core";

const send = (message: WorkerResponseMessage) => self.postMessage(message);

let exec_id_counter = 0;

const TICK_FLUSH_MS = 50;
const RESULT_FLUSH_MS = 100;

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

    let progress_tick_batch = 0;
    let last_tick_flush = performance.now();

    const flush_ticks = () => {
        send({
            type: "progress_tick",
            exec_id,
            count: progress_tick_batch
        });

        progress_tick_batch = 0;
        last_tick_flush = performance.now();
    }

    let result_batch: ReadonlyMap<string, string>[] = [];
    let last_result_flush = performance.now();

    const flush_results = () => {
        send({
            type: "result_batch",
            exec_id,
            rows: result_batch
        });

        result_batch = [];
        last_result_flush = performance.now();
    }

    const evaluate_flushes = () => {
        const now = performance.now();

        if (now - last_tick_flush >= TICK_FLUSH_MS) {
            flush_ticks();
        }

        if (now - last_result_flush >= RESULT_FLUSH_MS) {
            flush_results();
        }
    }

    try {
        const result = execute(message.ast, message.input_word, {
            progress_start: (total) => send({
                type: "progress_start",
                exec_id,
                total
            }),
            progress_tick: (count) => {
                progress_tick_batch += count || 1;
                evaluate_flushes();
            },
            on_found: (assignments) => {
                result_batch.push(assignments);
                evaluate_flushes();
            }
        });

        flush_ticks();
        flush_results();

        send({
            type: "finished",
            exec_id,
            result
        });
    } catch (err) {
        flush_ticks();
        flush_results();

        send({
            type: "error",
            exec_id,
            message: err instanceof Error ? err.message : String(err)
        });
    }
});
