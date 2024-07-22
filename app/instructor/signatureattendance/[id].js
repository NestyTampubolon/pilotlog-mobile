import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import COLORS from '../../../components/colors';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import SignatureScreen from 'react-native-signature-canvas';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { authenticatedRequest } from '../../Api/ApiManager';
import { formatDate } from '../../../components/utils';

export default function signatureattendance() {
    const { id } = useLocalSearchParams();
    const [signatureKey, setSignatureKey] = useState(0);
    const signatureRef = useRef();
    const [signature, setSign] = useState(null);
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);

    // mendapatkan attendance berdasarkan ibu
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

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to proceed.');
        }
    };
    const handleClear = useCallback(() => {
        if (signatureRef.current) {
            signatureRef.current.clearSignature();
            setSign(null);
            setIsSignatureEmpty(true);
            setSignatureKey(prevKey => prevKey + 1);
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (signature) {
            const fileName = `${Date.now()}-signature.png`;
            const filePath = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(filePath, signature, {
                encoding: FileSystem.EncodingType.Base64,
            });

            onSave(filePath);
        }
    }, [signature]);

    // fungsi untuk mendapatkan, dan menyimpan tanda tangan
    const handleOK = async (signature) => {
        setSign(signature);
        try {
            const response = await authenticatedRequest(`/api/v1/instructor/attendancesignature/${id}`, "PUT",  
            {signature});
            if (response.status === 200) {
                router.push('(tabsinstructor)');
            } else {
                // Logika lain jika diperlukan
            }
        } catch (error) {
            console.log('Error checking JWT token validity:', error.message);
            //  logout();
        }
    };


    useEffect(() => {
        requestCameraPermission();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style='light' />
            <BackgroundDefault />
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => router.back()}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white }} /></TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Attendance</Text>
                    <Text></Text>
                </View>
                <Text style={{ color: COLORS.black, fontSize: 12 }}>Class Detail</Text>
                {data && <View style={styles.box}>
                    <RowWithTwoItems leftText="Class" rightText={data.id_trainingclass?.name} />
                    <RowWithTwoItems leftText="Date" rightText={formatDate(data.date)} />
                    <RowWithTwoItems leftText="Department" rightText={data.department} />
                    <RowWithTwoItems leftText="Instructor" rightText={data.id_instructor?.name} />
                    {data.signature ? (
                        <View></View>
                    ) :(
                        <View style={styles.signatureContainer}>
                            <Text style={{ color: COLORS.black, fontSize: 12, marginTop: 20 }}>Class Detail</Text>
                            <SignatureScreen
                                key={signatureKey}
                                ref={signatureRef}
                                onClear={handleClear}
                                onOK={handleOK}
                                scrollEnabled={false}
                                descriptionText="Sign here"
                                imageBackgroundColor="#FFFFFF"
                                clearText="Clear"
                                confirmText="Save"
                                strokeWidth={5}
                                strokeColor="black"
                                style={{ width: 300, height: 200, borderRadius: 100 }}
                                webStyle={{
                                    padding: 20,
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: '#000000',
                                    backgroundColor: '#FFFFFF',
                                }}
                            />
                        </View>
                 ) }


                </View>
                
                }
            </View>
        </View>
    );
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
