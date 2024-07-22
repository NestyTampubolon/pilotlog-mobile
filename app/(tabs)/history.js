import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import COLORS from '../../components/colors';
import { StatusBar } from 'expo-status-bar';
import CardPilotClass from '../../components/CardPilotClass';
import BackgroundDefault from '../../components/background';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticatedRequest } from '../Api/ApiManager';
import { router } from 'expo-router';
import { formatDate, statusDate } from '../../components/utils';
import Loader from '../../components/Loader';

export default function Page() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [training, setTraining] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [mergedData, setMergedData] = useState([]);


  // get data user
  async function fetchUserInfo() {
    const storedUserInfo = await AsyncStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);


  //get data semua attendance
  const fetchData = async () => {
    try {
      if (userInfo) {
        const response = await authenticatedRequest(`/api/v1/public/allattendance/${userInfo.id_users}`, "GET");
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //validasi status user
  const fetchValid = async () => {
    try {
      if (userInfo) {
        const response = await authenticatedRequest(`/api/v1/public/validation/${userInfo.id_users}`, "GET");
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching validation data:", error);
    }
  };

  

  //get data training
  const fetchTraining = async () => {
    try {
      if (userInfo) {
        const response = await authenticatedRequest(`/api/v1/public/training`, "GET");
        setTraining(response.data);
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true initially

    const fetchDataAndTraining = async () => {
      try {
        await fetchData();
        await fetchTraining();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchDataAndTraining();
  }, [userInfo]);

  useEffect(() => {
    // mendapatkan data attendance terakhir di setiap training  
    if (data.length > 0 && training.length > 0) {
      try {
        const mergedDataArray = [];
        training.forEach(trainingItem => {
          const matchingData = data.find(dataItem => dataItem.idAttendance.id_trainingclass.id_trainingclass === trainingItem.id_trainingclass);
          if (matchingData) {
            // menyimpan data training shortname, id trainingclass, date valid to
            mergedDataArray.push({
              trainingShortName: trainingItem.short_name,
              trainingId: trainingItem.id_trainingclass,
              validTo: matchingData.idAttendance.valid_to
            });
          } else {
            mergedDataArray.push({
              trainingShortName: trainingItem.short_name,
              trainingId: trainingItem.id_trainingclass,
              validTo: null
            });
          }
        });
        setMergedData(mergedDataArray);
      } catch (error) {
        console.error("Error while processing data:", error);
      }
    }
  }, [data, training]);


  const renderItem = ({ item }) => {
    // menampilkan list history tiap training
    const handlePress = () => {
      router.push({ pathname: `trainee/classhistory/${item.trainingId}`, params: { name: item.trainingShortName } });
    };

    return (
      <CardPilotClass
        text={item.trainingShortName}
        subtext={item.validTo ? `${formatDate(item.validTo)}` : ''}
        status={`${statusDate(item.validTo)}`}
        showIcon={false}
        onPress={handlePress}
      />
    );
  };

  return (
    <View style={{ backgroundColor: COLORS.white, height: "100%" }}>
      <Loader visible={isLoading} />
      <StatusBar style='light' />
      <BackgroundDefault />
      <View style={{ paddingHorizontal: 20, paddingTop: 50, paddingBottom: 60}}>
        <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>History Class</Text>
        <FlatList
          data={mergedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.trainingId.toString()}
        />
      </View>
    </View>
  );
}
