// @ts-ignore
import React from "react";
import {View, Text} from "react-native";
import {useNavigation} from "react-navigation-hooks";

export const HomeScreen = () => {
    const {navigate} = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => {
                navigate("Detail")
            }}>Home Screen</Text>
        </View>
    );
};
