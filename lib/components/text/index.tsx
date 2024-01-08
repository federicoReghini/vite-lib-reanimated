import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function Text({ message }: { message: string }) {
  return (
    <Animated.Text entering={FadeIn} exiting={FadeOut}>
      {message}
    </Animated.Text>
  );
}
