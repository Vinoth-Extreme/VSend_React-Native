import React from 'react'
import { StyleSheet, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import BottomNav from './custom/routers/BottomNav';
import LoginScreen from './custom/screens/LoginScreen';
import RegisterScreen from './custom/screens/RegisterScreen';
import DeveloperContactScreen from './custom/screens/DeveloperContactScreen';
import ChatScreen from './custom/screens/ChatScreen';
import chatUserProfile from './custom/screens/chatUserProfile';
import RatingsListScreenForDeveloper from './custom/screens/RatingsListScreenForDeveloper';

const Stack = createStackNavigator();

const App = () => {

	LogBox.ignoreAllLogs()

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false
				}}
				initialRouteName="LoginScreen"
			>
				<Stack.Screen
					name="BottomNav"
					component={BottomNav}
				/>
				<Stack.Screen
					name="LoginScreen"
					component={LoginScreen}
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="RegisterScreen"
					component={RegisterScreen}
					options={{
						headerShown: true,
					}}
				/>
				
				<Stack.Screen
					name="ChatScreen"
					component={ChatScreen}
					options={{
						headerShown: true,
					}}
				/>
				
				<Stack.Screen
					name="DeveloperContactScreen"
					component={DeveloperContactScreen}
					options={{
						headerShown: true,
					}}
				/>
				
				<Stack.Screen
					name="ChatUserProfile"
					component={chatUserProfile}
					options={{
						headerShown: false,
					}}
				/>
				
				<Stack.Screen
					name="RatingsScreenForDeveloper"
					component={RatingsListScreenForDeveloper}
					options={{
						headerShown: true,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App