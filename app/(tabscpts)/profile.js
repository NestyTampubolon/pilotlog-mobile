import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, Platform, TouchableOpacity, KeyboardAvoidingView, Keyboard, ScrollView, Button } from 'react-native';
import profiles from './../../assets/profile.jpg';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../components/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundDefault from '../../components/background';
import { useJwtAuth } from '../Api/jwtAuth';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import { authenticatedRequest, IMAGE_BASE_URL } from '../Api/ApiManager';
import { Dropdown } from 'react-native-element-dropdown';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import Loader from '../../components/Loader';
import CustomModal from '../../components/CustomModal';

export default function Page() {
    const [userInfo, setUserInfo] = useState();
    const { logout } = useJwtAuth();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const snapPoints = ["50%", "48%"];


    const [modalVisible, setModalVisible] = useState(false);
    const [modeModal, setModeModal] = useState();
    const [messageModal, setMessageModal] = useState();

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    function handleKeyModal() {
        bottomSheetModalRef.current?.present();
    }


    const bottomSheetModalRef = useRef(null);

    const [inputs, setInputs] = React.useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = React.useState({
        newPassword: '',
        confirmPassword: ''
    });


    const handleError = (errorMessage, input) => {
        setErrors(prevState => ({ ...prevState, [input]: errorMessage }));
    }

    const handleOnChange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    // fungsi ubah password 
    const validate = async () => {
        Keyboard.dismiss();
        let valid = true;
        if (!inputs.newPassword) {
            handleError('Please input new password', 'newPassword');
            valid = false;
        } else if (inputs.newPassword.length < 8) {
            handleError('Password must be at least 8 characters', 'newPassword');
            valid = false;
        }

        if (!inputs.confirmPassword) {
            handleError('Please input confirm password', 'confirmPassword');
            valid = false;
        }

        if (inputs.newPassword !== inputs.confirmPassword) {
            handleError('Passwords do not match', 'newPassword');
            handleError('Passwords do not match', 'confirmPassword');
            valid = false;
        } else {
            handleError(null, 'confirmPassword');
        }

        // jika sudah di validasi lakukan ubah password
        if (valid) {
            try {
                const response = await authenticatedRequest(`/api/v1/public/changepassword/${userInfo.id_users}`, "PUT", { password: inputs.newPassword });
                if (response.status === 200) {
                    console.error('Success');
                    bottomSheetModalRef.current?.close();
                } else {
                    console.error('Error fetching data:');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }


        }
    };


    const data = userInfo && userInfo.role ? (
        userInfo.role === 'TRAINEE_INSTRUCTOR_CPTS' ?
            [
                { label: 'TRAINEE', value: '1' },
                { label: 'INSTRUCTOR', value: '2' },
                { label: 'CPTS', value: '3' },
            ] :
            userInfo.role === 'INSTRUCTOR_CPTS' ?
                [
                    { label: 'INSTRUCTOR', value: '2' },
                    { label: 'CPTS', value: '3' },
                ] :
                userInfo.role === 'TRAINEE_CPTS' ?
                    [
                        { label: 'TRAINEE', value: '1' },
                        { label: 'CPTS', value: '3' },
                    ] :
                    userInfo.role === 'TRAINEE_INSTRUCTOR' ?
                        [
                            { label: 'TRAINEE', value: '1' },
                            { label: 'INSTRUCTOR', value: '2' },
                        ] :
                        []
    ) : [];


    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                    Login As
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        if(userInfo && userInfo.photo_profile){
             setImage(IMAGE_BASE_URL+'profile/'+userInfo.photo_profile);
        }
    }, [fetchUserInfo]);

    useEffect(() => {
        setValue(2);
    }, []);

    async function fetchUserInfo() {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleItemChange = (item) => {
        // Lakukan sesuatu dengan item yang dipilih, misalnya tampilkan nilainya
        console.log('Item yang dipilih:', item);
        // Atau simpan nilai item yang dipilih ke dalam state jika perlu
        if (item == 1) {
            router.replace('(tabs)');
        } else if (item == 2) {
            router.replace('(tabsinstructor)');
        }
    };



    const pickImage = async () => {
        setLoading(true); // Mengatur loading ke true saat pengguna memilih gambar
        try {
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log(result);

            if (!result.canceled) {
                // Mengambil data blob gambar dari URL
                const blobData = await fetchBlobData(result.assets[0].uri);
                const blobSizeInMb = blobData.size / (1024 * 1024); // Menghitung ukuran blob dalam MB
                if (blobSizeInMb < 1) { // Memeriksa apakah ukuran blob kurang dari 1 MB
                    setImage(result.assets[0].uri);
                    await changeProfile(result.assets[0].uri);
                } else {
                    setModalVisible(true);
                    setModeModal("failed");
                    setMessageModal("Image size exceeds 1 MB");
                }
            }
        } catch (error) {
            console.error('Error picking image:', error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchBlobData = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error fetching blob data:', error);
            throw error;
        }
    };

    const changeProfile = async (imageUrl) => {
        try {
            if (userInfo) {
                setLoading(true);
                const formData = new FormData();
                formData.append('profile', {
                    uri: imageUrl,
                    name: 'photo.jpg',
                    type: 'image/png',
                });
                const response = await authenticatedRequest(`/api/v1/public/users/update/profile/${userInfo.id_users}`, "PUT", formData, 'multipart/form-data');
                if (response.status === 200) {
                    //   console.error('Success');

                } else {
                    console.error('Error fetching data:');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Loader visible={loading} />
            <BottomSheetModalProvider>
                <StatusBar style='light' />
                <BackgroundDefault />
                <ScrollView>
                    {userInfo && (
                        <View style={{ paddingHorizontal: 20, paddingTop: 50, alignItems: 'center' }}>
                            <Text style={{ color: COLORS.white, fontSize: 17, textAlign: "center", paddingBottom: 40, fontWeight: 'bold' }}>Profile</Text>
                            {/* <Image style={styles.circular} source={profiles} /> */}
                            <View style={imageUploaderStyles.container}>
                                {
                                    image && <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
                                }
                                <View style={imageUploaderStyles.uploadBtnContainer}>
                                    <TouchableOpacity onPress={pickImage} style={imageUploaderStyles.uploadBtn} >
                                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                                        <AntDesign name="camera" size={15} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{ color: COLORS.lightBlue, fontSize: 17, textAlign: "center", marginVertical: 10, fontWeight: 'bold' }}>{userInfo.name}</Text>
                            {/* <View style={styles.container}>
                                <Button title="Pick an image from camera roll" onPress={pickImage} />
                                {image && <Image source={{ uri: image }} style={styles.image} />}
                            </View> */}
                            <View style={styles.box}>
                                <RowWithTwoItems leftText="Rank" rightText={userInfo.rank} />
                                <RowWithTwoItems leftText="HUB" rightText={userInfo.hub} />
                                {userInfo.license_no && <RowWithTwoItems leftText="LICENSE" rightText={userInfo.license_no} />}
                                <View style={{
                                    flexDirection: 'row',
                                    paddingTop: 10,
                                }}>
                                </View>
                            </View>

                            {userInfo && userInfo.role && userInfo.role != 'CPTS' && (
                                <View style={styles.subContainer}>
                                    {renderLabel()}
                                    <Dropdown
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                        data={data}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder={!isFocus ? 'Login as' : '...'}
                                        value={value}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {

                                            setValue(item.value);
                                            setIsFocus(false);
                                            handleItemChange(item.value);
                                        }}
                                    />
                                </View>
                            )}

                            <TouchableOpacity style={[styles.inputContainer]} onPress={handleKeyModal}>
                                <Icon name='lock-outline' style={{ fontSize: 22, color: COLORS.grey, marginRight: 10, flex: 1 }} />
                                <View style={{ flex: 8 }}>
                                    <Text style={{ color: COLORS.black, fontSize: 12, fontWeight: 'bold' }}>Change Password</Text>
                                </View>

                                <Icon
                                    style={{ fontSize: 22, color: COLORS.grey, flex: 1 }}
                                    name="chevron-right" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.inputContainer, { borderColor: COLORS.red, marginTop: 12 }]} onPress={logout}>
                                <Icon name='logout' style={{ fontSize: 22, color: COLORS.red, marginRight: 10, flex: 1 }} />
                                <View style={{ flex: 8 }}>
                                    <Text style={{ color: COLORS.red, fontSize: 12, fontWeight: 'bold' }}>Log Out</Text>
                                </View>

                                <Icon
                                    style={{ fontSize: 22, color: COLORS.red, flex: 1 }}
                                    name="chevron-right" />
                            </TouchableOpacity>


                            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                <BottomSheetModal
                                    ref={bottomSheetModalRef}
                                    index={0}
                                    snapPoints={snapPoints}
                                    backgroundStyle={{ borderRadius: 50 }}
                                    avoidKeyboard={true}
                                >
                                    <View style={{ backgroundColor: 'white', padding: 16 }}>
                                        <Text style={{ fontWeight: 'bold', justifyContent: 'center', textAlign: 'center' }}>Change Password</Text>
                                        <Input placeholder="Enter your new password" iconName="account-key-outline" label="New Password" password
                                            onChangeText={text => handleOnChange(text, 'newPassword')}
                                            error={errors.newPassword}
                                            onFocus={() => {
                                                handleError(null, 'newPassword');
                                            }}
                                        />
                                        <Input placeholder="Enter your confirm password" iconName="account-key-outline" label="Confirm Password" password
                                            onChangeText={text => handleOnChange(text, 'confirmPassword')}
                                            error={errors.confirmPassword}
                                            onFocus={() => {
                                                handleError(null, 'confirmPassword');
                                            }}
                                        />
                                        <TouchableOpacity style={[styles.inputContainer, { backgroundColor: COLORS.darkBlue, marginTop: 12, textAlign: 'center', justifyContent:'center'}]} onPress={validate}>
                                            <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </BottomSheetModal>
                            </KeyboardAvoidingView>
                            <View>
                                <CustomModal modeModal={modeModal} isVisible={modalVisible} onClose={closeModal} message={messageModal} />
                            </View>
                        </View>
                    )}
                    {!userInfo && <Text>No user info found</Text>}
                </ScrollView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 200,
        height: 200,
    },
    subContainer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        width: '100%',
        marginTop: 12
    },
    buttonContainer: {
        backgroundColor: COLORS.darkBlue,
        width: 40,
        height: 40,
        borderRadius: 25, // Membuatnya bulat dengan setengah dari lebar/tinggi
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    icon: {
        fontSize: 30,
        color: 'white',
    },
    circular: {
        width: 150,
        height: 150,
        borderWidth: 2,
        borderRadius: 100
    },
    status: {
        backgroundColor: COLORS.green,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    box: {
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: COLORS.white,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 0.5,
    },
    inputContainer: {
        width: '100%',
        height: 55,
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginTop: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        alignItems: 'center',
    },
    dropdown: {
        height: 55,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 10,
        top: 4,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 12,
    },
    placeholderStyle: {
        fontSize: 12,
    },
    selectedTextStyle: {
        fontSize: 12,
    },
});

const imageUploaderStyles = StyleSheet.create({
    container: {
        elevation: 2,
        height: 150,
        width: 150,
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
    },
    uploadBtnContainer: {
        opacity: 0.7,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: '25%',
    },
    uploadBtn: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    }
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
}