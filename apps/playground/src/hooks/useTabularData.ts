import {type RefObject, useCallback, useRef, useState} from "react";

export interface TabularData<RowData> {
    n_rows: number;
    row_data: RefObject<RowData[]>;

    add_row: (row: RowData) => void;
    remove_row: (index: number) => void;

    clear_rows: () => void;
    set_rows: (rows: RowData[]) => void;
}

export const useTabularData = <RowData>(init_data: RowData[] = []): TabularData<RowData> => {
    // state only tracks count to trigger re-render and quickly get size, storing the whole table in state is inefficient
    const [n_rows, setNRows] = useState(init_data.length);
    const row_data = useRef<RowData[]>(init_data);

    const add_row = useCallback(
        (row: RowData) => {
            row_data.current.push(row);
            setNRows(row_data.current.length);
        },
        []
    );

    const remove_row = useCallback(
        (index: number) => {
            row_data.current.splice(index, 1);
            setNRows(row_data.current.length);
        },
        []
    );

    const clear_rows = useCallback(
        () => {
            row_data.current = [];
            setNRows(0);
        },
        []
    );

    const set_rows = useCallback(
        (rows: RowData[]) => {
            row_data.current = rows;
            setNRows(rows.length);
        },
        []
    );

    return {
        n_rows,
        row_data,

        add_row,
        remove_row,

        clear_rows,
        set_rows
    }
}
