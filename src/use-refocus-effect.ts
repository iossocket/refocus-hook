import { useFocusState } from "react-navigation-hooks";
import { useEffect, useReducer } from "react";

interface State {
    disappeared: boolean;
}

interface Action {
    type: string;
    payload: {
        disappeared: boolean;
    };
}

export const useRefocusEffect = (onRefocus: () => void): void => {

    const reducer = (previousState: State, action: Action): State => {
        if (action.type === "refresh") {
            if (previousState.disappeared && !action.payload.disappeared) {
                onRefocus();
            }
            return { disappeared: action.payload.disappeared };
        }
        return { ...previousState };
    };

    const { isBlurred } = useFocusState();

    const [ , dispatch ] = useReducer(reducer, { disappeared: isBlurred });

    useEffect(() => {
        dispatch({ type: "refresh", payload: { disappeared: isBlurred } });
    }, [ isBlurred ]);

};
