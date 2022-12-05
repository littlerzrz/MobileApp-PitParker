import { SafeAreaView, Text, Button } from "react-native";
import React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../backend";

export default function ProfileSettings() {
  return (
    <SafeAreaView>
      <Text>
        <Button title="Logout" onPress={() => signOut(auth)} />
      </Text>
    </SafeAreaView>
  );
}
