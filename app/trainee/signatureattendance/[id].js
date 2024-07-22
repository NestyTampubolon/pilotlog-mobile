import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import COLORS from '../../../components/colors';
import { StatusBar } from 'expo-status-bar';
import BackgroundDefault from '../../../components/background';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import SignatureScreen from 'react-native-signature-canvas';
import { router, Stack, useLocalSearchParams, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticatedRequest } from '../../Api/ApiManager';
import { formatDate } from '../../../components/utils';

export default function signatureattendance() {
    const { id } = useLocalSearchParams();
    const { width } = Dimensions.get('window');
    const [signatureKey, setSignatureKey] = useState(0);
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
    const signatureRef = useRef();
    const [signature, setSign] = useState(null);

    const [data, setData] = useState([]);
    const [loading, setLoading] = React.useState(false);


    // menam9poam data attendance detail
    const fetchData = async () => {
        try {
            console.log(id);
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

    // mendapatkan data attendance detail
    const handleOK = async (signature) => {
        setSign(signature);
        try {
            const response = await authenticatedRequest(`/api/v1/trainee/attendancedetailsiganture/${id}`, "PUT",  
            {signature});
            if (response.status === 200) {
                router.push('(tabs)');
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
<TouchableOpacity onPress={() => router.back()} style={{ flex:1}}><Icon name="chevron-left" style={{ fontSize: 25, color: COLORS.white}} /></TouchableOpacity>
          <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold', flex: 8 }}>Attendance</Text>
          <Text  style={{ flex:1}} ></Text>
                </View>
                <Text style={{ color: COLORS.black, fontSize: 12 }}>Class Detail</Text>
                {data && <View style={styles.box}>
                    <RowWithTwoItems leftText="Class" rightText={data.idAttendance?.id_trainingclass?.name} />
                    <RowWithTwoItems leftText="Date" rightText={formatDate(data.idAttendance?.date)} />
                    <RowWithTwoItems leftText="Department" rightText={data.idAttendance?.department} />
                    <RowWithTwoItems leftText="Instructor" rightText={data.idAttendance?.id_instructor?.name} />
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
                {/* <View style={styles.preview}>
                    {signature ? (
                        <Image
                            resizeMode={"contain"}
                            style={{ width: 335, height: 114 }}
                            source={{ uri: signature }}
                        />
                    ) : null}
                </View> */}
                
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !signature && { backgroundColor: '#ccc' },
                        ]}
                        onPress={signature ? handleSave : null}
                        disabled={!signature}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleClear}>
                        <Text style={styles.buttonText}>Clear</Text>
                    </TouchableOpacity>
                </View> */}
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
