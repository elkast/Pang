// =============================================================================
// IvoCulture — Écran Éditer Profil
// Modification des informations + photo (LocalStorage)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
let ImagePicker: typeof import('expo-image-picker') | null = null;
try { ImagePicker = require('expo-image-picker'); } catch {}
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useAuthContext } from '../context/AuthContext';
import api from '../api/client';
import type { RootStackParamList } from '../navigation/AppNavigator';

const PHOTO_PROFIL_KEY = 'photo_profil_uri';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranEditerProfil() {
    const navigation = useNavigation<Nav>();
    const { utilisateur, recharger } = useAuthContext();
    const [chargement, setChargement] = useState(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(PHOTO_PROFIL_KEY).then((uri) => uri && setPhotoUri(uri));
    }, []);

    const choisirPhoto = async () => {
        if (!ImagePicker) {
            Alert.alert('Info', 'Installez expo-image-picker : npx expo install expo-image-picker');
            return;
        }
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission', 'Accès à la galerie requis.');
                return;
            }
            const result = await ImagePicker!.launchImageLibraryAsync({
                mediaTypes: (ImagePicker as any).MediaTypeOptions?.Images ?? 1,
                allowsEditing: true,
                aspect: [1, 1],
            });
            if (!result.canceled && result.assets[0]?.uri) {
                await AsyncStorage.setItem(PHOTO_PROFIL_KEY, result.assets[0].uri);
                setPhotoUri(result.assets[0].uri);
            }
        } catch {
            Alert.alert('Erreur', 'Impossible de charger la photo.');
        }
    };

    const [formulaire, setFormulaire] = useState({
        username: utilisateur?.username || '',
        nom_complet: utilisateur?.nom_complet || '',
        email: utilisateur?.email || '', // L'email ne peut souvent pas être mis à jour si ce n'est pas permis par l'API
        telephone: utilisateur?.telephone || '',
        bio: utilisateur?.bio || '',
        pays: utilisateur?.pays || '',
        ville: utilisateur?.ville || '',
    });

    const gererMiseAJour = async () => {
        if (!formulaire.username.trim() || !formulaire.email.trim()) {
            Alert.alert('Erreur', 'L\'email et le nom d\'utilisateur sont requis.');
            return;
        }

        setChargement(true);
        try {
            // L'API attend UserUpdate (username, nom_complet, bio, telephone, pays, ville)
            const payload = {
                username: formulaire.username,
                nom_complet: formulaire.nom_complet,
                telephone: formulaire.telephone,
                bio: formulaire.bio,
                pays: formulaire.pays,
                ville: formulaire.ville,
            };

            await api.patch('/profil/moi', payload);
            await recharger();

            Alert.alert('Succès', 'Profil mis à jour avec succès.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (erreur: any) {
            console.error('Erreur de mise à jour:', erreur);
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil. Vérifiez votre connexion.');
        } finally {
            setChargement(false);
        }
    };

    return (
        <View style={styles.conteneur}>
            <View style={styles.entete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.boutonRetour}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                </TouchableOpacity>
                <Text style={styles.titreEntete}>Éditer le Profil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContenu} showsVerticalScrollIndicator={false}>
                <View style={styles.groupePhoto}>
                    <TouchableOpacity style={styles.avatar} onPress={choisirPhoto}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="camera" size={32} color={Couleurs.texte.secondaire} />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.labelPhoto}>Photo de profil (stockage local)</Text>
                </View>
                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Nom d'utilisateur *</Text>
                    <TextInput
                        style={styles.champ}
                        value={formulaire.username}
                        onChangeText={(t) => setFormulaire({ ...formulaire, username: t })}
                        placeholder="Votre pseudo"
                        placeholderTextColor={Couleurs.texte.secondaire}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Email (lecture seule)</Text>
                    <TextInput
                        style={[styles.champ, styles.champDesactive]}
                        value={formulaire.email}
                        editable={false}
                        selectTextOnFocus={false}
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Nom Complet</Text>
                    <TextInput
                        style={styles.champ}
                        value={formulaire.nom_complet}
                        onChangeText={(t) => setFormulaire({ ...formulaire, nom_complet: t })}
                        placeholder="Koffi Jean"
                        placeholderTextColor={Couleurs.texte.secondaire}
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Téléphone</Text>
                    <TextInput
                        style={styles.champ}
                        value={formulaire.telephone}
                        onChangeText={(t) => setFormulaire({ ...formulaire, telephone: t })}
                        placeholder="+225 00 00 00 00 00"
                        keyboardType="phone-pad"
                        placeholderTextColor={Couleurs.texte.secondaire}
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Pays</Text>
                    <TextInput
                        style={styles.champ}
                        value={formulaire.pays}
                        onChangeText={(t) => setFormulaire({ ...formulaire, pays: t })}
                        placeholder="Côte d'Ivoire"
                        placeholderTextColor={Couleurs.texte.secondaire}
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Ville</Text>
                    <TextInput
                        style={styles.champ}
                        value={formulaire.ville}
                        onChangeText={(t) => setFormulaire({ ...formulaire, ville: t })}
                        placeholder="Abidjan"
                        placeholderTextColor={Couleurs.texte.secondaire}
                    />
                </View>

                <View style={styles.groupeEntree}>
                    <Text style={styles.label}>Biographie courte</Text>
                    <TextInput
                        style={[styles.champ, styles.champZoneTexte]}
                        value={formulaire.bio}
                        onChangeText={(t) => setFormulaire({ ...formulaire, bio: t })}
                        placeholder="Quelques mots sur vous..."
                        placeholderTextColor={Couleurs.texte.secondaire}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.boutonSauvegarder, chargement && styles.boutonDesactive]}
                    onPress={gererMiseAJour}
                    disabled={chargement}
                >
                    {chargement ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.texteBouton}>Sauvegarder les modifications</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    entete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
        backgroundColor: Couleurs.fond.primaire,
        borderBottomWidth: 1,
        borderBottomColor: Couleurs.fond.surface,
    },
    boutonRetour: {
        padding: 4,
    },
    titreEntete: {
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
        color: Couleurs.texte.primaire,
    },
    scrollContenu: {
        padding: 20,
        paddingBottom: 40,
    },
    groupePhoto: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Couleurs.fond.surface,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    labelPhoto: {
        marginTop: 8,
        fontSize: Typographie.tailles.sm,
        color: Couleurs.texte.secondaire,
    },
    groupeEntree: {
        marginBottom: 16,
    },
    label: {
        fontSize: Typographie.tailles.sm,
        color: Couleurs.texte.secondaire,
        marginBottom: 8,
        fontWeight: '500',
    },
    champ: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.md,
        padding: 14,
        fontSize: Typographie.tailles.md,
        color: Couleurs.texte.primaire,
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
    },
    champDesactive: {
        backgroundColor: Couleurs.fond.surface,
        color: Couleurs.texte.secondaire,
    },
    champZoneTexte: {
        height: 100,
    },
    boutonSauvegarder: {
        backgroundColor: Couleurs.accent.principal,
        paddingVertical: 16,
        borderRadius: Rayons.lg,
        alignItems: 'center',
        marginTop: 10,
    },
    boutonDesactive: {
        opacity: 0.7,
    },
    texteBouton: {
        color: '#FFF',
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.bold,
    },
});
