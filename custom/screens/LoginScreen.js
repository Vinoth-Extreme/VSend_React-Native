import React, { useLayoutEffect, useState } from 'react'
import {
    StyleSheet,
    View,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    Pressable,
	ActivityIndicator
} from 'react-native'
import {
    Input,
    Button,
    Text,
	Avatar
} from 'react-native-elements'
import {
    Ionicons
} from '@expo/vector-icons'
import { auth } from '../../firebase'

const LoginScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(false)
    const [mail, setMail] = useState("")
    const [pwd, setPwd] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Become United with our Community',
            headerLeft: () => (
                <Ionicons name="chevron-back" color="black" size={24} />
            ),
            headerTitleAlign: 'left',
            headerStyle: {
                backgroundColor: 'orange'
            },
        })
    }, [navigation]);

	useLayoutEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if(authUser){
				navigation.replace('BottomNav', {
					screen: 'HomeScreen'
				})
			}
		})

		return unsubscribe;
	}, [])

	const signIn = () => {
		setIsLoading(true)
		auth.signInWithEmailAndPassword(mail, pwd).catch(err => {
			setIsLoading(false)
			alert(err)
		})
	}

	if(isLoading === true) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator
					color="orange"
					size={44}					
				/>
			</View>
		);
	}

    return (
			<View
				style={{ flex: 1, display: "flex", justifyContent: "center", backgroundColor: '#fff' }}
			>
				<StatusBar barStyle="dark-content" backgroundColor="orange" />

				<KeyboardAvoidingView behavior="padding" style={{}}>
					<View style={ss.formContainer}>
						<Avatar
							source={ require("../../assets/icon.png") }
							size="xlarge"
						/>
						<View style={{ width: "90%" }}>
							<Input
								placeholder="Email"
								value={mail}
								onChangeText={(txt) => setMail(txt)}
							/>
							<Input
								placeholder="Password"
								secureTextEntry
								value={pwd}
								onChangeText={(txt) => setPwd(txt)}
							/>
							<Button
								title="Login"
								type="solid"
								buttonStyle={{ backgroundColor: 'orange' }}
								titleStyle={{ color: "black" }}
								onPress={signIn}
							/>
							<Pressable onPress={() => navigation.navigate("RegisterScreen")}>
								<Text
									style={{
										color: "#000",
										textAlign: "center",
										fontFamily: "serif",
										marginTop: 70,
										fontSize: 20,
									}}
								>
									Not a member yet?
								</Text>
							</Pressable>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
}

export default LoginScreen

const ss = StyleSheet.create({
    formContainer: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height-180,
        justifyContent: 'center',
        alignItems: 'center',
    },
})