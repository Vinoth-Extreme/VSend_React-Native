import React, { useLayoutEffect, useEffect, useState } from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../../firebase'

const RatingsListScreenForDeveloper = ({ navigation }) => {
    const [ratedUsers, setRatedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "How your works appriciated?",
            headerStyle: {
                backgroundColor: 'orange',
            }
        })
    }, [navigation])

    useEffect(() => {
        abc();
    }, [])

    const abc = () => {
        db.collection("users").onSnapshot((snap) => {
            setRatedUsers([])
            snap.docs.map((doc) => {
                const dt = doc.data();
                if (dt.ratings !== "Not given") {
                    setRatedUsers((old) => [
                        ...old,
                        {
                            id: doc.id,
                            data: doc.data(),
                        },
                    ]);
                }
                setIsLoading(false);
            });
        });
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
        <View>
            {ratedUsers && ratedUsers.map(({ id, data: { name, mobile, ratings, dp } }) => (
                <ListItem
                    key={id}
                >
                    <Avatar
                        source={{ uri: dp }}
                        size={44}
                        rounded
                    />
                    <ListItem.Content>
                        <ListItem.Title>{name}</ListItem.Title>
                        <ListItem.Subtitle>{mobile} - {ratings}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            ))}
        </View>
    )
}

export default RatingsListScreenForDeveloper

const ss = StyleSheet.create({})