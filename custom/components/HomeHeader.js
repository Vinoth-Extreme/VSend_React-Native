import { auth } from '../../firebase'
import React from 'react'
import { 
	StyleSheet, 
	Text, 
	View, 
	Dimensions, 
	Animated, 
	TouchableOpacity 
} from 'react-native'
import { Avatar } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'

const HomeHeader = ({ navigation }) => {
	const posXVal = new Animated.Value(0)
	const logoYVal = new Animated.Value(0)

	const isLogged =
		auth.currentUser.email !== null ? (
			<Avatar
				rounded
				source={{
					uri: auth.currentUser.photoURL,
				}}
				size={70}
				onPress={() => MoveAnimation()}
				onLongPress = {() => DeveloperOnlyHandle()}
				containerStyle={{ zIndex: 99 }}
			/>
		) : (
			<Avatar
				rounded
				source={{
					uri: "https://wallpapercave.com/fwp/wp7673235.jpg",
				}}
				size={70}
			/>
		);

	const signOut = () => {
		auth.signOut().then(() => {
			navigation.replace("LoginScreen")
		})
	}

	const MoveAnimation = () => {
		Animated.timing(logoYVal, {
			toValue: -100,
			duration: 500,
			useNativeDriver: true
		}).start(() => {
			Animated.timing(posXVal, {
				toValue: -330,
				duration: 500,
				useNativeDriver: true,
			}).start(() => {
				Animated.timing(posXVal, {
					toValue: 0,
					duration: 500,
					delay: 3000,
					useNativeDriver: true,
				}).start(() => {
					Animated.timing(logoYVal, {
						toValue: 0,
						duration: 100,
						useNativeDriver: true,
					}).start()
				});
			});
		})	
	};

	const DeveloperOnlyHandle = () => {
		if(auth.currentUser.email === "vvinothtvijay@gmail.com"){
			navigation.navigate("RatingsScreenForDeveloper")
		} else {
			return null;
		}
	}

	return (
		<View style={ss.headerContainer}>
			<Animated.View style={{ transform: [{ translateY: logoYVal }] }}>
				<Text style={ss.logo}>
					V<Text style={ss.logoSpan}>S</Text>e<Text style={ss.logoSpan}>n</Text>
					d
				</Text>
			</Animated.View>

			<View
				style={{
					position: "absolute",
					right: 30,
				}}
			>
				<TouchableOpacity onPress={() => signOut()} style={{ backgroundColor: 'yellow', padding: 10, borderRadius: 30 }}>
					<Feather name="log-out" size={24} />
				</TouchableOpacity>
			</View>

			<Animated.View
				style={[
					ss.iconContainer,
					{
						transform: [
							{
								translateX: posXVal,
							},
						],
					},
				]}
			>
				{isLogged}
			</Animated.View>
		</View>
	);
};

export default HomeHeader;

const ss = StyleSheet.create({
	headerContainer: {
		width: Dimensions.get("window").width,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 10,
		// backgroundColor: "rgba(255,255, 255, 1)",
		backgroundColor: 'orange',
		borderBottomLeftRadius: 50,
		borderBottomRightRadius: 50,
		position: 'relative'
	},

	logo: {
		fontSize: 30,
		fontFamily: "serif",
	},

	logoSpan: {
		color: "rgba(0, 0, 0, .5)",
	},

	iconContainer: {
		width: 71,
		height: 71,
		borderRadius: 71,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255,165,0,1)",
	},

	icon: {},
});