import { View, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { SignInFlow } from './types';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Text } from '@/components/ui/text';
import MaxWidthWrapper from '@/components/shared/MaxWidthWrapper';
import { Button } from '@/components/ui/button';

type AuthNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

const AuthContainer = () => {
    const navigation = useNavigation<AuthNavigationProp>();
    const [state, setState] = useState<SignInFlow>('signIn');

    const handleAuthSuccess = () => {
        // Navigation is now handled automatically by the AuthContext
        // The user will be redirected to the appropriate home screen based on their role
        console.log('✅ Authentication successful - user will be redirected automatically');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <MaxWidthWrapper classNames='flex-1 bg-background'>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='pb-20'>
                            {/* Tab Buttons */}
                            <View className="mb-8 mx-4 flex-row bg-muted rounded-lg p-1">
                                <Button 
                                    className='flex-1' 
                                    onPress={() => setState('signIn')} 
                                    variant={state === 'signIn' ? 'default' : 'ghost'}
                                >
                                    <Text className={state === 'signIn' ? 'text-primary-foreground' : 'text-muted-foreground'}>
                                        Sign in
                                    </Text>
                                </Button>
                                <Button 
                                    className='flex-1' 
                                    onPress={() => setState('signUp')} 
                                    variant={state === 'signUp' ? 'default' : 'ghost'}
                                >
                                    <Text className={state === 'signUp' ? 'text-primary-foreground' : 'text-muted-foreground'}>
                                        Sign up
                                    </Text>
                                </Button>
                            </View>

                            {/* Forms */}
                            <View className="px-4">
                                {state === 'signIn' ? (
                                    <SignInForm
                                        onSwitchToSignUp={() => setState('signUp')}
                                        onAuthSuccess={handleAuthSuccess}
                                    />
                                ) : (
                                    <SignUpForm
                                        onSwitchToSignIn={() => setState('signIn')}
                                        onAuthSuccess={handleAuthSuccess}
                                    />
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </MaxWidthWrapper>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default AuthContainer