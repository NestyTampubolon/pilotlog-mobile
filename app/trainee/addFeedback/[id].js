import { View, Text, StyleSheet, Switch, FlatList, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import COLORS from '../../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authenticatedRequest } from '../../Api/ApiManager';
import profiles from '../../../assets/profile.jpg';
import { Rating, AirbnbRating } from 'react-native-ratings';
export default function addFeedback() {
    const {  id } = useLocalSearchParams();
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [number, setNumber] = React.useState('');
    const [ratings, setRatings] = useState({});

    const [text, setText] = useState('');

    const handleTextChange = (value) => {
        setText(value);
    };

    // menampilan data statements yang sudah dilakukan tiap hari
    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/trainee/statements`, "GET");
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

    const onChangeNumber = (text) => {
        const inputNumber = parseInt(text);
        if (text === '' || (parseInt(text) >= 0 && parseInt(text) <= 100)) {
            setNumber(text);
        }
    };



    const handleRating = (ratingValue, itemId) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [itemId]: ratingValue
        }));
    };
    const renderItem = ({ item }) => {

        return (
            <View style={styles.rating}>
                <Text style={{ textAlign: 'center', paddingVertical: 5 }}>{item.content}</Text>
                <View
                    style={{
                        borderBottomColor: COLORS.grey,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <AirbnbRating
                    reviewSize={12}
                    size={20}
                    onFinishRating={(ratingValue) => handleRating(ratingValue, item.id_statements)}
                    defaultRating={ratings[item.id] || 0}
                />
            </View>
        );
    };


    // fungsi yang digunakan untuk menamabah assesment
    const handleButton = async () => {
        try {
            const attendanceDetailData = {
                feedback: text
            };
            const ratingsData = Object.keys(ratings).reduce((acc, itemId) => {
                acc[itemId] = ratings[itemId];
                return acc;
            }, {});
            console.log(ratingsData);
            const response = await authenticatedRequest(`/api/v1/trainee/addAssessment/${id}`, "POST", { attendanceDetail: attendanceDetailData, ratings: ratingsData });
            console.log(response.status);
            if (response.status === 200 || response.status === 201) {
                router.back();
            } else {
                console.error(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };



    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.back()}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Add Feedback</Text>
                    <Text></Text>
                </View>
                <FlatList
                    // scrollEnabled={false}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_statements.toString()}
                />
                <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>Feedback</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={handleTextChange}
                    value={text}
                    placeholder="Type here..."
                    style={{ borderWidth: 0.6, borderColor: 'gray', padding: 10, marginBottom: 10, padding: 10, backgroundColor: COLORS.light, borderStyle: 'dashed', }}
                />
                <TouchableOpacity style={[styles.inputContainer, { backgroundColor: COLORS.darkBlue, textAlign: 'center' }]} onPress={handleButton}>
                    <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
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
        marginBottom: 20
    },
    circular: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.backColor,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
    rating: {
        marginVertical: 10,
        borderWidth: 0.3,
        borderColor: COLORS.grey,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    input: {
        height: 40,
        margin: 12,
        borderRadius: 5,
        padding: 10,
        backgroundColor: COLORS.light
    },
    inputContainer: {
        width: '100%',
        height: 55,
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
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
