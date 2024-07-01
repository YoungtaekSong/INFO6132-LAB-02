import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    title: string;
}

const Header: React.FC<Props> = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center'
    },
    headerText: {
        fontSize: 26,
        color: "#752cb0"
    }
});

export default Header;