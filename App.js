import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Focus } from "./src/features/focus/Focus";
import { Timer } from "./src/features/timer/Timer";
import { FocusHistory } from "./src/features/focus/FocusHistory";

import { colors } from "./src/utils/colors";
import { spacing } from "./src/utils/sizes";

const STATUSES = {
  COMPLETE: 1,
  FAILURE: 2,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState("gardening");
  const [focusHistory, setFocusHistory] = useState([]);

  // Così non abbiamo controllo
  // useEffect(() => {
  // if (focusSubject) {
  // setFocusHistory([...focusHistory, focusSubject]);
  // }
  // }, [focusSubject]); // se focusSubject cambia

  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory([
      ...focusHistory,
      { key: String(focusHistory.length + 1), subject, status },
    ]);
  };

  const onClear = () => {
    setFocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("focusHistory");
      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFocusHistory();
  }, []);

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  console.log(focusHistory);
  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUSES.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUSES.FAILURE);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    paddingTop: Platform.OS === "ios" ? spacing.md : spacing.lg,
  },
});
