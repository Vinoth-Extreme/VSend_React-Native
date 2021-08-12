import React, { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { 
	StyleSheet, 
	Text, 
	View,
	StatusBar,
	Modal,
	Pressable,
	Image,
	ScrollView
} from "react-native";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { db, auth } from '../../firebase'
import { Tile, SocialIcon } from 'react-native-elements'
import { ActivityIndicator } from "react-native";

const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get("window").height;

const DeveloperContactScreen = ({ navigation }) => {
	const [IsModalVisible, setIsModalVisible] = useState(false)
	const [mine, setMine] = useState(null)
	const [IsLoading, setIsLoading] = useState(true)
	const [rate, setRate] = useState(0)

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
		})
	}, [navigation])

	useEffect(() => {
		abc();
	}, [])

	const abc = async () => {
		await db
			.collection('users')
			.where('email', '==', auth.currentUser.email)
			.get()
			.then(snap => {
				if(snap.docs[0].exists){
					const dt = snap.docs[0]
					const d = snap.docs[0].data()
					setMine({
						id: dt.id,
					})
					if (d.ratings === "Not given") {
						setIsModalVisible(true);
					}
				}
			})
			.then(() => {
				setIsLoading(false)				
			})
	}

	const handleRating = (ratedValue) => {
		db
		.collection('users')
		.doc(mine.id)
		.update({
			ratings: ratedValue
		})
		.then(() => {
			alert("Thanks for your love and support.")
			setIsModalVisible(false)
		})
	}

	if(IsLoading === true){
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator
					size={44}
					color="orange"
				/>
			</View>
		)
	}

	return (
		<ImageBackground
			source={require("../images/my.jpg")}
			style={{
				flex: 1,
				padding: 10,
			}}
			blurRadius={2}
		>
			<StatusBar barStyle="dark-content" backgroundColor="orange" />
			<Modal
				visible={IsModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => alert("closing")}
				style={ss.modalContainer}
			>
				<View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
					<View style={ss.innerModalView}>
						<View style={ss.topicContainer}>
							<Text
								style={{
									fontSize: 20,
									fontFamily: "serif",
									textDecorationLine: "underline",
								}}
							>
								Feedback
							</Text>
							<Pressable onPress={() => setIsModalVisible(!IsModalVisible)}>
								<AntDesign name="closecircleo" size={24} color="black" />
							</Pressable>
						</View>

						<Text style={{ marginTop: 10, marginLeft: 35 }}>
							Please, Give me your feedback!
						</Text>

						<View style={ss.starsContainer}>
							<Pressable onPress={() => handleRating(1)}>
								<Entypo name="emoji-sad" size={24} color="black" />
							</Pressable>
							<Pressable onPress={() => handleRating(2)}>
								<Entypo name="emoji-neutral" size={24} color="black" />
							</Pressable>
							<Pressable onPress={() => handleRating(3)}>
								<Entypo name="emoji-happy" size={24} color="black" />
							</Pressable>
							<Pressable onPress={() => handleRating(4)}>
								<Entypo name="emoji-flirt" size={24} color="black" />
							</Pressable>
							<Pressable>
								<Ionicons
									name="medal-outline"
									onPress={() => handleRating(5)}
									size={24}
								/>
							</Pressable>
						</View>

						<View style={ss.footer}>
							<Pressable onPress={() => setIsModalVisible(!IsModalVisible)}>
								<Text
									style={{
										paddingRight: 20,
										borderWidth: 1,
										borderColor: "#000",
										paddingLeft: 20,
										marginRight: 10,
										borderRadius: 5,
										paddingTop: 5,
										paddingBottom: 5,
									}}
								>
									Remind Me later
								</Text>
							</Pressable>
							<Pressable onPress={() => setIsModalVisible(!IsModalVisible)}>
								<Text
									style={{
										paddingRight: 20,
										borderWidth: 1,
										borderColor: "#000",
										paddingLeft: 20,
										borderRadius: 5,
										paddingTop: 5,
										paddingBottom: 5,
									}}
								>
									Close
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>

			<View style={ss.mainContainer}>
				<ScrollView horizontal={true}>
					<Tile
						imageSrc={require("../images/my.jpg")}
						title="About me..."
						caption="Scroll to left"
						featured
						imageContainerStyle={{ width: 400, height: 400, borderRadius: 30 }}
						activeOpacity={0.6}
						overlayContainerStyle={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: 30,
						}}
					/>

					<Tile
						imageSrc={{
							uri:
								"https://www.teahub.io/photos/full/292-2920011_django-developer.png",
						}}
						title="Django developer"
						caption="Fullstack web developer with django python"
						featured
						imageContainerStyle={{ width: 400, height: 400, borderRadius: 30 }}
						activeOpacity={0.6}
						overlayContainerStyle={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: 30,
						}}
					/>

					<Tile
						imageSrc={{
							uri: "https://wallpapercave.com/wp/wp4923979.png",
						}}
						title="React Native"
						caption="Cross platform mobile app developer"
						featured
						imageContainerStyle={{ width: 400, height: 400, borderRadius: 30 }}
						activeOpacity={0.6}
						overlayContainerStyle={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: 30,
						}}
					/>

					<Tile
						imageSrc={{ uri: "https://wallpapercave.com/wp/wp2347580.jpg" }}
						title="Experience on Databases"
						caption="MySQL (Relational), PgAdmin (Relational), firebase (Non - Relational)"
						captionStyle={{ lineHeight: 20 }}
						featured
						imageContainerStyle={{ width: 400, height: 400, borderRadius: 30 }}
						activeOpacity={0.6}
						overlayContainerStyle={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: 30,
						}}
					/>

					<Tile
						imageSrc={{
							uri:
								"https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg",
						}}
						title="Adobe XD"
						caption="Noob for User Experience designing with adobe xd."
						captionStyle={{ lineHeight: 20 }}
						featured
						imageContainerStyle={{ width: 400, height: 400, borderRadius: 30 }}
						activeOpacity={0.6}
						overlayContainerStyle={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: 30,
						}}
					/>
				</ScrollView>
			</View>

			<View
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.1)",
					width: "100%",
					marginTop: 30,
					paddingLeft: 20,
					paddingRight: 20,
				}}
			>
				<SocialIcon
					type="whatsapp"
					raised
					button
					title="+91 9952987466"
					loading={false}
				/>
				<SocialIcon
					type="instagram"
					raised
					button
					title="vinoth_vijaya_kumar"
					loading={false}
					style={{ backgroundColor: "rgba(138, 58, 185, 0.5)" }}
				/>
				<SocialIcon
					type="linkedin"
					raised
					button
					title="Vinoth V"
					loading={false}
				/>
			</View>
		</ImageBackground>
	);
};

export default DeveloperContactScreen;

const ss = StyleSheet.create({
	modalContainer: {},

	innerModalView: {
		marginTop: scrHeight / 2 - 100,
		backgroundColor: "#fff",
		height: 200,
		width: scrWidth - 100,
		marginLeft: 50,
		borderRadius: 15,
	},

	topicContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},

	starsContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginTop: 20,
	},

	footer: {
		marginTop: 20,
		width: "100%",
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingLeft: 30,
		paddingRight: 30,
	},

	mainContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		width: "100%",
		height: 400,
		borderRadius: 30,
	},

	scrollViewContainer: {
		width: "100%",
		height: "100%",
		marginLeft: 10,
	},
});