import React, { useEffect, useState } from "react";
import { 
	StyleSheet, 
	Text, 
	View, 
	ScrollView, 
	Pressable,
	Modal,
	Dimensions,
	ActivityIndicator,
	TouchableOpacity,
	Platform,
	Alert
} from "react-native";
import HomeHeader from "../components/HomeHeader";
import { Avatar, Input, Button, Divider } from "react-native-elements";
import { AntDesign } from '@expo/vector-icons'
import { auth, db, storage } from "../../firebase";
import * as ImagePicker from 'expo-image-picker'
import firebase from "firebase";

const ProfileScreen = ({ navigation }) => {
	const [isBioModalVisible, setIsBioModalVisible] = useState(false)
	const [newBioInput, setNewBioInput] = useState("")
	const [myId, setMyId] = useState("")
	const [mine, setMine] = useState(null)
	const [isLoading, setIsloading] = useState(true)
	const [HasMediaPermission, setHasMediaPermission] = useState(null)
	const [pickedImage, setPickedImage] = useState(null)

	useEffect(() => {
		(async () => {
			const Permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
			setHasMediaPermission(Permission.status === 'granted')
		})();
	}, [])
	
	useEffect(() => {
		abc();
	}, [navigation])

	const abc = async () => {
		await db
		.collection('users')
		.where('email', '==', auth.currentUser.email)
		.get()
		.then((snap) => {
			// alert(snap.docs[0].id)
			setMyId(snap.docs[0].id)
			db.collection('users').doc(snap.docs[0].id).onSnapshot(snap => {
				const dt = snap.data()
				setMine({
					bio: dt.bio,
					name: dt.name,
					dp: dt.dp,
					mobile: dt.mobile,
				})
				setIsloading(false)
			})
		})
		.catch(er => alert(er))
	}

	const updateBio = () => {
		db.collection('users').doc(myId).update({ bio: newBioInput }).then(() => setIsBioModalVisible(!isBioModalVisible))
	}

	const pickImage = async () => {
		if(HasMediaPermission === false){
			alert("Permission to media library needed")
			return;
		}

		await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
			mediaTypes: ImagePicker.MediaTypeOptions.Images
		}).then((img) => {
			const uri = img.uri;
			const name = uri.substring(uri.lastIndexOf("/")+1)
			setPickedImage({
				name: name,
				uri: uri
			})
		}).then(() => {
			console.log(pickedImage)
		})
	}

	const uploadImage = async () => {
		const res = await fetch(pickedImage.uri)
		const blob = await res.blob()
		const task = storage.ref("profilePics/"+auth.currentUser.email).put(blob)

		
		try {
			await task.then(() => { 
				alert("ok")
				task.snapshot.ref.getDownloadURL().then((url) => {
					auth.currentUser.updateProfile({
						photoURL: url,
					}).then(()=>{
						db.collection('users').doc(myId).update({
							dp: url
						})
						setPickedImage(null)
					})
				})
			})
		} catch (e) {
			alert(e)
		}
	}

	if(isLoading === true) {
		return (
			<View style={{ flex: 1 }}>
				<HomeHeader navigation={navigation} />
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size={44} color="orange" animating={true} />
				</View>
			</View>
		);
	}

	return (
		<View>
			<HomeHeader navigation={navigation} />

			{/* Change bio modal */}
			<Modal
				animationType="fade"
				visible={isBioModalVisible}
				transparent={false}
				presentationStyle="fullScreen"
			>
				<View style={{ flex: 1 }}>
					<Pressable
						onPress={() => setIsBioModalVisible(!isBioModalVisible)}
						style={{ position: "absolute", top: 0, right: 0, padding: 20 }}
					>
						<AntDesign name="close" size={34} color="black" />
					</Pressable>

					<View style={{ marginTop: 60, justifyContent: "center", flex: 1 }}>
						<Input
							placeholder="New Bio"
							value={newBioInput}
							onChangeText={(txt) => setNewBioInput(txt)}
						/>
						<Button title="Update" onPress={updateBio} />
					</View>
				</View>
			</Modal>

			<ScrollView>
				<View style={ss.footer}>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 20, fontFamily: "serif" }}>from</Text>
						<Text style={{ fontSize: 29, fontFamily: "monospace" }}>
							Vinoth
						</Text>
					</View>
				</View>

				<View style={ss.body}>
					<View style={ss.AvatarContainer}>
						{pickedImage !== null ? (
							<Avatar
								rounded
								source={{
									uri: pickedImage.uri,
								}}
								size={200}
							/>
						) : (
							<Avatar
								rounded
								source={{
									uri: auth.currentUser.photoURL,
								}}
								size={200}
							/>
						)}
						<View style={ss.pencilContainer}>
							{pickedImage !== null ? (
								<Pressable onPress={() => uploadImage()}>
									<AntDesign name="check" color="black" size={34} />
								</Pressable>
							) : (
								<Pressable onPress={() => pickImage()}>
									<AntDesign name="edit" color="black" size={34} />
								</Pressable>
							)}
						</View>
					</View>

					<View style={ss.DetailsContainer}>
						<Pressable style={ss.NameContainer}>
							<AntDesign name="user" size={15} color="black" />
							<View style={{ marginLeft: 20 }}>
								<Text style={{ color: "grey" }}>Name</Text>
								<Text style={ss.Name}>{auth.currentUser.displayName}</Text>
								<Text style={{ color: "grey" }}>
									This is not your username or pin.
								</Text>
							</View>
						</Pressable>

						<Pressable
							style={ss.AboutContainer}
							onPress={() => setIsBioModalVisible(!isBioModalVisible)}
						>
							<AntDesign name="infocirlceo" size={15} color="black" />
							<View style={{ marginLeft: 20 }}>
								<Text style={{ color: "grey" }}>Bio</Text>
								<Text style={ss.About}>{mine.bio}</Text>
								<Text style={{ color: "grey" }}>
									This is just a little info about you
								</Text>
							</View>
						</Pressable>

						<View style={ss.ContactContainer}>
							<AntDesign name="phone" size={15} color="black" />
							<View style={{ marginLeft: 20 }}>
								<Text style={{ color: "grey" }}>Contact no.</Text>
								<Text style={ss.Contact}>{mine.mobile}</Text>
								<Text style={{ color: "grey" }}>
									You can't modify your mobile number
								</Text>
							</View>
						</View>
					</View>

					<View style={ss.LinksContainer}>						
						<View
							style={{
								width: "70%",
								alignItems: "center",
								borderTopColor: "black",
								borderTopWidth: 1,
							}}
						>
							<TouchableOpacity
								onPress={() => navigation.navigate("DeveloperContactScreen")}
								style={{
									paddingTop: 20,
									display: "flex",
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
								}}
								activeOpacity={0.1}
							>
								<Text style={{ fontSize: 20, margin: 10 }}>Contact Me</Text>
								<AntDesign size={20} color="black" name="staro" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default ProfileScreen;

const ss = StyleSheet.create({
	body: {
		alignItems: "center",
		height: 800
	},

	AvatarContainer: {
		width: 200,
		height: 200,
	},

	pencilContainer: {
		position: "absolute",
		bottom: 10,
		right: 10,
		backgroundColor: "orange",
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
	},

	DetailsContainer: {
		width: 200,
		alignItems: "center",
		marginTop: 30,
	},

	NameContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	Name: {
		fontSize: 20,
	},

	AboutContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	About: {
		fontSize: 15,
	},

	ContactContainer: {
		marginTop: 20,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	Contact: {
		marginLeft: 10,
		fontSize: 20,
	},

	footer: {
		width: Dimensions.get('window').width,
		marginTop: 20,
		marginBottom: 20,
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center'
	},

	LinksContainer: {
		width: '100%',
		alignItems: 'center',
		marginTop: 30,
	}
});