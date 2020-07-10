import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';

import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px';

const getPreferenceId = async (payer, ...items) => {
  const response = await fetch('https://api.mercadopago.com/checkout/preferences?access_token=TEST-8899944613814093-070722-6eb36a8fc7f604f4c4bc4e72a4e0df6d-46355069', {
    method: 'POST',
    body: JSON.stringify({
      items,
      payer: {
        email: payer
      }
    })
  });
  const preference = await response.json();
  return preference.id;
}

export default function App() {
  const [payment, setPaymentResult] = useState(null);

  const startCheckout = async () => {
    try {
      const preferenceId = await getPreferenceId('payer@email.com', {
        title: 'Dummy Item Title',
        description: 'Dummy Item Description',
        quantity: 1,
        currency_id: 'MXN',
        unit_price: 10.0
      });

      const payment = await MercadoPagoCheckout.createPayment({
        publicKey: 'TEST-49aa854f-9171-48f1-8a97-fb29855d2d1d',
        preferenceId
      });

      setPaymentResult(payment);
    } catch (error) {
      Alert.alert('Algo salio mal', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startCheckout}>
        <Text>Iniciar pago</Text>
      </TouchableOpacity>
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
});
