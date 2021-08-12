import React, { useEffect, useState } from 'react'
import { 
    View, 
    Text, 
    ActivityIndicator,
    ScrollView,
    ImageBackground,
    Dimensions,
    StyleSheet,
    Pressable
} from 'react-native'
import { 
    Ionicons, MaterialCommunityIcons
} from '@expo/vector-icons'
import { db } from '../../firebase'

export default function chatUserProfile ({route, navigation}) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const ref = db
        .collection('users')
        .where('email', '==', route.params.email)
        .get()
        .then(snap => {
            if(snap.docs[0].exists){
                setUser({
                    id: snap.docs[0].id,
                    data: snap.docs[0].data()
                })
                setIsLoading(false)
            }
        })
    }, [])

    if(isLoading === true){
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
			<View style={{ flex: 1 }}>
				<ScrollView>
					<ImageBackground
						source={{ uri: user.data.dp }}
						style={{
							width: Dimensions.get("window").width,
							height: 400,
							position: "relative",
						}}
					>
						<View style={{ flex: 1, backgroundColor: "rgba(0,0,0, 0.1)" }}>
							<Pressable style={ss.backButtonContainer} onPress={() => navigation.goBack()}>
								<Ionicons name="arrow-back" color="#fff" size={24} />
							</Pressable>
							<Text
								style={{
									color: "#fff",
									fontSize: 30,
									fontWeight: "bold",
									position: "absolute",
									bottom: 20,
									left: 0,
									marginLeft: 20,
								}}
							>
								{user.data.name}
							</Text>
						</View>
					</ImageBackground>
					<View style={ss.aboutContainer}>
						<Text style={{ fontSize: 15, color: "rgb(255,110,0)" }}>
							About:
						</Text>
						<Text style={{ marginLeft: 20 }}>{user.data.bio}</Text>
					</View>
					<View style={ss.mobileContainer}>
						<Text style={{ fontSize: 15, color: "rgb(255,110,0)" }}>
							Mobile No:
						</Text>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text style={{ marginLeft: 20 }}>{user.data.mobile}</Text>
							<View
							>
								<Ionicons
									name="call-outline"
									color="rgb(255,110,0)"
									size={24}
								/>
							</View>
						</View>
					</View>
					<View style={ss.emailContainer}>
						<Text style={{ fontSize: 15, color: "rgb(255,110,0)" }}>
							Email:
						</Text>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Text style={{ marginLeft: 20 }}>{user.data.email}</Text>
							<View>
								<MaterialCommunityIcons
									name="email-edit-outline"
									color="rgb(255,110,0)"
									size={24}
								/>
							</View>
						</View>
					</View>

					<View style={{ height: 100 }}></View>
				</ScrollView>
			</View>
		);
}

const ss = StyleSheet.create({
	backButtonContainer: {
		position: "absolute",
		top: 10,
		left: 10,
	},

	aboutContainer: {
		// width: '100%',
		backgroundColor: "rgba(255,110,0, 0.09)",
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
	},

	mobileContainer: {
		backgroundColor: "rgba(255,110,0, 0.09)",
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
	},

	emailContainer: {
		backgroundColor: "rgba(255,110,0, 0.09)",
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
		padding: 20,
	},
});