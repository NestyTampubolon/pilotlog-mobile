import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Stack, useLocalSearchParams, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import COLORS from '../../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CardTraining from '../../../components/CardTraining';
import { authenticatedRequest, IMAGE_BASE_URL } from '../../Api/ApiManager';
import { formatDate } from '../../../components/utils';
import EmptyList from '../../../components/emptylist';
import { Rating, AirbnbRating } from 'react-native-ratings';
import CardReviews from '../../../components/CardReviews';
import profiles from '../../../assets/profile.jpg';


export default function review() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [trainee, setTrainee] = useState([]);
    const [averageRating, setAverageRating] = useState([]);

    // mendapatkan data review
    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/cpts/attendance/${id}`, "GET");
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


    // mendapatkan detail dari attedance
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
             <CardReviews
                name={item.idTrainee.name}
                description={item.feedback}
                images={item.idTrainee.photo_profile ? { uri: IMAGE_BASE_URL + 'profile/' + item.idTrainee.photo_profile } : profiles}
             />
        );
    };

    const ratingsData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/cpts/assessmentbyidattendance/${id}`, "GET");
            // setData(response.data);
            const ratings = response.data.map(item => item.rating);

            // Menghitung total rating
            const totalRating = ratings.reduce((acc, curr) => acc + curr, 0);

            // Menghitung rata-rata rating
            const averageRating = totalRating / ratings.length;
            const formattedAverageRating = averageRating.toFixed(1);

            setAverageRating(formattedAverageRating);
            console.log('Average rating:', formattedAverageRating);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ratingsData();
    }, []);


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ flex: 1 }}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 8 }}>Review</Text>
                    <Text style={{ flex: 1 }} ></Text>
                </View>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 48, justifyContent: 'center', paddingTop: 10, textAlign: 'center' }}>{averageRating}</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={averageRating}
                        reviewSize={0}
                        size={10}
                    />
                    <Text style={{ fontSize: 12, justifyContent: 'center', paddingTop: 10, textAlign: 'center', color: COLORS.grey }}>based on {trainee.length} reviews</Text>
                </View>
                {trainee.length != 0 && <FlatList
                    scrollEnabled={false}
                    data={trainee}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_attendancedetail.toString()}
                />}

    
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
    box: {
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.backColor,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
    signatureContainer: {
        width: '100%',
        height: 400,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.black,
        marginTop: 20,
        overflow: 'hidden',
        zIndex: 1,
        borderStyle: 'dashed',
        padding: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        zIndex: 1,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkBlue,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    preview: {
        width: 200,
        height: 114,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    previewText: {
        color: "#FFF",
        fontSize: 14,
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#69B2FF",
        width: 120,
        textAlign: "center",
        marginTop: 10,
    },
});