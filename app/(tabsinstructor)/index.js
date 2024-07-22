import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Modal, Pressable} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import Svg, { Circle, } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CardTraining from '../../components/CardTraining'
import { useRouter, Link } from 'expo-router';
import { authenticatedRequest } from '../Api/ApiManager';
import { formatDate } from '../../components/utils';
import CustomModal from '../../components/CustomModal';
import BackgroundHome from '../../components/backgroundhome';
export default function Page() {
    const router = useRouter();
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedDay, setFormattedDay] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataPending, setDataPending] = useState([]);

    // mendapatkan data atttendance yang sudah dikonfirmasi oleh instructor
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authenticatedRequest('/api/v1/instructor/attendanceconfirmationdonebyinstructor', "GET");
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // mendapatkan data attendance yang sedang berlangsung
    useEffect(() => {
        const fetchDataPending = async () => {
            try {
                const response = await authenticatedRequest('/api/v1/instructor/attendancependingbyinstructor', "GET");
                setDataPending(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataPending();
    }, []);

    // mendapatkan data user yang sedang login
    useEffect(() => {
        async function fetchUserInfo() {
            const storedUserInfo = await AsyncStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }
        }

        fetchUserInfo();
    }, []);


    useEffect(() => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const monthNumber = currentDate.getMonth();
        const year = currentDate.getFullYear();
        // Array yang berisi nama-nama bulan
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Mengambil nama bulan dari array monthNames
        const monthName = monthNames[monthNumber];

        // Format tanggal ke dalam string
        const dateString = `${monthName} ${day}, ${year}`;

        const dayNames = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];

        const dayOfWeek = currentDate.getDay();
        const dayName = dayNames[dayOfWeek];

        // Simpan hasilnya dalam state
        setFormattedDate(dateString);
        setFormattedDay(dayName);
    }, []);


    const getGreetingMessage = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        let greetingMessage = '';

        if (currentHour >= 5 && currentHour < 12) {
            greetingMessage = 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            greetingMessage = 'Good Day';
        } else if (currentHour >= 18 && currentHour < 22) {
            greetingMessage = 'Good Evening';
        } else {
            greetingMessage = 'Good Night';
        }

        return greetingMessage;
    };

    // card daftar kelas yang sudah selesai
    const renderItem = ({ item }) => {

        const handlePress = () => {
            router.push({ pathname: `instructor/historydetail/${item.id_attendance}`, params: { name: item.id_trainingclass.name } });
        };
        return (
            <CardTraining
                text={`${item.id_trainingclass.name} - ${formatDate(item.date)}`}
                onPress={handlePress}
            />
        );
    };

    // menampilkan card daftar training yang sedang berlangsung
    const renderItemPending = ({ item }) => {

        const handlePress = () => {
            router.push({ pathname: `instructor/attendanceclass/${item.id_attendance}`, params: { name: item.id_trainingclass.name } });
        };

        return (
            <CardTraining
                text={`${item.id_trainingclass.name} - ${formatDate(item.date)}`}
                subtext={item.room}
                onPress={handlePress}
            />
        );
    };



    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <View style={styles.box}>
                <Svg width="340" height="329" viewBox="0 0 379 329" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Circle cx="129" cy="79" r="250" fill="#0064E9" />
                </Svg>
            </View>
            <ScrollView style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', paddingTop: 40 }}>
                    <View style={{ flex: 5 }}>
                        {userInfo && (
                            <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: 'bold' }}>Hi, Instructor {userInfo.name.split(' ')[0]}!</Text>
                        )}
                        <Text style={{ color: COLORS.white, fontSize: 17 }}>{getGreetingMessage()}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Icon name="calendar-month-outline" style={{ fontSize: 45, color: COLORS.white }} />
                    </View>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: COLORS.white, fontSize: 14 }}>{formattedDay},</Text>
                        <Text style={{ color: COLORS.white, fontSize: 14 }}>{formattedDate}</Text>
                    </View>
                </View>
                <Text style={{ color: COLORS.white, fontSize: 12 }}>Upcoming Class</Text>
                {/* <CardTraining text={'Task 1 '}/>
                <CardTraining text={'Task 1'} /> */}
                {dataPending.length != 0 && <FlatList
                    scrollEnabled={false}
                    data={dataPending}
                    renderItem={renderItemPending}
                    keyExtractor={(item) => item.id_attendance.toString()}
                />
                }
                <Text style={{ fontSize: 12, paddingTop: 20 }}>Completed Class</Text>

                {data.length != 0 && <FlatList
                    scrollEnabled={false}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_attendance.toString()}
                />}  
            </ScrollView>
           
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})
