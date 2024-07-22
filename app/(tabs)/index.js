import { Text, View, StyleSheet, Button, ScrollView, ActivityIndicator, FlatList } from 'react-native'
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
import BackgroundHome from '../../components/backgroundhome';
import EmptyList from '../../components/emptylist';

export default function Page() {
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedDay, setFormattedDay] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);



  useEffect(() => {
    // get data attendance terbaru dimana statusnya masih pending
    const fetchData = async () => {
      try {
        const response = await authenticatedRequest('/api/v1/trainee/attendancedetail/recentclass', "GET");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // get data user yang sedang login
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

  const renderItem = ({ item }) => {
    //daftar attendance
    const handlePress = () => {
      router.push(`trainee/signatureattendance/${item.id_attendancedetail}`);
    };

    return (
      <CardTraining
        text={`${item.idAttendance.id_trainingclass.name} - ${formatDate(item.idAttendance.date)}`}
        onPress={handlePress}
      />
    );
  };



  return (
    <View style={{ backgroundColor: COLORS.white, height: "100%" }}>
      <StatusBar style='light' />
      <BackgroundHome/>
      <ScrollView style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', paddingTop: 40 }}>
          <View style={{ flex: 5 }}>
            {userInfo && (
              <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: 'bold' }}>Hi, {userInfo.rank} {userInfo.name.split(' ')[0]}!</Text>
            )}

            <Text style={{ color: COLORS.white, fontSize: 17 }}>{getGreetingMessage()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Link href="trainee/scanbarcode">
              <View style={{ flex: 1, borderRadius: 100, backgroundColor: 'rgba(0, 0, 139, 1)', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 5 }}>
                <Icon name="qrcode" style={{ fontSize: 35, color: COLORS.white }} />
              </View>
            </Link >
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


        <Text style={{ fontSize: 12, paddingTop: 20, color: COLORS.white }}>Recent Class</Text>
        {data.length != 0 && <FlatList
          scrollEnabled={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_attendancedetail.toString()}
        />}       
        
        {data.length == 0 && <EmptyList />}

        
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
})
