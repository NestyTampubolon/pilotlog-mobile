import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import Svg, { Ellipse } from 'react-native-svg';
import COLORS from '../../components/colors';
import { StatusBar } from 'expo-status-bar';
import CardTraining from '../../components/CardTraining'
import BackgroundDefault from '../../components/background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticatedRequest } from '../Api/ApiManager';
import { router } from 'expo-router';

export default function Page() {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // mendaptkan daftar semua training
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authenticatedRequest('/api/v1/trainee/getAllTraining', "GET");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    const renderItem = ({ item }) => {

        // mengarahkan ke halaman history class
        const handlePress = () => {
            router.push({ pathname: `cpts/classhistory/${item.id_trainingclass}`, params: { name: item.name } });
        };

        return (
            <CardTraining
                text={`${item.short_name}`}
                onPress={handlePress}
            />
        );
    };


    return (
        <View style={{ backgroundColor: COLORS.white, height: "100%" }}>
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 60 }}>
                <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>History Class</Text>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_trainingclass.toString()}
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
