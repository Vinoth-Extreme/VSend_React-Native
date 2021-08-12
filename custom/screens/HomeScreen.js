import React, { 
	useLayoutEffect, 
	useState, 
	useEffect 
} from 'react'
import { 
	View, 
	StatusBar, 
	ActivityIndicator, 
	ScrollView, 
	Text,
	Pressable
} from 'react-native'
import { auth, db } from '../../firebase'
import HomeHeader from '../components/HomeHeader'
import HomeChatItem from '../components/HomeChatItem'
import { BottomSheet } from 'react-native-elements'

const HomeScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [myId, setMyId] = useState("")
	const [allChatRooms, setAllChatRooms] = useState([])
	const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false)

	// Getting all chatrooms
	useLayoutEffect(() => {
		const unsubscribe = db
			.collection("chatRooms")
			.orderBy("lastMessageTime", "desc")
			.onSnapshot((snap) => {
				setAllChatRooms(
					snap.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				);
			});
		return unsubscribe;
	}, [])

	// Getting My id from users collection whenever navigation changes
	useEffect(() => {
		abc();
	}, [navigation])

	const abc = async () => {
		await db
			.collection("users")
			.where("email", "==", auth.currentUser.email)
			.get()
			.then((snap) => {
				if(snap.docs[0] !== null){
					setMyId(snap.docs[0].id);
					setIsLoading(!isLoading);
				}
			})
			.catch(er => alert("Error occured."))
	}

	// return this loading component till isLoading state is true
	if(isLoading === true){
		return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />
				<HomeHeader navigation={navigation} />
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<ActivityIndicator animating={true} size={44} color="orange" />
				</View>
			</View>
		);
	}

	// Return after everything getting loaded
	return (
		<View style={{ backgroundColor: "#fff" }}>
			<StatusBar barStyle="dark-content" backgroundColor="orange" />
			<HomeHeader
				navigation={navigation}
			/>
			<ScrollView contentContainerStyle={{ backgroundColor: "white" }}>
				{allChatRooms &&
					allChatRooms.map(
						({ id, data: { email1, email2, lastMessage, lastMessageBy } }) => (
							<HomeChatItem
								key={id}
								roomId={id}
								email1={email1}
								email2={email2}
								myId={myId}
								lastMessage={lastMessage}
								navigation={navigation}
								lastMessageBy={lastMessageBy}
							/>
						)
					)}
			</ScrollView>
			<BottomSheet
				isVisible={false}
				containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
			>
				<Pressable>
					<Text>Logout</Text>
				</Pressable>
			</BottomSheet>
		</View>
	);
}

export default HomeScreen;