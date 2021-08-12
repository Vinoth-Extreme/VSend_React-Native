import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'

const SettingsScreen = ({ navigation }) => {

	useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Settings',
            headerLeft: () => (
                <Ionicons name="chevron-back" color="black" size={24} />
            ),
            headerTitleAlign: 'left',
            headerStyle: {
                backgroundColor: 'orange'
            },
        })
    }, [navigation]);


	return (
		<View>
			<Text>settings</Text>
		</View>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({});
