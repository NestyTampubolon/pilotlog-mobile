import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import COLORS from '../../../components/colors';
import BackgroundDefault from '../../../components/background';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import CardAttendance from '../../../components/CardAttendance';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { authenticatedRequest, IMAGE_BASE_URL } from '../../Api/ApiManager';
import { formatDate } from '../../../components/utils';
import QRCode from 'react-native-qrcode-svg';
import CustomModal from '../../../components/CustomModal';
import profiles from '../../../assets/profile.jpg';
export default function historyClass() {
    const { id, name } = useLocalSearchParams();
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["40%", "48%"];
    function handleKeyModal() {
        bottomSheetModalRef.current?.present();
    }
    const [data, setData] = useState([]);
    const [trainee, setTrainee] = useState();
    const [loading, setLoading] = React.useState(false);

    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/public/attendance/${id}`, "GET");
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

    const fetchTrainee = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/public/allattendancedetail/${id}`, "GET");
            setTrainee(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainee();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <CardAttendance
                text={item.idTrainee.name}
                subtext={item.grade === 'PASS' || item.grade === 'FAIL' ? item.grade : ''}
                images={item.idTrainee.photo_profile ? { uri: IMAGE_BASE_URL + 'profile/' + item.idTrainee.photo_profile } : profiles}
                score={item.score}
                showIcon={false}
            />

        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTrainee();
        }, [])
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Stack.Screen options={{ headerShown: false }} />
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <StatusBar style='light' />
                    <BackgroundDefault />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ flex: 1 }}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                            <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 8 }}>{name}</Text>
                            <Text style={{ flex: 1 }} ></Text>
                        </View> 
                        {data &&
                            <View>
                                <View style={{ flexDirection: 'row', paddingTop: 40 }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Icon name="calendar" style={{ fontSize: 20, color: COLORS.grey }} />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ color: COLORS.grey, fontSize: 12 }}>{formatDate(data.date)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Icon name="map-marker-outline" style={{ fontSize: 20, color: COLORS.grey }} />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ color: COLORS.grey, fontSize: 12 }}>{data.room}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Icon name="account-group" style={{ fontSize: 20, color: COLORS.grey }} />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ color: COLORS.grey, fontSize: 12 }}>{data.venue}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Icon name="account-group" style={{ fontSize: 20, color: COLORS.grey }} />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ color: COLORS.grey, fontSize: 12 }}>{data.department}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                </View>

                        }
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <BottomSheetModal
                                ref={bottomSheetModalRef}
                                index={0}
                                snapPoints={snapPoints}
                                backgroundStyle={{ borderRadius: 50 }}
                                avoidKeyboard={true}
                            >
                                <View style={styles.bottomModal}>
                                    <Text style={{ fontWeight: 'bold', justifyContent: 'center', textAlign: 'center', marginBottom: 10 }}>QR Code</Text>
                                    <QRCode
                                        value={data.keyAttendance}
                                        size={200}
                                        color="black"
                                        backgroundColor="white"
                                    />
                                </View>
                            </BottomSheetModal>
                        </KeyboardAvoidingView>

                        <Text style={{ paddingTop: 20, paddingVertical: 10, fontWeight: 'bold' }}>Attended</Text>
                        <FlatList
                            scrollEnabled={false}
                            data={trainee}
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

    }

});