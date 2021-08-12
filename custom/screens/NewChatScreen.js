import React, { useState, useEffect, useLayoutEffect } from "react";
import { Keyboard } from "react-native";
import { StyleSheet, Text, View, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { auth, db } from '../../firebase'
import NewChatListItem from '../components/NewChatListItem'

const NewChatScreen = ({ navigation }) => {
	const [filtered, setFiltered] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [myId, setMyId] = useState("")

	useEffect(() => {
		abc();
	},[])

	const abc = async () => {
		await db
			.collection("users")
			.where("email", "==", auth.currentUser.email)
			.get()
			.then((snap) => {
				setMyId(snap.docs[0].id)
				setIsLoading(!isLoading);
			})
			.catch(err => console.log(err))
	}

	const filter = (input) => {
		setFiltered([])
		db.collection('users')
		  .onSnapshot(snap => {
			  snap.docs.map(doc => {
				  const dt = doc.data()
				  if(dt.mobile.includes(input)){
					  setFiltered((old) => [...old, {
						  id: doc.id,
						  data: doc.data()
					  }])
				  }
			  })
		  })
	}
	
	
	if(isLoading === true) {
		return (
			<View style={{ flex: 1 }}>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
					<ActivityIndicator size={44} color="orange" />
				</View>
			</View>
		);
	}

	return (
		<View style={{ paddingTop: 20 }}>
			<StatusBar barStyle="dark-content" backgroundColor="orange" />
			{/* <Text style={{ fontSize: 20, fontFamily: 'serif', marginLeft: 20,}}>Our Users:</Text> */}
			<Input
				label="Search"
				placeholder="Enter mobile number"
				onChangeText={(txt) => filter(txt)}
				keyboardType="phone-pad"
				onSubmitEditing={filter}
				onBlur={() => Keyboard.dismiss()}
			/>
			<ScrollView style={{ marginBottom: 80 }}>
				{filtered && filtered.map(({ id, data: { name, mobile, dp, email } }) => (
					<NewChatListItem
						key={id}
						id={id}
						name={name}
						mobileNo={mobile}
						imgURL={dp}
						myID={myId}
						email={email}
						navigation={navigation}
					/>
				))}
			</ScrollView>
		</View>
	);
};

export default NewChatScreen;

const ss = StyleSheet.create({
	inputContainer: {
		marginTop: 30,
	},
});