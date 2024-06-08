import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import WeatherCard from '../components/weatherCard';
import MapComponent from '../components/MapComponent';
import PlantCard from '../components/PlantCard';
import GreenhouseSensorsCard from '../components/GreenhouseSensorsCard';
import { Picker } from '@react-native-picker/picker';


export default function GreenhouseDetails({ route }) {
    
    const { id } = route.params
    const [greenhouseDetails, setGreenhouseDetails] = useState(null);
    const [weather, setWeather] = useState(null);
    const [plant, setPlants] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());


    useEffect(() => {
        const fetchGreenhouseDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/greenhouse/${id}`);
                const data = await response.json();
                setGreenhouseDetails(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGreenhouseDetails();
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            if (greenhouseDetails) {
                const latitude = greenhouseDetails.location.latitude;
                const longitude = greenhouseDetails.location.longitude;

                try {
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=1`);
                    const data = await response.json();
                    setWeather(data);
                } catch (err) {
                    console.error(err);
                }
            }
        }
        fetchWeather();
    }, [greenhouseDetails])

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/plants/${greenhouseDetails?.plantType}`);
                const data = await response.json();
                setPlants(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchPlants();
    }, [greenhouseDetails])


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/background.jpg')} style={styles.image} />
            <Text style={styles.title}>Details serre</Text>
            <ScrollView>
                <View style={styles.detailsHeader}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.plantsContainer}>
                            <View style={{ flexShrink: 1, alignItems: 'baseline' }}>
                                <Text style={{ color: 'green' }}>
                                    {greenhouseDetails?.numberOfPlants} plantes
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 30, padding: 10 }}>{greenhouseDetails?.greenhouseName}</Text>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                            <FontAwesome6 name="map-location-dot" size={15} color="#808080" />
                            <Text style={{ color: '#808080', paddingLeft: 10 }}>{greenhouseDetails?.city}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 14 }}>
                        {greenhouseDetails?.location ? (
                            <MapComponent
                                latitude={greenhouseDetails?.location.latitude}
                                longitude={greenhouseDetails?.location.longitude}
                            />
                        ) : null}
                    </View>
                </View>
                <WeatherCard
                    wind={weather?.current.wind_speed_10m}
                    temperature={weather?.current.temperature_2m}
                    humidity={weather?.current.relative_humidity_2m}
                />
                <View style={styles.cardContainer}>
                    <Text style={styles.titles}>Plantes</Text>
                    <PlantCard
                        imageSource={plant?.plantPicture}
                        title={plant?.plantName}
                        description={plant?.description}
                    />
                    <Text style={styles.titles}>Mesures</Text>
                    <Picker
                        selectedValue={selectedDate}
                        onValueChange={(itemValue) => setSelectedDate(itemValue)}
                        style={{ width: '100%', backgroundColor: 'white', borderRadius: 10, marginBottom: 20 }}
                    >
                        {greenhouseDetails?.sensors.map((sensor, index) => (
                            <Picker.Item key={index} label={new Date(sensor.date).toLocaleDateString()} value={sensor.date} />
                        ))}
                    </Picker>
                    <View style={{ flex: 1 }}>
                        {greenhouseDetails?.sensors.filter(sensor => sensor.date === selectedDate).map((sensor, index) => {
                            let date = new Date(sensor.date);
                            let formattedDate = date.toLocaleDateString();
                            return (
                                <View key={index}>
                                    {sensor.data.map((data, dataIndex) => {
                                        let time = new Date(data.time);
                                        let formattedTime = time.toLocaleTimeString();
                                        return (
                                            <GreenhouseSensorsCard
                                                key={dataIndex}
                                                date={formattedDate}
                                                time={formattedTime}
                                                sensors={{
                                                    temperature: data.temperature,
                                                    humidity: data.humidity,
                                                    light: data.light,
                                                    soilMoisture: data.soilMoisture,
                                                    soilTemp: data.soilTemp,
                                                    note: data.note
                                                }}
                                            />
                                        )
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    detailsHeader: {
        padding: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 20,
        margin: 10,
    },
    plantsContainer: {
        flexDirection: 'row',
        backgroundColor: '#ccf5cb',
        borderRadius: 45,
        padding: 10,
        marginTop: 25,
        width: '70%',
        justifyContent: 'center',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    titles: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color:'white'
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    title: {
        marginTop:'10%',
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
})  
