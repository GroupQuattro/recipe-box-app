import React from 'react';


import { Title, Headline, Subheading, Surface, Button, Drawer, Appbar } from 'react-native-paper';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import TopNavbar from '../components/TopNavbar';

export default function PageNotFound() {
  return (
    <SafeAreaView style={{flex:3}}>
  <TopNavbar title='Home'></TopNavbar>
    <ScrollView>
      <Headline style={{margin:10}}>Not Found. Check back later.</Headline>

    </ScrollView>
    </SafeAreaView>
  );
}

PageNotFound.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});