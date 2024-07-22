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
export default function attendanceClass() {
    const { id, name } = useLocalSearchParams();
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["40%", "48%"];
    function handleKeyModal() {
        bottomSheetModalRef.current?.present();
    }
    const [data, setData] = useState([]);
    const [trainee, setTrainee] = useState();
    const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modeModal, setModeModal] = useState();
    const [messageModal, setMessageModal] = useState();


    // mendapatkan data attendance
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


    // mendapatkan attendance detail untuk setiap attendance
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

    // card untuk setiap trainee yang hadir
    const renderItem = ({ item }) => {
        const handlePress = () => {
            item.grade != null ? router.push({ pathname: `instructor/editGrade/${item.idTrainee.id_users}`, params: { name: item.idTrainee.name, id_attendancedetail: item.id_attendancedetail, hub: item.idTrainee.hub, idAttendance: item.idAttendance.id_attendance } }) :
                router.push({ pathname: `instructor/addGrade/${item.idTrainee.id_users}`, params: { name: item.idTrainee.name, id_attendancedetail: item.id_attendancedetail, hub: item.idTrainee.hub, photo_profile: item.idTrainee.photo_profile, } });
        };

        return (
            <CardAttendance
                onPress={handlePress}
                text={item.idTrainee.name}
                subtext={item.grade === 'PASS' || item.grade === 'FAIL' ? item.grade : ''}
                images={item.idTrainee.photo_profile ? { uri: IMAGE_BASE_URL + 'profile/' + item.idTrainee.photo_profile } : profiles}
                score={item.score}
            />

        );
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchTrainee();
        }, [])
    );




    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // konfirmasi attendance ketika semua trainee sudah diberikan nilai
    const handleButton = async () => {
        try {
            console.log(id);
            const response = await authenticatedRequest(`/api/v1/instructor/checkstatusattendance/${id}`, "GET", {});
            if (response.data.status == "true") {
                router.push(`instructor/signatureattendance/${id}`);
            } else if (response.data.status == "false") {
                console.log("Failed:", response.data.message);
                setModalVisible(true);
                setModeModal("failed");
                setMessageModal(response.data.message);
            } else {
                console.error('Error fetching datass:');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };
    
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Stack.Screen options={{ headerShown: false }} />
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <StatusBar style='light' />
                    <BackgroundDefault />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{flex:1}} onPress={() => router.push('(tabsinstructor)')}>
                                <Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} />
                            </TouchableOpacity>
                            <Text style={{flex:8, color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>{name}</Text>
                            <Text style={{flex:1,  color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}></Text>
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
                                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={handleKeyModal}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1, backgroundColor: COLORS.light, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                                <Icon name="lastpass" style={{ fontSize: 20, color: COLORS.darkBlue }} />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ color: COLORS.darkBlue, fontSize: 12, fontWeight: 'bold' }}>Code Class</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                    </View>
                                </View></View>

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
                                    <Text style={{ fontWeight: 'bold', justifyContent: 'center', textAlign: 'center', marginBottom: 10, color: COLORS.darkBlue}}>{data.keyAttendance}</Text>
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
                        <TouchableOpacity onPress={handleButton} style={[styles.inputContainer, { backgroundColor: COLORS.darkBlue, marginTop: 12, textAlign: 'center' }]}>
                            <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>End Class</Text>
                        </TouchableOpacity>
                        <CustomModal modeModal={modeModal} isVisible={modalVisible} onClose={closeModal} message={messageModal} />
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