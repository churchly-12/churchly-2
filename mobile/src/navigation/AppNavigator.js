import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AdminLoginScreen from '../screens/auth/AdminLoginScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import HomeScreen from '../screens/users/HomeScreen';
import DevotionsScreen from '../screens/users/DevotionsScreen';
import ActivitiesScreen from '../screens/users/ActivitiesScreen';
import CommunityScreen from '../screens/users/CommunityScreen';
// Devotions screens
import RosaryScreen from '../screens/users/RosaryScreen';
import DivineMercyScreen from '../screens/users/DivineMercyScreen';
import StationsOfTheCrossScreen from '../screens/users/StationsOfTheCrossScreen';
import NovenasScreen from '../screens/users/NovenasScreen';
import DailyReadingsScreen from '../screens/users/DailyReadingsScreen';
import FastingGuideScreen from '../screens/users/FastingGuideScreen';
import LiturgyCalendarScreen from '../screens/users/LiturgyCalendarScreen';
import ShortPrayersScreen from '../screens/users/ShortPrayersScreen';
import YouthGroupsScreen from '../screens/users/YouthGroupsScreen';
// Prayer & Testimonial screens
import PrayerWallScreen from '../screens/users/PrayerWallScreen';
import NewPrayerRequestScreen from '../screens/users/NewPrayerRequestScreen';
import PrayerDetailsScreen from '../screens/users/PrayerDetailsScreen';
import TestimonialsScreen from '../screens/users/TestimonialsScreen';
import NewTestimonialScreen from '../screens/users/NewTestimonialScreen';
import TestimonialDetailsScreen from '../screens/users/TestimonialDetailsScreen';
// Settings screens
import SettingsScreen from '../screens/users/SettingsScreen';
import ChangePasswordScreen from '../screens/users/ChangePasswordScreen';
import NotificationSettingsScreen from '../screens/users/NotificationSettingsScreen';
import ContactSupportScreen from '../screens/users/ContactSupportScreen';
import ReportProblemScreen from '../screens/users/ReportProblemScreen';
import MyPrayerRequestsScreen from '../screens/users/MyPrayerRequestsScreen';
import MyTestimonialsScreen from '../screens/users/MyTestimonialsScreen';
import DeleteAccountScreen from '../screens/users/DeleteAccountScreen';
import LogoutScreen from '../screens/users/LogoutScreen';
// Admin screens
import AdminLanding from '../screens/admin/AdminLanding';
import UserManagement from '../screens/admin/UserManagement';
import RoleManagement from '../screens/admin/RoleManagement';
import PrayerManagement from '../screens/admin/PrayerManagement';
import AdminActivities from '../screens/admin/AdminActivities';
import AdminYouthGroups from '../screens/admin/AdminYouthGroups';
import AdminSettings from '../screens/admin/AdminSettings';
import AdminLogout from '../screens/admin/AdminLogout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack - includes Prayer Wall & Testimonials flow
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PrayerWall" component={PrayerWallScreen} />
      <Stack.Screen name="PrayerDetails" component={PrayerDetailsScreen} />
      <Stack.Screen name="NewPrayerRequest" component={NewPrayerRequestScreen} />
      <Stack.Screen name="Testimonials" component={TestimonialsScreen} />
      <Stack.Screen name="TestimonialDetails" component={TestimonialDetailsScreen} />
      <Stack.Screen name="NewTestimonial" component={NewTestimonialScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <Stack.Screen name="MyPrayerRequests" component={MyPrayerRequestsScreen} />
      <Stack.Screen name="MyTestimonials" component={MyTestimonialsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
    </Stack.Navigator>
  );
}

function DevotionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DevotionsMain" component={DevotionsScreen} />
      <Stack.Screen name="Rosary" component={RosaryScreen} />
      <Stack.Screen name="DivineMercy" component={DivineMercyScreen} />
      <Stack.Screen name="StationsOfTheCross" component={StationsOfTheCrossScreen} />
      <Stack.Screen name="Novenas" component={NovenasScreen} />
      <Stack.Screen name="DailyReadings" component={DailyReadingsScreen} />
      <Stack.Screen name="FastingGuide" component={FastingGuideScreen} />
      <Stack.Screen name="LiturgyCalendar" component={LiturgyCalendarScreen} />
      <Stack.Screen name="ShortPrayers" component={ShortPrayersScreen} />
    </Stack.Navigator>
  );
}

function ActivitiesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivitiesMain" component={ActivitiesScreen} />
      <Stack.Screen name="YouthGroups" component={YouthGroupsScreen} />
    </Stack.Navigator>
  );
}

function AdminActivitiesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminActivitiesMain" component={AdminActivities} />
      <Stack.Screen name="AdminYouthGroups" component={AdminYouthGroups} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
   return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>
       <Stack.Screen name="CommunityMain" component={CommunityScreen} />
       <Stack.Screen name="Testimonials" component={TestimonialsScreen} />
       <Stack.Screen name="TestimonialDetails" component={TestimonialDetailsScreen} />
       <Stack.Screen name="NewTestimonial" component={NewTestimonialScreen} />
     </Stack.Navigator>
   );
 }

function UserTabNavigator() {
  // Regular user tabs
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Devotions') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Devotions" component={DevotionsStack} />
      <Tab.Screen name="Activities" component={ActivitiesStack} />
      <Tab.Screen name="Community" component={CommunityStack} />
    </Tab.Navigator>
  );
}

function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Activities') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={AdminLanding} />
      <Tab.Screen name="Users" component={UserManagement} />
      <Tab.Screen name="Activities" component={AdminActivitiesStack} />
      <Tab.Screen name="Settings" component={AdminSettings} />
    </Tab.Navigator>
  );
}

function MainStack({ isAdmin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={isAdmin ? AdminTabNavigator : UserTabNavigator} />
      <Stack.Screen name="Logout" component={isAdmin ? AdminLogout : LogoutScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return null; // or loading screen
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={() => <MainStack isAdmin={user?.isAdmin} />} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
