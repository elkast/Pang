// =============================================================================
// IvoCulture — Écran d'Inscription
// Formulaire : nom, email, mot de passe
// =============================================================================

import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, Typographie } from '../constantes';
import { ChampSaisie, BoutonPrincipal } from '../composants';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranInscription() {
    const navigation = useNavigation<Nav>();
    const { inscrire } = useAuth();

    const [nomUtilisateur, setNomUtilisateur] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');

    const gererInscription = async () => {
        if (!nomUtilisateur || !email || !motDePasse) {
            setErreur('Veuillez remplir tous les champs.');
            return;
        }
        if (motDePasse.length < 6) {
            setErreur('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        setChargement(true);
        setErreur('');
        try {
            await inscrire(nomUtilisateur, email, motDePasse);
            Alert.alert('Succès', 'Compte créé ! Veuillez vous connecter.');
            navigation.navigate('Connexion');
        } catch (error: any) {
            setErreur(error.response?.data?.detail || "Erreur lors de l'inscription.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.conteneur}>
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <Text style={styles.titre}>Créer un compte</Text>
                        <Text style={styles.sousTitre}>
                            Rejoignez la communauté culturelle ivoirienne
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

                        <ChampSaisie
                            label="Nom d'utilisateur"
                            icone="person-outline"
                            placeholder="Votre pseudo"
                            value={nomUtilisateur}
                            onChangeText={setNomUtilisateur}
                            autoCapitalize="none"
                        />

                        <ChampSaisie
                            label="Email"
                            icone="mail-outline"
                            placeholder="votre@email.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <ChampSaisie
                            label="Mot de passe"
                            icone="lock-closed-outline"
                            placeholder="Minimum 6 caractères"
                            value={motDePasse}
                            onChangeText={setMotDePasse}
                            secureTextEntry
                        />

                        <BoutonPrincipal
                            titre="S'inscrire"
                            onPress={gererInscription}
                            chargement={chargement}
                            couleur={Couleurs.foret.principal}
                            style={{ marginTop: 8 }}
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Connexion')}
                            style={styles.lien}
                        >
                            <Text style={styles.texteLien}>
                                Déjà un compte ?{' '}
                                <Text style={styles.texteLienAccent}>Se connecter</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scroll: { flexGrow: 1 },
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    titre: {
        color: Couleurs.or.principal,
        fontSize: Typographie.tailles.titre,
        fontWeight: Typographie.poids.bold,
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        marginTop: 4,
        marginBottom: 32,
    },
    boiteErreur: {
        backgroundColor: '#3D1F1F',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    texteErreur: {
        color: Couleurs.etat.erreur,
        fontSize: Typographie.tailles.md,
    },
    lien: {
        marginTop: 24,
        alignItems: 'center',
    },
    texteLien: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
    },
    texteLienAccent: {
        color: Couleurs.accent.vert,
        fontWeight: Typographie.poids.bold,
    },
});
