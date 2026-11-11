import type {FormulaNode} from "@fceeker/ast";
import type {QueryResult} from "@fceeker/core";

interface MessageBase {
    type: string;
}

export interface ExecuteMessage extends MessageBase {
    type: "execute";
    ast: FormulaNode;
    input_word: string;
}

export type WorkerRequestMessage = ExecuteMessage;
export type WorkerRequestMesssageEvent = MessageEvent<WorkerRequestMessage>;

export interface ProgressStartMessage extends MessageBase {
    type: "progress_start";
    exec_id: number;
    total: number;
}

export interface ProgressTickMessage extends MessageBase {
    type: "progress_tick";
    exec_id: number;
    count?: number;
}

export interface ResultBatchMessage extends MessageBase {
    type: "result_batch";
    exec_id: number;
    rows: ReadonlyMap<string, string>[];
}

export interface ExecutionFinishedMessage extends MessageBase {
    type: "finished";
    exec_id: number;
    result: QueryResult;
}

export interface ErrorMessage extends MessageBase {
    type: "error";
    exec_id?: number;
    message: string;
}

export type WorkerResponseMessage =
    ProgressStartMessage |
    ProgressTickMessage |
    ResultBatchMessage |
    ExecutionFinishedMessage |
    ErrorMessage;
export type WorkerResponseMessageEvent = MessageEvent<WorkerResponseMessage>;
