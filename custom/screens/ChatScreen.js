import React, { useLayoutEffect, useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	StatusBar,
	ImageBackground,
	ScrollView,
    KeyboardAvoidingView,
    Dimensions,
    Pressable,
    Keyboard,
	TouchableOpacity
} from "react-native";
import { Avatar, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'
import { auth, db } from '../../firebase';
import * as firebase from 'firebase';


const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])

    useLayoutEffect(() => {		
        navigation.setOptions({
					headerTitle: () => (
						<TouchableOpacity
							style={{ flex: 1, marginLeft: 10 }}
							activeOpacity={1}
							onPress={() =>
								navigation.navigate("ChatUserProfile", {
									email: route.params.email,
								})
							}
						>
							<Text style={{ fontSize: 20 }}>{route.params.name}</Text>
						</TouchableOpacity>
					),
					headerLeft: () => (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Pressable onPress={() => navigation.goBack()}>
								<Ionicons
									name="arrow-back"
									size={24}
									color="black"
									style={{ marginLeft: 5, marginRight: 5 }}
								/>
							</Pressable>
							<Pressable
								onPress={() =>
									navigation.navigate("ChatUserProfile", {
										email: route.params.email,
									})
								}
							>
								<Avatar source={{ uri: route.params.dp }} rounded size={40} />
							</Pressable>
						</View>
					),
					headerLeftContainerStyle: {
						marginLeft: 0,
					},
					headerTitleStyle: {
						marginLeft: 19,
						fontFamily: "serif",
					},
					headerStyle: {
						backgroundColor: "orange",
					},
				});
    }, [navigation]);

    useLayoutEffect(() => {
        const unsubscribe = db
                            .collection('chatRooms')
                            .doc(route.params.roomId)
                            .collection('messages')
                            .orderBy('timeStamp', 'asc')
                            .onSnapshot((snap) => {
                                setMessages(
                                    snap.docs.map((doc) => ({
                                        id: doc.id,
                                        data: doc.data()
                                    }))
                                )
                            })							

        return unsubscribe;
    }, [])

    const sendMessage = () => {
			setInput("");
			Keyboard.dismiss();
			db.collection("chatRooms")
				.doc(route.params.roomId)
				.collection("messages")
				.add({
					email: auth.currentUser.email,
					dp: auth.currentUser.photoURL,
					message: input,
					timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
				})
				.then(() => {
					db.collection("chatRooms").doc(route.params.roomId).update({
						lastMessage: input,
						lastMessageBy: auth.currentUser.email,
						lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
					});
				});
		};

	
	return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />
				<ImageBackground
					source={{ uri: "https://wallpapercave.com/wp/wp4410714.jpg" }}
					blurRadius={0.5}
					style={{ flex: 1 }}
					resizeMode="cover"
				>
					<KeyboardAvoidingView style={{ flex: 1 }}>
						<ScrollView style={{ flex: 1, marginBottom: 70 }}>
							{messages &&
								messages.map(({ id, data }) =>
									data.email === auth.currentUser.email ? (
										<Pressable
											style={ss.sender}
											onLongPress={() => alert("You")}
											key={id}
										>
											<Text style={ss.senderText}>{data.message}</Text>
											<Avatar
												source={{ uri: auth.currentUser.photoURL }}
												size={35}
												rounded
												position="absolute"
												bottom={-15}
												right={-10}
											/>
										</Pressable>
									) : (
										<View style={ss.receiver} key={id}>
											<Text style={ss.receiverText}>{data.message}</Text>
											<Avatar
												source={{ uri: route.params.dp }}
												size={30}
												rounded
												position="absolute"
												top={-10}
												left={-10}
											/>
										</View>
									)
								)}
						</ScrollView>

						<View style={ss.inputContainer}>
							<View
								style={{
									width: "100%",
									height: "100%",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
							>
								<Input
									placeholder="Type here..."
									placeholderTextColor="rgba(0, 0, 0, 0.4)"
									style={{ color: "#000" }}
									containerStyle={{ borderBottomWidth: 0 }}
									value={input}
									onChangeText={(txt) => setInput(txt)}
								/>
							</View>
							<Pressable onPress={sendMessage}>
								<Ionicons name="send-outline" color="black" size={30} />
							</Pressable>
						</View>
					</KeyboardAvoidingView>
				</ImageBackground>
			</View>
		);
}

export default ChatScreen

const ss = StyleSheet.create({
	inputContainer: {
		width: Dimensions.get("window").width,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
		left: 0,
		borderRadius: 29,
	},

	sender: {
		padding: 20,
        marginRight: 30,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		maxWidth: "80%",
		alignSelf: "flex-end",
		margin: 15,
		position: "relative",
		borderRadius: 20,
	},

	senderText: {
		color: "#000",
	},

	receiver: {
		backgroundColor: "orange",
		padding: 20,
		maxWidth: "80%",
		margin: 17,
		alignSelf: "flex-start",
		borderRadius: 20,
        position: 'relative',
        marginLeft: 30,
	},

	receiverText: {
		color: "#000",
	},
});