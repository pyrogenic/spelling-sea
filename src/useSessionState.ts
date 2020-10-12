import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import _ from "lodash";

export default function useSessionState<T extends undefined | number | string | boolean | {}>(
    keys: Array<string | undefined>, init: T | (() => T)):
    [T, Dispatch<SetStateAction<T>>, () => void] {
    const key = _.compact(keys).join("/");
    const [state, setState] = useState<T>(init);
    const ready = useRef({key: ""});
    function reinit() {
        let val: T | undefined = undefined;
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue !== null) {
            try {
                val = JSON.parse(sessionValue);
            } catch (error) {
                console.error(error);
            }
        }
        if (val === undefined) {
            if (typeof init === "function") {
                val = init();
            } else {
                val = init;
            }
        }
        // if (!_.isEqual(val, state)) {
        setState(val!);
        ready.current.key = key;
        // }
    }
    useEffect(() => sessionStorage.setItem(ready.current.key, JSON.stringify(state)), [key, state]);
    return [state, setState, reinit];
}
