import { FC, Ref, useEffect, useRef, useState } from "react";

// -- COMPONENTS
import {
  DeviceEventEmitter,
  Dimensions,
  EmitterSubscription,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// -- TYPES
export interface ToastProps {
  message: string;
  status?: string;
  duration?: number;
}

interface ToastPropsWithType extends ToastProps {
  type: "success" | "error" | "warning";
}

export const ToastProvider: FC = () => {
  // # STATE
  const [listToast, setListToast] = useState<ToastProps[]>([]);

  // # REFS
  const emitterRef = useRef<EmitterSubscription | null>(null);
  const toastListRef = useRef(null);

  // SIDE EFFECTS
  useEffect(() => {
    // LISTENER
    emitterRef.current = DeviceEventEmitter.addListener(
      "showToast",
      onListenerToast,
    );
  }, []);

  // # FUNCTIONS
  async function onListenerToast(options: ToastProps) {
    setListToast((prev) => [...prev, options]);
  }

  const onRemoveToast = (index: number) => () => {
    setListToast((prev) => prev.filter((_, i) => i !== index));
  };

  const resetList = () => {
    setListToast([]);
  };

  return listToast.length > 0 ? (
    <View
      style={{
        position: "absolute",
        top: 50,
        zIndex: 999,
      }}
    >
      <ToastList
        toastListRef={toastListRef}
        listToast={listToast}
        onCloseToast={onRemoveToast}
        resetList={resetList}
      />
    </View>
  ) : (
    <></>
  );
};

// # COMPONENTS TOAST LIST
interface ToastListProps {
  listToast: ToastProps[];
  onCloseToast: (index: number) => void;
  resetList: (event?: GestureResponderEvent) => void;
  toastListRef: Ref<FlatList>;
}

const ToastList: FC<ToastListProps> = ({
  listToast,
  onCloseToast,
  resetList,
  toastListRef,
}) => {
  const length = listToast.length;

  return (
    <FlatList
      ref={toastListRef}
      data={listToast}
      horizontal
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.scrollView}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => {
        return (
          <ToastUi
            key={index}
            {...item}
            position={`${index + 1}/${length}`}
            onCloseToast={onCloseToast(index)}
            resetList={resetList}
          />
        );
      }}
    />
  );
};

interface ToastUiProps extends ToastPropsWithType {
  onCloseToast: () => void;
  resetList: (event?: GestureResponderEvent) => void;
  position: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// # COMPONENT TOAST UI
export const ToastUi: FC<ToastUiProps> = ({
  message,
  status,
  duration,
  onCloseToast,
  position,
}) => {
  // # STATES
  const [expanded, setExpanded] = useState(false);

  // # HOOKS

  // # ANIMATIONS
  const minHeight = useSharedValue(55);

  // # STYLES
  const expandedTextStyle = useAnimatedStyle(() => ({
    opacity: withSpring(expanded ? 1 : 0, { duration: 1000 }),
    display: withSpring(expanded ? "flex" : "none", { duration: 1000 }),
  }));

  const FadeInUp = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 700 }),
    transform: [
      {
        translateY: withTiming(0, { duration: 700 }),
      },
    ],
  }));

  /*const FadeOutUp = useAnimatedStyle(() => ({
    opacity: withTiming(0, { duration: 700 }),
    transform: [
      {
        translateY: withTiming(-100, { duration: 700 }),
      },
    ],
  }));*/

  // SIDE EFFECTS
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (duration) {
      timeout = setTimeout(() => {
        onCloseToast();
      }, duration);
    }

    return () => clearTimeout(timeout);
  }, []);

  // # FUNCTIONS
  const toggleExpand = () => {
    minHeight.value = withTiming(expanded ? 55 : 100, { duration: 700 }, () => {
      if (!expanded) runOnJS(setExpandedAnimation)();
    });
    if (expanded) setExpandedAnimation();
  };

  function setExpandedAnimation() {
    setExpanded((prev) => !prev);
  }

  const onCopy = (message: string) => async () => {
    console.log(message);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: "red", minHeight: minHeight.value },
        FadeInUp,
      ]}
    >
      <View style={styles.toast}>
        {/* STATUS */}
        <Pressable onPress={onCopy(message)} style={styles.message}>
          <Text numberOfLines={1} ellipsizeMode={"tail"} style={[styles.text]}>
            {status ?? message}
          </Text>
        </Pressable>

        {/* ARROWS ICONS */}
        <AnimatedPressable onPress={toggleExpand}>
          <Text style={[styles.text, styles.arrow]}>
            {expanded ? "🔽" : "🔼"}
          </Text>
        </AnimatedPressable>
      </View>

      {position !== "1/1" && (
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={[styles.text, styles.index]}
        >
          {position}
        </Text>
      )}

      {expanded && (
        <AnimatedPressable
          onPress={onCopy(message)}
          style={[
            styles.message,
            { width: "90%", paddingLeft: 5 },
            expandedTextStyle,
          ]}
        >
          <Text
            style={[styles.text, styles.expanded]}
            numberOfLines={3}
            ellipsizeMode={"tail"}
          >
            {message}
          </Text>
        </AnimatedPressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 10,
    marginHorizontal: 5,
    borderRadius: 10,
    padding: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: 55,
  },
  scrollView: {
    columnGap: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  message: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  text: {
    color: "white",
  },
  expanded: {
    marginTop: 10,
    width: "90%",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  arrow: {
    position: "absolute",
    top: 0,
    right: 5,
  },
  index: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});
