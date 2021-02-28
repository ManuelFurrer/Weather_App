import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker'

import { setViewstate, getViewstate } from '../store/viewstate'
import countries from '../components/countries.json'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function App ({ navigation }) {
  const [selectedTemperature, setSelectedTemperature] = useState(getViewstate('temperatureUnit'))
  const [selectedCountry, setSelectedCountry] = useState(getViewstate('country'))
  const [searchExpr, setSearchExpr] = useState(getViewstate('searchExpr'))

  function getCountries () {
    return countries.map((country, i) => {
      return <Picker.Item label={country.name} value={country.code} key={i} />
    })
  }

  function doChangeTemperature (value) {
    setSelectedTemperature(value)
    setViewstate('temperatureUnit', value)
  }

  function doChangeCountry (value) {
    setSelectedCountry(value)
    setViewstate('country', value)
  }

  function RadioButton (selected) {
    return (
      <View style={styles.radioButton}>
        { selected ? <View style={styles.radioButtonProp} /> : null}
      </View>
    )
  }

  function doSwitchRadioBtn (value) {
    setSearchExpr(value)
    setViewstate('searchExpr', value)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Icon.Button
          style={{ marginLeft: -10 }}
          size={30}
          backgroundColor="transparent"
          name="chevron-left"
          onPress={() => navigation.navigate('Home')}
        ><Text style={{ color: 'white' }}>Zurück</Text></Icon.Button>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Suchoption</Text>
        <View style={styles.radioButtonContainer}>
          <Text style={{ color: 'white' }}>Ort</Text>
          <TouchableOpacity onPress={() => doSwitchRadioBtn('city')}>{RadioButton(searchExpr === 'city' ? true : false)}</TouchableOpacity>
        </View>
        <View style={styles.radioButtonContainer}>
          <Text style={{ color: 'white' }}>PLZ</Text>
          <TouchableOpacity onPress={() => doSwitchRadioBtn('zip')}>{RadioButton(searchExpr === 'city' ? false : true)}</TouchableOpacity>
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Temperatur</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedTemperature}
              onValueChange={(value) => doChangeTemperature(value)}
            >
              <Picker.Item label="Celcius" value="metric" />
              <Picker.Item label="Fahrenheit" value="imperial" />
              <Picker.Item label="Kelvin" value="standard" />
            </Picker>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Land</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedCountry}
              onValueChange={(value) => doChangeCountry(value)}
            >
              {getCountries()}
            </Picker>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    width: 200,
    color: 'white',
  },
  pickerContainer: {
    borderColor: 'white',
    borderWidth: 1
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonProp: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  }
});
