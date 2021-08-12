import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import NewChatScreen from '../screens/NewChatScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { FontAwesome, Feather } from '@expo/vector-icons'

const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
    return (
			<Tab.Navigator
				shifting={false}
                activeColor="orange"
				inactiveColor="rgba(0, 0, 0, 0.4)"
				barStyle={{ backgroundColor: "white", overflow: "visible", height: 65 }}
				labeled={false}
			>
				<Tab.Screen
					name="HomeScreen"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ color }) => (
							<Feather name={"home"} size={24} color={color} />
						),
						tabBarColor: "rgba(0, 0, 0, 0.9)",
					}}
				/>
				<Tab.Screen
					name="NewChatScreen"
					component={NewChatScreen}
					options={{
						tabBarIcon: () => (
							<View
								style={{
									position: "absolute",
									bottom: 0,
									height: 18,
									width: 68,
									borderRadius: 58,
									justifyContent: "center",
									alignItems: "center",
									overflow: "visible",
								}}
							>
								<FontAwesome
									name="plus-square"
									size={18}
									color="#fff"
									style={{
										backgroundColor: "orange",
										borderRadius: 58,
										padding: 15,
									}}
								/>
							</View>
						),
					}}
				/>
				<Tab.Screen
					name="ProfileScreen"
					component={ProfileScreen}
					options={{
						tabBarIcon: ({ color }) => (
							<Feather name={"user"} size={24} color={color} />
						),
						tabBarColor: "black",
						tabBarBadge: true,
						title: "User Profile",
					}}
				/>
			</Tab.Navigator>
		);
}

export default BottomNav

const styles = StyleSheet.create({})
