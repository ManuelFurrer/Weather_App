import React, { useState } from 'react'
import { StyleSheet, Text, View, PermissionsAndroid, Image, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { getViewstate } from '../store/viewstate'

export default function App ({ navigation }) {
  const [weatherImg, setWeatherImg] = useState(undefined)
  const [city, setCity] = useState('')
  const [weatherInfo, setWeatherInfo] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [temperatureValue, setTemperatureValue] = useState('')

  const inDevelopment = process.env.NODE_ENV

  async function getWeatherData (location) {
    const apikey = 'apikey'
    try {
      const temperatureUnit = getViewstate('temperatureUnit')
      const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?${location}&appid=${apikey}&lang=de&units=${temperatureUnit}`)
      const data = await result.json()

      if (data.cod === 200) {
        setCity(data.name)
        setWeatherInfo(data.weather[0].description)

        const sign = (temperatureUnit === 'metric') ? '°C' : (temperatureUnit === 'imperial') ? '°F' : 'K'
        setTemperatureValue(data.main.temp + ' ' + sign)

        setWeatherImg(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
      } else if (data.cod === '404' || data.cod === '400') {
        alert(data.message)
      } else {
        alert('Something went wrong')
      }
    } catch (err) {
      alert('Something went wrong')
      if (inDevelopment === 'development') { console.error(err.message) }
    }
  }

  async function doClickGetUserCoords () {
    try {
      const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (alreadyGranted) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = position.coords
            getWeatherData(`lat=${coords.latitude}&lon=${coords.longitude}`)
          },
          (error) => {
            alert('Something went wrong')
            if (inDevelopment) { console.log(error) }
          }
        )
      } else {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if (granted === PermissionsAndroid.RESULTS.GRANDET) {
          if (inDevelopment) { console.log('Access grandet') }
          doClickGetUserCoords()
        } else {
          if (inDevelopment) { console.log('Access denied') }
        }
      }
    } catch (err) {
      if (inDevelopment === 'development') { console.error(err) }
    }
  }

  function doSubmitEditing () {
    const location = (getViewstate('searchExpr') === 'city') ? `q=${cityInput}` : `zip=${cityInput},${getViewstate('country')}`
    getWeatherData(location)
  }

  function getPageContent () {
    if (!city) {
      return (<Text style={styles.noDataInfoText}>Gib einen Ort ein um das Wetter anzuzeigen</Text>)
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.textCity}>{city}</Text>
          <Text style={styles.textWeatherInfo}>{weatherInfo}</Text>
          <Text style={styles.textTemperature}>{temperatureValue}</Text>
          <Image
            style={styles.image}
            source={{
              uri: weatherImg
            }}
          />
        </View>)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Icon.Button
          style={{ marginLeft: -10 }}
          size={30}
          backgroundColor="transparent"
          name="settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder="Ort"
          value={cityInput}
          onSubmitEditing={() => doSubmitEditing()}
          onChangeText={text => setCityInput(text)}
        />
        <Icon.Button
          style={{ marginLeft: 15 }}
          size={30}
          backgroundColor="transparent"
          name="location-pin"
          onPress={() => doClickGetUserCoords()}
        />
      </View>

      {getPageContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#546FD2',
  },
  headerContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  image: {
    width: 80,
    height: 80,
    marginTop: 10
  },
  textInputStyle: {
    width: 200,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 8,
    color: '#000000',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    height: 30,
    marginTop: 9
  },
  textCity: {
    marginTop: 30,
    fontSize: 30,
    color: '#FFFFFF'
  },
  textWeatherInfo: {
    marginTop: 10,
    color: '#EFEFEF'
  },
  textTemperature: {
    marginTop: 20,
    fontSize: 60,
    color: '#FFFFFF'
  },
  noDataInfoText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 80
  }
});
