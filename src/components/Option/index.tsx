import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Image, ImageProps, Text } from 'react-native';

import { Copyright } from 'phosphor-react-native';

import { styles } from './styles';

interface OptionsProps extends TouchableOpacityProps {
    title: string;
    image: ImageProps;
}

export function Option(props: OptionsProps) {
    const { title, image, ...rest } = props;

    return (
        <TouchableOpacity
            style={styles.container}
            {...rest}
        >
            <Image
                source={image}
                style={styles.image}
            />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}