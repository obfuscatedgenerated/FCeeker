import parse from "@fceeker/parser-antlr";
import type {FormulaNode} from "@fceeker/ast";
import type {ExecuteOpts, QueryResult} from "@fceeker/core";
import type {WorkerRequestMessage, WorkerResponseMessageEvent} from "../worker/message_types.ts";

export const parse_fc = (fc_contents: string) => {
    const parsed = parse(fc_contents);

    if (!parsed.success) {
        for (const error of parsed.errors) {
            console.error(`- ${error.kind}: ${error.message}${error.span ? ` (indices ${error.span?.start}-${error.span?.end})` : ""}`);
        }
    }

    return parsed;
}

// promise based wrapper that invokes the procedure calls in the worker, then resolves with the result (with the same signature as pure execute)
// TODO: abortsignal for early cancel
export const execute_fc_in_worker = async (ast: FormulaNode, input_word: string, opts: ExecuteOpts & {abort_signal?: AbortSignal} = {}): Promise<QueryResult> => {
    const url = new URL("../worker", import.meta.url);
    const worker = new Worker(url, {type: "module"});

    const send = (message: WorkerRequestMessage) => worker.postMessage(message);

    return new Promise((resolve, reject) => {
        if (opts.abort_signal) {
            opts.abort_signal.addEventListener("abort", () => {
                worker.terminate();
                reject("Cancelled");
            });
        }

        worker.addEventListener("message", (e: WorkerResponseMessageEvent) => {
            const message = e.data;

            switch (message.type) {
                case "error":
                    worker.terminate();
                    reject(message.message);
                    break;
                case "progress_start":
                    if (opts.progress_start) {
                        opts.progress_start(message.total);
                    }
                    break;
                case "progress_tick":
                    if (opts.progress_tick) {
                        opts.progress_tick(message.count);
                    }
                    break;
                case "result_batch":
                    // TODO: support batched output, for now assuming just one as thats all is sent
                    if (opts.on_found) {
                        opts.on_found(message.rows[0]!);
                    }
                    break;
                case "finished":
                    worker.terminate();
                    resolve(message.result);
                    break;
            }
        });

        send({
            type: "execute",
            ast,
            input_word
        });
    });
}
