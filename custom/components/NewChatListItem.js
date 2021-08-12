import React, { useLayoutEffect, useState } from "react";
import { Dimensions, View, StatusBar, ActivityIndicator, ToastAndroid } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import TouchableScale from "react-native-touchable-scale";
import { auth, db } from "../../firebase";

const NewChatListItem = ({ id, name, mobileNo, imgURL, myID, navigation, email }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [isChecked, setIsChecked] = useState(false)
	const [result1, setResult1] = useState("")
	const [result2, setResult2] = useState("")
	const [existingChatRoomId, setExistingChatRoomId] = useState("")

	if(email === auth.currentUser.email){
		return (
			<></>
		);
	}


	const checkChatRoom = async () => {
		setIsLoading(true)
		setIsChecked(false)


		const ref1 = await db.collection('chatRooms')
				.where('id1', '==', id)
				.where('id2', '==', myID)
				.get()

		if(ref1.empty){
			setResult1("positive")
		} else {
			setResult1("negative")
			setExistingChatRoomId(ref1.docs[0].id)
		}

		const ref2 = await db.collection('chatRooms')
				.where('id1', '==', myID)
				.where('id2', '==', id)
				.get()

		if(ref2.empty){
			setResult2("positive")
		} else {
			setResult2("negative")
			setExistingChatRoomId(ref2.docs[0].id)
		}


		setIsLoading(false)
		setIsChecked(true)
	}

	const createChatRoom = () => {
		db.collection('chatRooms')
			.add({
				id1: id,
				id2: myID,
				email1: email,
				email2: auth.currentUser.email,
			})
			.then((snap) => {
				const roomId = snap.id
				navigation.navigate("ChatScreen", {
					roomId: roomId,
					id: id,
					name: name,
					dp: imgURL,
					myId: myID,
					email: email
				})
				ToastAndroid.showWithGravity(
					"Room Created.",
					ToastAndroid.LONG,
					ToastAndroid.CENTER
				)
			})
	}

	if(isChecked === true){
		if(result1 === "positive" && result2 === "positive"){
			createChatRoom();
		} else {
			ToastAndroid.showWithGravity(
				"Room already exists.",
				ToastAndroid.LONG,
				ToastAndroid.CENTER
			);
			navigation.navigate("ChatScreen", {
				roomId: existingChatRoomId,
				id: id,
				name: name,
				dp: imgURL,
				email: email
			})
		}
	}

	if(isLoading === true){
		return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator color="orange" size={44} animating={true} />
				</View>
			</View>
		);
	}

	

	return (
		<View style={{ width: Dimensions.get("window").width }}>
			<ListItem
				key={id}
				onPress={() => checkChatRoom()}
				Component={TouchableScale}
				activeScale={0.98}
			>
				<Avatar
					rounded
					source={{
						uri: imgURL,
					}}
					size={50}
				/>
				<ListItem.Content>
					<ListItem.Title style={{ fontWeight: "bold" }}>{name}</ListItem.Title>
					<ListItem.Subtitle>{mobileNo}</ListItem.Subtitle>
				</ListItem.Content>
				<ListItem.Chevron iconStyle={{ color: "orange" }} />
			</ListItem>
		</View>
	);
};

export default NewChatListItem;