import {createContext, useCallback, useContext, useEffect, useState} from "react";

const default_settings = {
    auto_open_results: true as boolean,
    replace_with_unicode: true as boolean,
} as const;

export type Settings = typeof default_settings;
export type SettingKey = keyof Settings;


export const setting_category_names = ["Execution", "Input"] as const;
export type SettingCategory = typeof setting_category_names[number];

export type SettingWidget = "toggle";

export interface SettingPresentation {
    category: SettingCategory;
    label: string;
    description: string;
    widget: SettingWidget;
}

export const setting_presentations: Record<SettingKey, SettingPresentation> = {
    auto_open_results: {
        category: "Execution",
        label: "Auto-open results",
        description: "Automatically open the results panel when a query is executed.",
        widget: "toggle",
    },
    replace_with_unicode: {
        category: "Input",
        label: "Auto-formalise",
        description: "Automatically replace ASCII and keyword forms of symbols with their formal Unicode equivalents in the query input.",
        widget: "toggle",
    },
} as const;

export const setting_categories = setting_category_names.map(category => ({
    name: category,
    keys: (Object.keys(setting_presentations) as SettingKey[])
        .filter(key => setting_presentations[key].category === category),
}));

interface SettingsContextType {
    settings: Settings;
    update_settings: (new_settings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({children}: {children: React.ReactNode}) => {
    const [settings, setSettings] = useState<Settings>(default_settings);

    // load from localStorage on mount
    useEffect(() => {
        const stored_settings = localStorage.getItem("settings");
        if (stored_settings) {
            try {
                const parsed = JSON.parse(stored_settings);
                setSettings((prev) => ({...prev, ...parsed}));
            } catch (e) {
                console.error("Failed to parse settings from localStorage", e);
            }
        }
    }, []);

    const update_settings = useCallback(
        (new_settings: Partial<Settings>) => {
            setSettings((prev) => ({...prev, ...new_settings}));
            localStorage.setItem("settings", JSON.stringify({...settings, ...new_settings}));
        },
        []
    );

    return (
        <SettingsContext.Provider value={{settings, update_settings}}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}

export const useSetting = <K extends SettingKey>(key: K) => {
    const {settings, update_settings} = useSettings();

    const value = settings[key];

    const setValue = useCallback(
        (new_value: Settings[K]) => {
            update_settings({[key]: new_value});
        },
        [key, update_settings]
    );

    return [value, setValue] as const;
}
