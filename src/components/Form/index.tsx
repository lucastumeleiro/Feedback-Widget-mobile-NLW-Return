import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { captureScreen } from 'react-native-view-shot'
import * as FileSystem from 'expo-file-system'

import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { api } from '../../libs/api';

import { FeedbackType } from '../Widget';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../Button';

import { styles } from './styles';

interface FormProps {
    feedbackType: FeedbackType;
    onFeedbackCanceled: () => void;
    onFeedbackSent: () => void;
}

export function Form(props: FormProps) {
    const { feedbackType, onFeedbackCanceled, onFeedbackSent } = props
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [comment, setComment] = useState<string>('')
    const [isSendingFeedback, setIsSendingFeedback] = useState(false)

    const feedbackTypeInfo = feedbackTypes[feedbackType]

    function handleScreenshot() {
        captureScreen({
            format: 'jpg',
            quality: 0.8
        })
            .then(uri => setScreenshot(uri))
            .catch(error => console.error(error))
    }

    function handleScreenshotRemove() {
        setScreenshot(null)
    }

    async function handleSendFeedback() {
        if (isSendingFeedback) {
            return
        }
        setIsSendingFeedback(true)
        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' })

        try {
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: `data:image/png;base64,${screenshotBase64}`,
                comment: comment
            })

            onFeedbackSent()

        } catch (error) {
            console.error(error)
            setIsSendingFeedback(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onFeedbackCanceled}>
                    <ArrowLeft
                        size={24}
                        weight="bold"
                        color={theme.colors.text_secondary}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Image
                        source={feedbackTypeInfo.image}
                        style={styles.image}
                    />
                    <Text style={styles.titleText}>
                        {feedbackTypeInfo.title}
                    </Text>
                </View>
            </View>

            <TextInput
                multiline
                style={styles.input}
                placeholder="Conte com detalhes o que está acontecendo..."
                placeholderTextColor={theme.colors.surface_secondary}
                autoCorrect={false}
                onChangeText={setComment}
            />
            <View style={styles.footer}>
                <ScreenshotButton
                    onTakeShot={handleScreenshot}
                    onRemoveShot={handleScreenshotRemove}
                    screenshot={screenshot}
                />
                <Button
                    onPress={handleSendFeedback}
                    isLoading={isSendingFeedback}
                />
            </View>

        </View>
    )
}