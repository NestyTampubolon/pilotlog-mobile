import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Modal, Pressable} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import Svg, { Circle, } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CardTraining from '../../components/CardTraining'
import { useRouter, Link } from 'expo-router';
import { authenticatedRequest, IMAGE_BASE_URL } from '../Api/ApiManager';
import { formatDate } from '../../components/utils';
import CustomModal from '../../components/CustomModal';
import BackgroundHome from '../../components/backgroundhome';
import CardPilot from '../../components/CardPilot';
import profiles from '../../assets/profile.jpg';

export default function Page() {
    const router = useRouter();
    const [formattedDate, setFormattedDate] = useState('');
    const [formattedDay, setFormattedDay] = useState('');

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [dataPending, setDataPending] = useState([]);
    const [binstructor, setBinstructor] = useState([]);
    const [pilotsCounts, setPilotsCounts] = useState({});

    const [userInfo, setUserInfo] = useState(null);

    // mendapatkan daftar attendance sudah di konfirmasi oleh instructor 
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

    // daftar attendance yang sedang berlangsung
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

    // mendapatkan grade atau penilaian instructor tertinggi 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authenticatedRequest('/api/v1/public/getgradeinstructor', "GET");
                setBinstructor(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
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
    
    // daftar riwayat attendance
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

    useEffect(() => {
        async function fetchUserInfo() {
            const storedUserInfo = await AsyncStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }
        }

        fetchUserInfo();
    }, []);

    // daftar pilot
    const renderItemInstructor = ({ item }) => {

        const handlePress = () => {
            router.push({ pathname: `cpts/pilotcrew/${item[0]}`, params: { name: item[2] } });
        };

        return (
            <CardPilot
                text={item[2]}
                subtext={`${item[3]} / 5`}
                onPress={handlePress}
                showIconStar='true'
                 images={item[1] ? { uri: IMAGE_BASE_URL + 'profile/' + item[1] } : profiles}

            />
        );
    };

    // mendapatkan data jumlah pilot
    useEffect(() => {
        const fetchDataCountPilot = async () => {
            try {
                const response = await authenticatedRequest(`/api/v1/cpts/countpilot`, "GET");
                setPilotsCounts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataCountPilot();
    }, []);


    return (
        <View style={styles.container}>
            <StatusBar style='light' />
            <BackgroundHome />
            <ScrollView style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', paddingTop: 40 }}>
                    <View style={{ flex: 5 }}>
                        {userInfo && (
                            <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: 'bold' }}>Hi, CPTS {userInfo.name.split(' ')[0]}!</Text>
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Overview</Text>
                <View style={{ flexDirection: 'row', paddingTop: 10}}>
                    <View style={{ flex:1,  flexDirection: 'column', paddingVertical: 20, paddingHorizontal: 10, backgroundColor: COLORS.white, marginRight: 10, borderRadius:10}}>
                        <Text style={{ fontSize: 14 }}>Valid Pilots</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pilotsCounts.validPilotsCount}/{pilotsCounts.allPilotsCount}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', paddingVertical: 20, paddingHorizontal: 10, backgroundColor: COLORS.white, marginRight: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 14 }}>Valid Pilots</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{pilotsCounts.validPilotsCount}/{pilotsCounts.allPilotsCount}</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Best Instructor</Text>
                <FlatList
                    scrollEnabled={false}
                    data={binstructor}
                    renderItem={renderItemInstructor}
                    keyExtractor={(item) => item[0].toString()}
                />
                

               
            </ScrollView>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 40,
    },
    headerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        flex: 5,
    },
    subHeaderText: {
        color: 'white',
        fontSize: 17,
    },
    dateContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
    },
    dateText: {
        color: 'white',
        fontSize: 14,
    },
    overviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    overviewBox: {
        flexBasis: '48%',
        flexDirection: 'column',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
    },
    overviewTitle: {
        fontSize: 14,
    },
    overviewValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        height: 40,
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#fafafa',
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropdownContent: {
        backgroundColor: '#fafafa',
    },
});
