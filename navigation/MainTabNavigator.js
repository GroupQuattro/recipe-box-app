import React from 'react';
import { Platform, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PageNotFound from '../screens/PageNotFound';
import UserProfileFormScreen from '../screens/UserProfileFormScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import SecurityQuestionScreen from '../screens/SecurityQuestionScreen';
import DevScreen from '../screens/DevScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResults from '../components/SearchResults';
import VerificationScreen from '../screens/VerificationScreen';
const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: <Text style={{ fontSize: 14 }}> Home </Text>,
  size: 30,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home'}
    />
  ),
};

HomeStack.path = '';

const AccountStack = createStackNavigator(
  {
    //    Register: RegisterScreen,
    UserProfile: UserProfileScreen,
    UserAccount: UserProfileFormScreen,
    ForgotPassword: ForgotPasswordScreen,

    SecurityQuestion: SecurityQuestionScreen,

    Verification: VerificationScreen,
    CreateCookbook: PageNotFound,
    ChangeEmail: PageNotFound,
    ChangePassword: ChangePasswordScreen,

  },
  config
);

AccountStack.navigationOptions = {
  tabBarLabel: <Text style={{ fontSize: 14 }}> Profile </Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'account'} />
  ),
};

AccountStack.path = '';

const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
    Results: SearchResults,
  },
  config
);

SearchStack.navigationOptions = {
  tabBarLabel: <Text style={{ fontSize: 14 }}> Search </Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'magnify'} />
  ),
};

SearchStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: <Text style={{ fontSize: 14 }}> Settings </Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'settings'} />
  ),
};

SettingsStack.path = '';

const OptionsStack = createStackNavigator(
  {
    Options: DevScreen,
  },
  config
);

OptionsStack.navigationOptions = {
  tabBarLabel: <Text style={{ fontSize: 14 }}> Options </Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'camera-control'} />
  ),
};

OptionsStack.path = '';

const tabNavigator = createMaterialBottomTabNavigator({
  HomeStack,
  AccountStack,
  SearchStack,
  SettingsStack,
  OptionsStack
}, {
    inactiveColor: '#BDBDBD',
    activeColor: '#FFFFFF',
    barStyle: { backgroundColor: "#C2185B" }
  });

tabNavigator.path = '';
export default tabNavigator;