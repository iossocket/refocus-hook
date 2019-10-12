项目基于React Native 0.60+，完全使用React Hooks。

### 前言
首先介绍一下想要解决的问题，当离开某页面再次回来时触发一个事件，离开的方式包括switch tab 和 navigate.

### 使用useFocusState存在的问题
首先想到的应该就是使用useFocusState来解决问题（在新的release中已经将这个API定义为弃用了，也有相应的取代API）。使用方式如下所示：
```
export const HomeScreen = () => {
    const {navigate} = useNavigation();
    const focusState = useFocusState();
    console.log(focusState);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => {
                navigate("Detail")
            }}>Home Screen</Text>
        </View>
    );
};
```
当该Screen是渲染的首页面时，这个`focusState`将发生多次变更，如下图所示。想要实现需求需要添加额外的Flag，极大的降低了代码的可读性。

![focusState状态变更](https://upload-images.jianshu.io/upload_images/19765376-6968a8f9212afe60.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

### 使用useFocusEffect存在的问题
这个API最近期release的，它的表现就稳定了很多，使用方法如下：
```
export const HomeScreen = () => {
    const {navigate} = useNavigation();
    useFocusEffect(() => {
        console.log("focus");
    });
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text onPress={() => {
                navigate("Detail")
            }}>Home Screen</Text>
        </View>
    );
};
```
使用这个effect，当首次渲染，以及从其他页面回到该页面时都会触发callback。看一下需求，*离开该页面，再次回到该页面时，触发一个事件*。当然是要在加一个useState，判断是否为首次加载，即可解决。问题又来了，应该在什么时刻来更改这个state呢？当加入flag，可读性和可维护性都将降低。

### 如何通过自定义Hook来解决 
自己动手，丰衣足食。手动撸一段代码，我们需要的是状态变更时触发，要记录状态，自然想到了`useReducer`，通过监听`isBlurred`的变更，触发事件，`dispatch`给`reducer`，`reducer`根据本次状态和上次状态判读是否调用`callback`。代码如下所示：
```
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
```
使用方法也很简单：
```
export const HomeScreen = () => {
    const {navigate} = useNavigation();
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
```
