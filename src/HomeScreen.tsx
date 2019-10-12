// @ts-ignore
import React from "react";
import {View, Text} from "react-native";
import {useFocusEffect, useFocusState, useNavigation, useNavigationState} from "react-navigation-hooks";
import {useRefocusEffect} from "./use-refocus-effect";

export const HomeScreen = () => {
    const {navigate} = useNavigation();
    // const state = useFocusState();
    // console.log(state);
    //
    // useFocusEffect(() => {
    //     console.log("focus");
    // });
    useRefocusEffect(() => {
        console.log("refocus");
    });

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => {
                navigate("Detail")
            }}>Home Screen</Text>
        </View>
    );
};
