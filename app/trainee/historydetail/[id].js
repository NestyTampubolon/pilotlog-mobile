import { View, Text, StyleSheet, TouchableOpacity, Platform, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, Stack, useLocalSearchParams,  } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import COLORS from '../../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authenticatedRequest } from '../../Api/ApiManager';
import { formatDate } from '../../../components/utils';
import Certificate from '../certificate';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../components/Loader';
export default function historydetail() {
    const [loading, setLoading] = useState(true);
    const { id, name } = useLocalSearchParams();
    const [data, setData] = useState([]);
    const [existFeedback, setExistFeedback] = useState(false);

    // mendapatkan data attendance detail
    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/public/attendancedetail/${id}`, "GET");
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

    // mendapatkan konfirmasi apakah sudah melakukan feedack atau belum
    const checkFeedbackData = async () => {
                try {
                    const response = await authenticatedRequest(`/api/v1/trainee/checkFeedback/${id}`, "GET");
                    setExistFeedback(response.data);
                } catch (error) {
                    console.error(error);
                }
            };


    useEffect(() => {
        checkFeedbackData();
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            checkFeedbackData();
        }, [])
    );



    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Loader visible={loading} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flex: 1 }}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 8 }}>{name}</Text>
                    <Text style={{ flex: 1 }} ></Text>
                </View>
                <View style={{ alignContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, letterSpacing: 2 }}>Congratulations!</Text>
                    <Text style={{ fontSize: 12, color: COLORS.grey }}>Congratulations for passing the training!</Text>
                    <View style={{ flexDirection: 'row', }}>
                        {existFeedback ? (
                            <Certificate name={data.idTrainee?.name} trainingclass={data.idAttendance?.id_trainingclass?.name} date={data.idAttendance?.date} setLoading={setLoading} />
                        ) : (
                            data && (
                                <TouchableOpacity onPress={() => router.push({ pathname: `trainee/addFeedback/${id}` })} style={[styles.inputContainer, { backgroundColor: COLORS.darkBlue, borderRadius:20 }]}>
                                    <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold' }}>Give Feedback</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </View>
                {data && <View style={styles.box}>
                    <RowWithTwoItems leftText="Class" rightText={data.idAttendance?.id_trainingclass?.name} />
                    <RowWithTwoItems leftText="Date" rightText={formatDate(data.idAttendance?.date)} />
                    <RowWithTwoItems leftText="Valid To" rightText={formatDate(data.idAttendance?.valid_to)} />
                    <RowWithTwoItems leftText="Department" rightText={data.idAttendance?.department} />
                    <RowWithTwoItems leftText="Instructor" rightText={data.idAttendance?.id_instructor?.name} />

                </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        height: '100%',
    },
    contentContainer: {
        paddingTop: 50,
        flex: 1,
        paddingHorizontal: 20,
        zIndex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderWidth: 0.5,
        alignItems: 'center',
        marginTop: 15
    },
    box: {
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.backColor,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
});

const RowWithTwoItems = ({ leftText, rightText }) => {
    return (
        <View style={{
            flexDirection: 'row',
            paddingTop: 10,
        }}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text style={{ color: 'grey', fontSize: 14 }}>{leftText}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ color: 'grey', fontSize: 14 }}>{rightText}</Text>
            </View>
        </View>
    );
};
