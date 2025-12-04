import React, { useState, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert, 
  Button, 
  Linking
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false);
  
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  
  const handleScanResult = async (data) => {
    setScannedData(data);
    setIsScanningQR(false);

    try {
      await Linking.openURL(data);
      Alert.alert(
        'Enlace Abierto', 
        `Se intentó abrir: ${data}`
      );
    } catch (error) {
      Alert.alert(
        'Datos Escaneados', 
        `No se pudo abrir como enlace, mostrando datos: ${data}`,
        [{ text: 'OK' }]
      );
    }
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
    
    setScannedData(null); 
    setIsScanningQR(true);
  };
  
  const handleBarCodeScanned = ({ data }) => {
    if (!scannedData) { 
        handleScanResult(data);
    }
  };

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
          onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned} 
          barcodeScannerSettings={{
            barcodeTypes: ['qr'] 
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
            title="Escanear Código QR" 
            onPress={iniciarEscaneoQR_TiempoReal} 
            color="#28a745" 
          /> 
          
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