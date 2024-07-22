import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from './colors';
import profiles from '../assets/profile.jpg';

const CardAttendance = (props) => {
    const { showIcon = true } = props;
    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress} activeOpacity={0.8}>
            <View style={{ flex: 3 }}>
                <Image style={styles.circular} source={ props.images } />
            </View>
            <View style={styles.item}>
                <TouchableOpacity style={styles.itemLeft} onPress={props.onPress} activeOpacity={0.3}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 14 }}>{props.text}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {props.subtext ?
                                <Text style={{
                                    fontSize: 10,
                                    color: COLORS.grey,
                                    backgroundColor: props.subtext === 'PASS' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                                    paddingHorizontal: 10,
                                    paddingVertical: 2,
                                    borderRadius: 5,
                                    textAlign: 'center'
                                }}>
                                    {props.subtext}
                                </Text>

                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name="alert-circle-outline" style={{ fontSize: 12, color: COLORS.red }} />
                                    <Text style={{
                                        fontSize: 10,
                                        color: COLORS.red,
                                        paddingHorizontal: 3,
                                        paddingVertical: 2,
                                        borderRadius: 5,
                                        textAlign: 'center'
                                    }}>

                                        Please add grade!
                                    </Text>
                                </View>


                            }

                            {props.score &&
                                <Text style={{
                                    fontSize: 10,
                                    color: COLORS.grey,
                                    backgroundColor: COLORS.light,
                                    paddingHorizontal: 10,
                                    paddingVertical: 2,
                                    borderRadius: 5,
                                    textAlign: 'center',
                                    marginLeft: 10
                                }}>
                                    <Icon name="star" style={{ fontSize: 12, color: COLORS.darkBlue }} />
                                    {props.score} / 100
                                </Text>
                            }

                        </View>
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
        marginHorizontal: 5,
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

export default CardAttendance;
