import {useState} from "react";

export const InputWordControls = () => {
    const [is_file, setIsFile] = useState(false);

    // TODO: store textarea statefully
    // TODO: store file upload content via filereader as ref
    // TODO: expose handle or some context/zustand writing that lets the execution pull the value lazily

    return (
        <fieldset className="fieldset">
            <div className="flex items-center justify-between">
                <legend className="fieldset-legend font-title text-lg">Input word</legend>

                <div className="flex items-center justify-between gap-2">
                    <label className="label">
                        <input
                            type="radio"
                            name="input-word-type"
                            value="text"
                            className="radio radio-sm"
                            checked={!is_file}
                            onChange={() => setIsFile(false)}
                        />

                        Text
                    </label>

                    <label className="label">
                        <input
                            type="radio"
                            name="input-word-type"
                            value="file"
                            className="radio radio-sm"
                            checked={is_file}
                            onChange={() => setIsFile(true)}
                        />

                        File
                    </label>
                </div>
            </div>

            {is_file ? (
                <input type="file" className="file-input w-full" />
            ) : (
                <textarea
                    className="resize-none textarea w-full"
                />
            )}
        </fieldset>
    )
}
