import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from './colors';
import profiles from '../assets/profile.jpg';

const CardReviews = (props) => {
    return (  
            props.description ? <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.circular} source={props.images} />
                    {props.name ? <Text style={{ fontWeight: 'bold' }}>{props.name}</Text> : null}
                </View>
                <View style={styles.item}>
                    {props.description ?
                        <Text style={{ color: COLORS.black }}>
                            {props.description}
                        </Text>
                        :
                        <Text style={{ color: COLORS.black }}>

                        </Text>
                    }
                </View>
            </View > : <View></View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.light,
        flexDirection: 'column',
        borderRadius: 10,
        marginRight: 15,
        padding: 15,
        marginTop:5,
        marginBottom:5
    },
    item: {
        alignItems: 'left',
        paddingVertical: 10,

    },
    circular: {
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        marginRight: 10
    },
});

export default CardReviews;
