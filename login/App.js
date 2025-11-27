import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { CameraView, useCameraPermissions } from 'expo-camera'; 

export default function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [imageUri, setImageUri] = useState(null); 
  const [loggedIn, setLoggedIn] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoUri, setPhotoUri] = useState(null); 

  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

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

  const seleccionarDesdeGaleria = async () => {
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
      setImageUri(result.assets[0].uri);
    }
  };

  const abrirCamara = async () => {
      if (!permission.granted) {
          const result = await requestPermission();
          if (!result.granted) {
              Alert.alert('Permiso denegado', 'Necesitas dar permiso para usar la cámara.');
              return;
          }
      }
      setIsCameraActive(true);
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhotoUri(result.uri); 

    }
  };

  if (isCameraActive) {
    if (!permission) return (
      <View style={styles.container}>
        <Text>Cargando permisos...</Text>
      </View>
    );
    
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text>Necesitas permitir acceso a la cámara</Text>
          <Button title="Dar permiso" onPress={requestPermission} />
        </View>
      );
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            {!photoUri ? (
                <View style={StyleSheet.absoluteFill}>
                    <CameraView 
                        ref={cameraRef} 
                        style={StyleSheet.absoluteFill} 
                        facing='back' 
                    />
                    
                    <View style={styles.cameraButtonContainer}>
                        <Button title="Tomar foto" onPress={takePhoto} />
                        <Button title="Cancelar" onPress={() => setIsCameraActive(false)} color="red" />
                    </View>
                </View>
                
            ) : (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.fullScreenImage} />
                    <View style={styles.cameraButtonContainer}>
                         <Button title="Tomar otra" onPress={() => setPhotoUri(null)} />
                         <Button title="Usar Foto" onPress={() => {setImageUri(photoUri); setPhotoUri(null); setIsCameraActive(false);}} />
                    </View>
                </View>
            )}
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
          <TouchableOpacity onPress={abrirCamara}>
            <Image
              source={{ uri: imageUri || 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' }}
              style={styles.image}
            />
          </TouchableOpacity>
          <Button title="Seleccionar de Galería" onPress={seleccionarDesdeGaleria} /> 
          <Button title="Abrir Cámara" onPress={abrirCamara} style={{ marginTop: 10 }} />
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
  },
  box: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 10,
    marginBottom: 10,
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});