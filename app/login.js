import { View, StyleSheet, Button, Image, Keyboard, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Input from '../components/Input';
import { router, Link } from 'expo-router'
import Loader from '../components/Loader';
import app from './../assets/images/logoText.png';
import { useJwtAuth } from './Api/jwtAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../components/colors';
import CustomModal from '../components/CustomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
export default function login() {
  const { login } = useJwtAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [modeModal, setModeModal] = useState();
  const [messageModal, setMessageModal] = useState();
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = React.useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = React.useState({
    email: '',
    password: ''
  });
 
// fungsi login email dan password
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError('Please input email', 'email');
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input valid email', 'email');
      valid = false;
    }

    if (!inputs.password) {
      handleError('Please input password', 'password');
      valid = false;
    }


    if (valid) {
      setLoading(true);
      login(inputs.email, inputs.password, onLoginFailed);
      setLoading(false);
    }
  };


  const onLoginFailed = (errorMessage) => {
    // Tampilkan modal gagal login dengan pesan errorMessage
    setModalVisible(true);
    setModeModal("failed");
    setMessageModal(errorMessage);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  const handleOnChange = (text, input) => {
    setInputs(prevState => ({ ...prevState, [input]: text }));
  };

  const handleError = (errorMessage, input) => {
    setErrors(prevState => ({ ...prevState, [input]: errorMessage }));
  }

  return (
    <View style={styles.container}>
      <Loader visible={loading} />

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image source={app} />
      </View>
    
      <Input placeholder="Enter your email address" iconName="email-outline" label="Email"
        onChangeText={text => handleOnChange(text, 'email')}
        error={errors.email}
        onFocus={() => {
          handleError(null, 'email');
        }}
      />
     
      <Input placeholder="Enter your password" iconName="lock-outline" label="Password" password
        onChangeText={text => handleOnChange(text, 'password')}
        error={errors.password}
      />
     
      <TouchableOpacity style={[styles.buttonLogin]} onPress={validate}>
        <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Log In</Text>
      </TouchableOpacity>
      <View>
        <CustomModal modeModal={modeModal} isVisible={modalVisible} onClose={closeModal} message={messageModal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLogin: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.darkBlue, 
    marginTop: 12, 
    textAlign: 'center'
  },
});