import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';

export default function App () {
  const [weatherImg, onChangeWeatherImg] = useState('')
  const [city, onChangeCity] = useState('')

  async function doClickShowWeather () {
    const apiId = '078234b00aba953ae546d52635645810'
    try {
      const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiId}&lang=de&units=metric`)
      const data = await result.json()
      console.log(data)
      onChangeWeatherImg(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
    } catch (err) {
      console.error('error', err)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        placeholder="Ort"
        value={city}
        onChangeText={text => onChangeCity(text)}
      />
      <Image
        style={styles.image}
        source={{
          uri: weatherImg
        }}
      />
      <TouchableOpacity
        onPress={() => doClickShowWeather()}
      >
        <Text>Click</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50
  },
  textInputStyle: {
    width: 200,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
});
