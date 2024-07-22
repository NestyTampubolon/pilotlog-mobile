import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import Svg, { Ellipse } from 'react-native-svg';
import COLORS from '../../components/colors';
import { StatusBar } from 'expo-status-bar';
import CardTraining from '../../components/CardTraining'
import BackgroundDefault from '../../components/background';
import { authenticatedRequest, IMAGE_BASE_URL } from '../Api/ApiManager';
import { router } from 'expo-router';
import CardPilot from '../../components/CardPilot';
import profiles from '../../assets/profile.jpg';


export default function Page() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // mendapatkan data seluruh user
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authenticatedRequest('/api/v1/cpts/users', "GET");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // card daftar pilot
    const renderItem = ({ item }) => {

        const handlePress = () => {
            router.push({ pathname: `cpts/pilotcrew/${item.id_users}`, params: { name: item.name } });
        };

        return (
            <CardPilot
                text={item.name}
                subtext={item.status ? item.status : 'NOT VALID'}
                onPress={handlePress}
                images={item.photo_profile ? { uri: IMAGE_BASE_URL + 'profile/' + item.photo_profile } : profiles}

            />
        );
    };


    return (
        <View style={{ backgroundColor: COLORS.white, height: "100%" }}>
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 60 }}>
                <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Pilot Crew</Text>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_users.toString()}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    box: {
        position: 'absolute'
    },
    icon: {
        fontSize: 30,
        color: 'white',
    },
})
