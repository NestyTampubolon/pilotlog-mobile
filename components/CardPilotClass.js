import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from './colors';
import success from '../assets/modal/success.png';
import warning from '../assets/modal/warning.png';
import failed from '../assets/modal/failed.png';


const getImageSource = (status) => {
    switch (status) {
        case 'success':
            return success;
        case 'warning':
            return warning;
        case 'failed':
            return failed;
        default:
            return null; // Return null jika status tidak dikenali
    }
};

const CardPilotClass = (props) => {
    const { showIcon = true } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress} activeOpacity={0.8}>
            <View style={{ flex: 3 }}>
                <Image style={styles.circular} source={getImageSource(props.status)} />
            </View>
            <View style={styles.item}>
                <TouchableOpacity style={styles.itemLeft} onPress={props.onPress} activeOpacity={0.3}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ fontSize: props.subtext ?  14 : 16, marginVertical: props.subtext ? 0 : 8,  }}>{props.text}</Text>
                        {props.subtext &&
                            <Text style={{
                                fontSize: 10,
                                color: COLORS.grey,
                                paddingVertical: 2,
                                borderRadius: 5,
                                textAlign: 'center'
                            }}>Valid To : {props.subtext}
                            </Text>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            {showIcon &&
                <View style={{ flex: 2, alignContent: 'center' }}>
                    <Icon name="chevron-right" style={{ fontSize: 20, color: COLORS.grey }} />
                </View>
            }
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginHorizontal: 3,
        marginVertical: 5,
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10

    },
    description: {
        flex: 1,
        borderRadius: 10,

    },
    item: {
        flex: 15,

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
        flexWrap: 'wrap'
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
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center'
    },
});

export default CardPilotClass;
