import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera'; 

export default function App() {
  // Estados originales del login
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Estado para controlar el escaneo de QR en tiempo real
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Función genérica para mostrar el resultado del escaneo
  const showScanResult = (data) => {
    Alert.alert(
      'Código QR Escaneado',
      `Datos: ${data}`,
      [
        // Al presionar OK, limpiamos los datos y volvemos a la vista principal
        { text: 'OK', onPress: () => { setScannedData(null); setIsScanningQR(false); } }
      ]
    );
  };

  const validarLogin = () => {
    const validUser = 'admin';
    const validPass = '1234';
    if (user === validUser && pass === validPass) {
      Alert.alert('Correcto', 'Inicio de sesión exitoso');
      setLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  // Función para escanear desde la galería (Decodificación de imagen estática)
  const escanearDesdeGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a las imágenes de la galería');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri); // Mostrar la imagen seleccionada

      // ----------------------------------------------------------------------------------
      // NOTA IMPORTANTE:
      // La decodificación de QR desde una imagen estática (URI) requiere una librería
      // dedicada (ej. 'expo-barcode-scanner' con una función de decodificación estática,
      // o una librería de terceros) que pueda leer el QR desde la imagen.
      // ----------------------------------------------------------------------------------
      
      // Simulamos un resultado ya que no podemos decodificar el QR de la imagen estática aquí:
      if (selectedUri) {
          const simulatedData = `QR_simulado_desde_galeria_${Date.now()}`;
          setScannedData(simulatedData);
          Alert.alert(
              'Imagen Seleccionada para Escaneo',
              `La imagen ha sido cargada. En una aplicación real, el código QR contenido en la imagen se decodificaría aquí.\nResultado Simulado: ${simulatedData}`,
              [{ text: 'OK', onPress: () => setScannedData(null) }]
          );
      }
    }
  };

  // Función para iniciar el escaneo de QR en tiempo real con la cámara
  const iniciarEscaneoQR_TiempoReal = async () => {
    if (!permission) {
      Alert.alert('Cargando', 'Esperando permisos de la cámara...');
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permiso denegado', 'Necesitas dar permiso para usar la cámara para escanear QR.');
        return;
      }
    }
    
    // Limpiar datos escaneados anteriores y activar el escaneo
    setScannedData(null); 
    setIsScanningQR(true);
  };
  
  // Función que se llama cuando se detecta un código QR en tiempo real
  const handleBarCodeScanned = ({ data }) => {
    if (!scannedData) { // Asegura que solo se procese una vez
        setScannedData(data);
        showScanResult(data);
    }
  };

  // --- Lógica de la vista de escaneo QR en tiempo real ---
  if (isScanningQR) {
    if (!permission || !permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Acceso a la Cámara</Text>
          <Text style={styles.textCenter}>Permiso de cámara no concedido.</Text>
          <Button title="Dar Permiso" onPress={requestPermission} />
          <Button title="Volver" onPress={() => setIsScanningQR(false)} color="gray" />
        </View>
      );
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView 
          // Solo escanear si no se ha escaneado un dato todavía
          onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned} 
          barcodeScannerSettings={{
            barcodeTypes: ['qr'] // Configurado para solo QR
          }}
          style={StyleSheet.absoluteFill} 
          facing='back' 
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>Apunte al Código QR</Text>
            <View style={styles.qrMarker} />
          </View>
        </CameraView>
        
        <View style={styles.cameraButtonContainer}>
          <Button title="Cancelar Escaneo" onPress={() => setIsScanningQR(false)} color="#dc3545" />
        </View>
      </View>
    );
  }
  
  // --- Lógica de la vista de Login y Principal (Home) ---
  return (
    <SafeAreaView style={styles.container}>
      {!loggedIn ? (
        <View style={styles.box}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            placeholder="Usuario"
            style={styles.input}
            value={user}
            onChangeText={setUser}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={validarLogin}>
            <Text style={styles.btnText}>Entrar :D </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.title}>Bienvenido {user}</Text>
          <Image
            source={{ uri: imageUri || 'https://placehold.co/120x120/A0A0A0/ffffff?text=Imagen+Usuario' }}
            style={styles.image}
          />
          
          <Button 
            title="1. Escanear QR desde Cámara (Tiempo Real)" 
            onPress={iniciarEscaneoQR_TiempoReal} 
            color="#28a745" 
          /> 
          
          <View style={{ marginTop: 10, width: '100%' }}>
            <Button 
              title="2. Escanear QR desde Galería (Foto)" 
              onPress={escanearDesdeGaleria} 
              color="#007bff"
            />
          </View>
          
          <View style={{ marginTop: 20 }}>
             <Button title="Cerrar Sesión" onPress={() => setLoggedIn(false)} color="#6c757d" />
          </View>
          
          {scannedData && (
             <Text style={styles.dataDisplay}>Último dato QR escaneado: {scannedData}</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  box: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  dataDisplay: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#e9ecef',
      borderRadius: 5,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#495057',
      width: '100%',
  },
  // Estilos específicos para la vista de escaneo QR
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    position: 'absolute',
    top: 50,
  },
  qrMarker: {
    width: 250,
    height: 250,
    borderWidth: 5,
    borderColor: '#00ff00',
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});