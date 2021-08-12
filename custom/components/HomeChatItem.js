import React, { useEffect, useState } from 'react'
import { Dimensions, View, Text } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import TouchableScale from 'react-native-touchable-scale'
import { auth, db } from '../../firebase'

const HomeChatItem = ({
	roomId,
	email1,
	email2,
	navigation,
	myId,
	lastMessage,
	lastMessageBy,
}) => {
	const [chaterData, setChaterData] = useState(null);

	const subtitle = lastMessageBy === auth.currentUser.email ? `You: ${lastMessage}` : lastMessage

	useEffect(() => {
		abc();
	}, []);

	const abc = () => {
		if (auth.currentUser.email === email1) {
			db.collection("users")
				.where("email", "==", email2)
				.get()
				.then((snap) => {
					if (snap.docs[0].exists) {
						setChaterData({
							id: snap.docs[0].id,
							data: snap.docs[0].data(),
						});
					}
				});
		} else if (auth.currentUser.email === email2) {
			db.collection("users")
				.where("email", "==", email1)
				.get()
				.then((snap) => {
					if (snap.docs[0].exists) {
						setChaterData({
							id: snap.docs[0].id,
							data: snap.docs[0].data(),
						});
					}
				});
		} else {
			return <></>;
		}
	};

	return (
		<View style={{ width: Dimensions.get("window").width }}>
			{chaterData && (
				<ListItem
					key={roomId}
					Component={TouchableScale}
					activeScale={0.85}
					onPress={() =>
						navigation.navigate("ChatScreen", {
							roomId: roomId,
							name: chaterData.data.name,
							dp: chaterData.data.dp,
							myId: myId,
							email: chaterData.data.email,
						})
					}
					bottomDivider
				>
					<Avatar
						rounded
						source={{
							uri: chaterData.data.dp,
						}}
						size={50}
					/>
					<ListItem.Content>
						<ListItem.Title style={{ fontWeight: "bold" }}>
							{chaterData.data.name}
						</ListItem.Title>
						<ListItem.Subtitle>
							{subtitle}
						</ListItem.Subtitle>
					</ListItem.Content>
					<ListItem.Chevron iconStyle={{ color: "orange" }} />
				</ListItem>
			)}
		</View>
	);
};

export default HomeChatItem;