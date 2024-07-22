import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, Link } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from './colors';

const CardTraining = (props) => {
    const { showIcon = true } = props;

    const checkValidity = (validToTimestamp) => {
        if (!validToTimestamp) {
            return 'NO DATA';
        }
        const currentDateTimestamp = Date.now();
        if (currentDateTimestamp < validToTimestamp) {
            return 'VALID';
        } else {
            return 'NOT VALID';
        }
    };

    const getColor = (validity) => {
        switch (validity) {
            case 'VALID':
                return COLORS.green;
            case 'NOT VALID':
                return COLORS.red;
            case 'NO DATA':
                return '#FFFFFF'; // Putih untuk tidak ada data
            default:
                return COLORS.white;
        }
    };
    const validToTimestamp = props.valid_to;

    const validity = checkValidity(validToTimestamp);
    const backgroundColor = getColor(validity);


    return (
        <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 10 }} onPress={props.onPress} activeOpacity={0.8}>
            <View style={[styles.container, { backgroundColor: backgroundColor }]} >
                <View style={styles.description}></View>
                <View style={styles.item}>
                    <TouchableOpacity style={styles.itemLeft} onPress={props.onPress} activeOpacity={0.3}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 14 }}>{props.text}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {props.subtext &&
                                    <Text style={{
                                        fontSize: 10,
                                        color: COLORS.white,
                                        backgroundColor: props.subtext === 'Pending' ? COLORS.grey :
                                            props.subtext === 'Confirmation' ? COLORS.darkBlue :
                                                props.subtext === 'Done' ? COLORS.green : 'transparent',
                                        borderRadius: 5,
                                        paddingVertical: 3,
                                        paddingHorizontal: 5
                                    }}>
                                        {props.subtext}
                                    </Text>
                                }
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showIcon && 
                    <Icon name="chevron-right" style={{ fontSize: 20, color: COLORS.grey, flex: 1 }} />}
                </View>
            </View>
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 5,
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
    description: {
        flex: 1,
        borderRadius: 10,

    },
    item: {
        flex: 15,
        backgroundColor: '#FFF',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,

    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        flex:8
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: '#55BCF6',
        opacity: 0.4,
        borderRadius: 5,
        marginRight: 15
    },
    // itemText: {
    //     maxWidth: '80%'
    // },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5
    },
});

export default CardTraining;
