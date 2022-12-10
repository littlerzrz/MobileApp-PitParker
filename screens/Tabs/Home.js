import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Map, PitButton, CurrentParking } from "../../components";
import { COLORS } from "../../common";
import { mapAPI, pitAPI } from "../../api";
import { userStore } from "../../stores";
import { observer } from "mobx-react";

const Home = observer(() => {
  const [activeTab, setActiveTab] = useState("nearby");
  const [pits, setPits] = useState([]);

  const TabSet = () => (
    <View style={styles.buttons}>
      <PitButton
        style={[styles.button, styles.leftButton]}
        onPress={() => setActiveTab("nearby")}
        text="Nearby Pits"
        type={activeTab == "nearby" ? "primary" : "normal"}
      />
      <PitButton
        style={[styles.button, styles.rightButton]}
        onPress={() => setActiveTab("my")}
        text="My Pits"
        type={activeTab == "my" ? "primary" : "normal"}
      />
    </View>
  );

  const mapPits = (pit) => {
    const { place_id, name, geometry, vicinity } = pit;
    const latitude = geometry.location.lat;
    const longitude = geometry.location.lng;
    const compound_code = pit?.plus_code?.compound_code || "";
    return { id: place_id, name, latitude, longitude, vicinity, compound_code };
  };

  const setupNearbyPits = async () => {
    const parking = await mapAPI.getNearbyParking(userStore.userLocation);
    const pitsMapped = parking.results.map(mapPits);
    setPits(pitsMapped);
    pitAPI.batchAddPits(pitsMapped);
  };
  
  useEffect(() => {
    userStore.locateUser();
  }, []);

  useEffect(() => {
    setupNearbyPits();
  }, [userStore.userLocation]);

  useEffect(() => {
    if (activeTab == "nearby") {
      setupNearbyPits();
    } else {
      setPits(userStore.userPits);
    }
    return () => setPits([]);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <TabSet />
      <ScrollView style={styles.currentParkings}>
        {userStore.currentParkings.map((parking) => (
          <CurrentParking
            parking={parking}
            key={parking.id}
          />
        ))}
        <View style={{marginBottom:40}} />
      </ScrollView>
      <Map
        userLocation={userStore.userLocation}
        pits={pits}
        iconColor={activeTab == "nearby" ? COLORS.TINT[120] : COLORS.TINT[100]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  currentParkings: {
    zIndex: 3000,
    position: "absolute",
    bottom: 10,
    width: "100%",
    padding: 24,
    height: 220,
  },
  buttons: {
    position: "absolute",
    zIndex: 2000,
    top: 60,
    flexDirection: "row",
    backgroundColor: COLORS.BASE[0],
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: COLORS.TINT[100],
    color: COLORS.BASE[0],
  },
  leftButton: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    marginRight: -0.5,
  },
  rightButton: {
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: -0.5,
  },
  button: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0,
    width: 150,
  },
});
export default Home;
