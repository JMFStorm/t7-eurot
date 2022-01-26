import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  View,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const baseUrl = "http://api.exchangeratesapi.io/v1/latest";
const accessKey = "";

const fetchExhange = async () => {
  try {
    const params = `?access_key=${accessKey}`;
    const response = await fetch(baseUrl + params);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function App() {
  const [picked, setPicked] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [result, setResult] = React.useState("");
  const [exhangesLabels, setExhangesLabels] = React.useState([]);

  const amountRef = React.useRef("");
  const pickedRef = React.useRef("");
  const exhangesData = React.useRef([]);

  React.useEffect(() => {
    const doFetch = async () => {
      const exhanges = await fetchExhange();

      setExhangesLabels(Object.keys(exhanges.rates));
      exhangesData.current = exhanges.rates;
    };
    doFetch();
  }, [fetchExhange, exhangesData, setExhangesLabels]);

  const convertMoney = React.useCallback(() => {
    for (const [key, value] of Object.entries(exhangesData.current)) {
      if (key == pickedRef.current) {
        const calculated = Number(amountRef.current) * Number(value);
        setResult(calculated);
      }
    }
  }, [exhangesData, setResult]);

  if (!exhangesLabels) {
    return <SafeAreaView></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 16 }}>
        <Image
          style={{ width: 120, height: 120 }}
          resizeMode={"cover"}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Euro_symbol.svg/250px-Euro_symbol.svg.png",
          }}
        />
        <Text>{result ? `${result.toFixed(2)} €` : ""}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 16,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={(val) => {
            amountRef.current = val;
            return setAmount(val);
          }}
          value={amount}
        />
        <Picker
          style={{ height: 40, width: "40%" }}
          selectedValue={picked}
          onValueChange={(val) => {
            pickedRef.current = val;
            return setPicked(val);
          }}
        >
          {exhangesLabels.map((x) => (
            <Picker.Item key={x} label={x} value={x} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => convertMoney()}
          title="Convert"
          accessibilityLabel="Convert"
        >
          <Text style={styles.text}>Convert</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    width: "40%",
  },
  buttons: {
    marginBottom: 24,
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2222cc",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
