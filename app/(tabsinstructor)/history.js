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
import Loader from '../../components/Loader';
export default function Page() {
    const [isLoading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    //mendapatkan data training
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await authenticatedRequest('/api/v1/public/training', "GET");
                setData(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);


    // card daftar training
    const renderItem = ({ item }) => {

        const handlePress = () => {
            router.push({ pathname: `instructor/classhistory/${item.id_trainingclass}`, params: { name: item.name } });
        };

        return (
            <CardTraining
                text={`${item.name}`}
                onPress={handlePress}
            />
        );
    };


    return (
        <View style={{ backgroundColor: COLORS.white, height: "100%" }}>
            <Loader visible={isLoading} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 60 }}>
                <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Training Class</Text>
                {data && data.length > 0 ? (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id_trainingclass.toString()}
                    />
                ) : (
                    <Text>No data available</Text>
                )}
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
