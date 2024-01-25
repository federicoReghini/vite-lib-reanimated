import { FlatList, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const Simple = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#333" }}>
      <TouchableOpacity onPress={() => console.log("here")}>
        <Text style={{ color: "#fff" }}>Simple</Text>
      </TouchableOpacity>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={({ item }) => <Text style={{ color: "#fff" }}>{item}</Text>}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};
