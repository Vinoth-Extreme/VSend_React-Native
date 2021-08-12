import React, { useEffect, useLayoutEffect, useState } from 'react'
import { 
    StyleSheet,
    View,
    StatusBar,
    KeyboardAvoidingView,
    Dimensions,
	ActivityIndicator
} from 'react-native'
import {
    Input,
    Button
} from 'react-native-elements'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { db, auth, storage } from '../../firebase'
import {
	Avatar
} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'

const RegisterScreen = ({ navigation }) => {
	const [name, setName] = useState('');
	const [imgUrl, setImgUrl] = useState('');
	const [mail, setMail] = useState('');
	const [mobile, setMobile] = useState('');
	const [pwd, setPwd] = useState('');
	const [HasMediaPermission, setHasMediaPermission] = useState(null)
	const [pickedImage, setPickedImage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Register here!',
            headerLeft: () => (
                <Ionicons name="chevron-back" color="black" size={24} />
            ),
            headerTitleAlign: 'left',
            headerStyle: {
                backgroundColor: 'orange'
            },
        })
    }, [navigation]);

	const signUp = async () => {
		setIsLoading(true)
		const res = await fetch(pickedImage.uri)
		const blob = await res.blob()
		const task = storage.ref('profilePics/'+mail).put(blob)

		try {
			await task.then(() => {
				task.snapshot.ref
					.getDownloadURL()
					.then((url) => {
						auth
							.createUserWithEmailAndPassword(mail, pwd)
							.then((authUser) => {
								if (authUser) {
									authUser.user.updateProfile({
										displayName: name,
										photoURL:
											url ||
											"https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
									});

									db.collection("users")
										.add({
											name: name,
											dp:
												url ||
												"https://www.kindpng.com/picc/m/21-214439_free-high-quality-person-icon-default-profile-picture.png",
											email: mail,
											mobile: mobile,
											bio: "Not set",
											ratings: "Not given",
										})
										.then(() => {
											navigation.replace("BottomNav");
										})
										.catch((err) => {									
											setIsLoading(false)
											alert(err)
										});
								}
							})
							.catch((err) => {
								setIsLoading(false);
								alert(err);
							});
					})
					.catch((err) => {
						setIsLoading(false);
						alert(err);
					});
			}).catch((err) => {
				setIsLoading(false)
				alert(err)
			});
		} catch (e) {
			setIsLoading(false);
			alert(err);
		}
	}

	const PickImage = async () => {
		const res = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if(res.status === 'granted'){
			setHasMediaPermission(true)
			ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [1, 1]
			}).then((img) => {
				const uri = img.uri
				const name = img.uri.substring(img.uri.lastIndexOf('/')+1)
				setPickedImage({
					uri: uri,
					name: name,
				})
			})
		}
	}

	if(isLoading === true){
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator
					size={44}
					color="orange"
				/>
			</View>
		);
	}


    return (
			<View style={{ flex: 1, display: "flex", justifyContent: "center" }}>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />

				<KeyboardAvoidingView behavior="padding" style={{}} enabled={false}>
					<View style={ss.formContainer}>
						{pickedImage !== null ? (
							<Avatar
								rounded
								source={{ uri: pickedImage.uri }}
								size="xlarge"
								onPress={() => PickImage()}
								containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
							>
								<Avatar.Accessory
									size={40}
									iconStyle={{ fontSize: 20 }}
									style={{ backgroundColor: "orange" }}
									onPress={() => PickImage()}
								/>
							</Avatar>
						) : (
							<Avatar
								rounded
								icon={{
									name: "user",
									color: "lightgrey",
									type: "font-awesome",
								}}
								size="xlarge"
								onPress={() => PickImage()}
								containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
							>
								<Avatar.Accessory
									size={40}
									iconStyle={{ fontSize: 20 }}
									style={{ backgroundColor: "orange" }}
									onPress={() => PickImage()}
								/>
							</Avatar>
						)}

						<View style={{ width: "90%" }}>
							<Input
								textContentType="name"
								placeholder="Full name"
								value={name}
								onChangeText={(txt) => setName(txt)}
							/>
							{/* <Input
								textContentType="name"
								placeholder="DP url"
								value={imgUrl}
								onChangeText={(txt) => setImgUrl(txt)}
							/> */}
							<Input
								textContentType="name"
								placeholder="Email"
								value={mail}
								onChangeText={(txt) => setMail(txt)}
							/>
							<Input
								textContentType="name"
								placeholder="Mobile No"
								value={mobile}
								onChangeText={(txt) => setMobile(txt)}
								keyboardType="number-pad"
							/>
							<Input
								textContentType="name"
								placeholder="Password"
								secureTextEntry
								value={pwd}
								onChangeText={(txt) => setPwd(txt)}
							/>
							<Button
								title="Register"
								type="solid"
								titleStyle={{ color: "black" }}
								buttonStyle={{ backgroundColor: "orange" }}
								onPress={() => signUp()}
								// onPress={signUp}
							/>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
}

export default RegisterScreen

const ss = StyleSheet.create({
	formContainer: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height - 180,
		justifyContent: "center",
		alignItems: "center",
	},
});