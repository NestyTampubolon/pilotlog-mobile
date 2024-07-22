import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Image } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import COLORS from '../../../components/colors';
import BackgroundDefault from '../../../components/background';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import CardAttendance from '../../../components/CardAttendance';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IMAGE_BASE_URL, authenticatedRequest } from '../../Api/ApiManager';
import { formatDate, statusDate } from '../../../components/utils';
import QRCode from 'react-native-qrcode-svg';
import CustomModal from '../../../components/CustomModal';
import profiles from '../../../assets/profile.jpg';
import CardPilotClass from '../../../components/CardPilotClass';

// menampilkan data sesuai user pilot crew
export default function pilotcrew() {
    const { id, name } = useLocalSearchParams();
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["40%", "48%"];
    function handleKeyModal() {
        bottomSheetModalRef.current?.present();
    }
    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = useState(null);

    // mendapatkan data attenendance yang sudah diikuti 
    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/public/allattendance/${id}`, "GET");
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item.idTrainee) {
                    setImage(item.idTrainee.photo_profile);
                }
            });
        }
    }, [data]);


    // card daftar riwayat attendance yang pernah diikuti 
    const renderItem = ({ item }) => {
        const handlePress = () => {
            router.push({ pathname: `cpts/classhistorypilot/${item.idAttendance.id_trainingclass.id_trainingclass}`, params: { name: item.idAttendance.id_trainingclass.name, id_users: item.idTrainee.id_users } });
        };


        return (
            <CardPilotClass
                text={item.idAttendance.id_trainingclass.name}
                subtext={`${formatDate(item.idAttendance.valid_to)}`}
                status={`${statusDate(item.idAttendance.valid_to)}`}
                showIcon={false}
                onPress={handlePress}
            />

        );
    };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         fetchTrainee();
    //     }, [])
    // );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Stack.Screen options={{ headerShown: false }} />
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <StatusBar style='light' />
                    <BackgroundDefault />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => router.back()}>
                                <Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} />
                            </TouchableOpacity>
                            <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 8 }}>{name}</Text>
                            <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 1 }}></Text>
                        </View>
                        <View style={{backgroundColor: COLORS.light, borderRadius: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                             <Image style={styles.circular} source={image ? { uri: IMAGE_BASE_URL + 'profile/' + image} : profiles} /> 
                            <Text style={{fontWeight:'bold', fontSize: 22, color: COLORS.darkBlue, marginTop: 10}}>{name}</Text>
                        </View>
                        <FlatList
                            scrollEnabled={false}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id_attendancedetail.toString()}
                        />
                    </View>
                </View>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        flex: 1,
        paddingTop: 50,
    },
    inputContainer: {
        width: '100%',
        height: 55,
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomModal: {
        backgroundColor: 'white',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',

    },
    circular: {
        width: 100,
        height: 100,
        borderRadius: 200,
        justifyContent: 'center'
    },

});