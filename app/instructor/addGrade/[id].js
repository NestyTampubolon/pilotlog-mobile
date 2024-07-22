import { View, Text, StyleSheet, Switch, FlatList, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import COLORS from '../../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { authenticatedRequest, IMAGE_BASE_URL } from '../../Api/ApiManager';
import profiles from '../../../assets/profile.jpg';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Loader from '../../../components/Loader';
export default function addGrade() {
    const { id, name, id_attendancedetail, hub, photo_profile } = useLocalSearchParams();
    const [data, setData] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [number, setNumber] = React.useState('');
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(false);

    // menampilkan daftar statement
    const fetchData = async () => {
        try {
            const response = await authenticatedRequest(`/api/v1/instructor/statements`, "GET");
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
                    defaultRating={ratings[item.id] || 1}
                />
            </View>
        );
    };

    // fungsi untuk menambah grade
    const handleButton = async () => {
        try {
            setLoading(true);
            const attendanceDetailData = {
                score: number,
                grade: isEnabled ? 'PASS' : 'FAIL',
                description : text 
            };
            const ratingsData = Object.keys(ratings).reduce((acc, itemId) => {
                acc[itemId] = ratings[itemId];
                return acc;
            }, {});
            const response = await authenticatedRequest(`/api/v1/instructor/addgrade/${id_attendancedetail}`, "PUT", { attendanceDetail: attendanceDetailData, ratings: ratingsData });
            if (response.status === 200) {
                router.back();
                setLoading(false);
            } else {
                console.error(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const [text, setText] = useState('');

    const handleTextChange = (value) => {
        setText(value);
    };


    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Loader visible={loading} />
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <ScrollView>
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => router.back()}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Add Grade</Text>
                    <Text></Text>
                </View>
              
                 <View flexDirection='row' style={styles.box}>
                    <View style={{ flex: 1 }}>
                            <Image style={styles.circular} source={photo_profile ? { uri: IMAGE_BASE_URL + 'profile/' + photo_profile } : profiles} /> 
                    </View>
                    <View style={{ flex: 4 }}>
                        <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>{name}</Text>
                        <RowWithTwoItems leftText="HUB" rightText={hub} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.black, fontWeight: 'bold', flex: 3 }}>Grade</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                            <Text style={{ color: COLORS.black, fontWeight: 'bold', flex: 3 }}>{isEnabled ? 'PASS' : 'FAIL'}</Text>
                        </View>
    
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>Score</Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeNumber}
                        value={number}
                        placeholder="Enter Grade"
                        keyboardType="numeric"
                    />
                </View>
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_statements.toString()}
                />
                <Text style={{ color: COLORS.black, fontWeight: 'bold' }}>Description</Text>
                <TextInput
                    multiline
                    numberOfLines={4} 
                    onChangeText={handleTextChange}
                    value={text}
                    placeholder="Type here..."
                    style={{ borderWidth: 0.6, borderColor: 'gray', padding: 10, marginBottom: 10, padding: 10, backgroundColor: COLORS.light, borderStyle: 'dashed', }}
                />
                <TouchableOpacity style={[styles.inputContainer, { backgroundColor: COLORS.darkBlue, textAlign: 'center' }]} onPress={handleButton}>
                    <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Save Grade</Text>
                </TouchableOpacity>
               
                
            </View> 
            </ScrollView>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        paddingTop: 50,
        paddingHorizontal: 20,
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
