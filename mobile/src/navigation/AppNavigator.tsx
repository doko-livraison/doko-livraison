import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

// Client screens
import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import CreateMissionScreen from '../screens/client/CreateMissionScreen';
import MissionDetailScreen from '../screens/shared/MissionDetailScreen';
import MyMissionsScreen from '../screens/client/MyMissionsScreen';

// Transporter screens
import TransporterHomeScreen from '../screens/transporter/TransporterHomeScreen';
import TransporterMissionsScreen from '../screens/transporter/TransporterMissionsScreen';
import TransporterProfileScreen from '../screens/transporter/TransporterProfileScreen';
import ProofDeliveryScreen from '../screens/transporter/ProofDeliveryScreen';
import TransporterProfileSetupScreen from '../screens/transporter/TransporterProfileSetupScreen';
import ChatScreen from '../screens/shared/ChatScreen';
import ReviewScreen from '../screens/shared/ReviewScreen';

// Shared
import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Accueil" component={ClientHomeScreen} />
      <Tab.Screen name="Mes missions" component={MyMissionsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function TransporterTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Missions" component={TransporterHomeScreen} />
      <Tab.Screen name="Mes livraisons" component={TransporterMissionsScreen} />
      <Tab.Screen name="Profil" component={TransporterProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : user.role === 'transporter' ? (
          <>
            <Stack.Screen name="TransporterMain" component={TransporterTabs} />
            <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
            <Stack.Screen name="ProofDelivery" component={ProofDeliveryScreen} />
            <Stack.Screen name="TransporterProfileSetup" component={TransporterProfileSetupScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </>
        ) : user.role === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="ClientMain" component={ClientTabs} />
            <Stack.Screen name="CreateMission" component={CreateMissionScreen} />
            <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
