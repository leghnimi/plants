import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function WorkerInputScreen() {
    const [greenhouses, setGreenhouses] = useState([]);
    const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    console.log('date is', date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    console.log('time is', time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

    useEffect(() => {
        const fetchGreenhouses = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/greenhouses`);
                const data = await response.json();
                setGreenhouses(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGreenhouses();
    }, [])

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };
    
    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(false);
        setTime(currentTime);
    };

    return (
        <View style={styles.container}>
        <View style={styles.datePicker}>
            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode={'date'}
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.buttonText}>Choisir date</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.datePicker}>
            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={time}
                    mode={'time'}
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            )}
            <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.buttonText}>choisir temps</Text>
            </TouchableOpacity>
        </View>
            <View style={styles.inputContainer}>
                <Text style={{fontSize:14}}>Veillez choisir la seree ci dessous</Text>
                <View style={styles.pickerContainer}>
                    <MaterialCommunityIcons name="greenhouse" size={20} color="#000" />
                    <Picker
                        selectedValue={selectedGreenhouse}
                        onValueChange={(itemValue) => setSelectedGreenhouse(itemValue)}
                        style={styles.picker}
                    >
                        {greenhouses.map((greenhouse, index) => (
                            <Picker.Item key={index} label={greenhouse.greenhouseName} value={greenhouse.greenhouseName} />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    picker: {
        flex: 1,
    },
    datePicker: {
        padding: 10,
        marginTop: 10,
        width: '50%',
    },
    inputContainer: {
        width: '100%',
        padding: 10,
    },
    button: {
        backgroundColor: 'green',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
    },
})