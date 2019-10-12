import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from "react-navigation";
import {HomeScreen} from "./HomeScreen";
import {DetailScreen} from "./DetailScreen";

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Detail: DetailScreen
}, {
    initialRouteName: "Home"
});

export default createAppContainer(AppNavigator);
