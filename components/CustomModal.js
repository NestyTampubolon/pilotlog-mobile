import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet, Pressable } from 'react-native'
import COLORS from './colors';

export default function CustomModal({ modeModal, isVisible, onClose, message }) {

    const modalImages = {
        failed: require('../assets/modal/failed.png'),
        success: require('../assets/modal/success.png'),
        warning: require('../assets/modal/warning.png'),
    };

    const modalText = {
        failed: "Failed",
        success: "Success",
        warning: "Warning",
    };

    const closeModal = () => {
        onClose();
    };

    const handleButtonOK = () => {
        onButtonPress();
        onClose(); 
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    onClose()
                }}>

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Image source={modalImages[modeModal]} style={{ width: 70 }} />
                        <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 18 }}>{modalText[modeModal]}</Text>
                        <Text style={styles.modalText}>{message}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={closeModal}>
                                <Text style={styles.textStyle}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        borderRadius: 5,
        backgroundColor: COLORS.darkBlue,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 5,
        textAlign: 'center',
        color: COLORS.grey
    },
});
