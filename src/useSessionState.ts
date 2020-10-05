import {useEffect, useRef, useState} from "react";

export default function useSessionState<T>(key: string, init: T | (()=>T)) {
    const once = useRef({firstRun: true});
    if (once.current.firstRun) {
        once.current.firstRun = false;
        const sessionValue = sessionStorage.getItem(key);
        if (sessionValue !== null) {
            try {
                init = JSON.parse(sessionValue);
            } catch (error) {
                console.error(error);
            }            
        }
    }
    const result = useState<T>(init);
    const state = result[0];
    useEffect(() => sessionStorage.setItem(key, JSON.stringify(state)), [key, state]);
    return result;
}
