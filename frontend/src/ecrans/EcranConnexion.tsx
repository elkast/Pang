// =============================================================================
// IvoCulture — Écran de Connexion
// Formulaire email + mot de passe avec JWT
// =============================================================================

import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs, Typographie } from '../constantes';
import { ChampSaisie, BoutonPrincipal } from '../composants';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranConnexion() {
    const navigation = useNavigation<Nav>();
    const { seConnecter } = useAuth();

    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [afficherMdp, setAfficherMdp] = useState(false);

    const gererConnexion = async () => {
        if (!email || !motDePasse) {
            setErreur('Veuillez remplir tous les champs.');
            return;
        }
        setChargement(true);
        setErreur('');
        try {
            await seConnecter(email, motDePasse);
            navigation.replace('Principal');
        } catch {
            setErreur('Identifiants incorrects ou problème réseau.');
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
                        {/* Logo */}
                        <View style={styles.logoZone}>
                            <Text style={styles.logoEmoji}>🏛️</Text>
                            <Text style={styles.logoTexte}>IvoCulture</Text>
                        </View>

                        {/* Titre */}
                        <Text style={styles.titre}>Bon retour,</Text>
                        <Text style={styles.sousTitre}>
                            Reconnectez-vous à nos racines.
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        {/* Erreur */}
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

                        {/* Formulaire */}
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
                            placeholder="••••••••"
                            value={motDePasse}
                            onChangeText={setMotDePasse}
                            secureTextEntry={!afficherMdp}
                            iconeDroite={afficherMdp ? 'eye-off-outline' : 'eye-outline'}
                            onPressIconeDroite={() => setAfficherMdp(!afficherMdp)}
                        />

                        <BoutonPrincipal
                            titre="Se connecter"
                            onPress={gererConnexion}
                            chargement={chargement}
                            style={{ marginTop: 8 }}
                        />

                        {/* Lien inscription */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Inscription')}
                            style={styles.lienInscription}
                        >
                            <Text style={styles.texteLien}>
                                Pas encore de compte ?{' '}
                                <Text style={styles.texteLienAccent}>Créer un profil</Text>
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
    logoZone: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    logoTexte: {
        color: Couleurs.or.principal,
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: 1,
    },
    titre: {
        color: Couleurs.accent.principal,
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
    lienInscription: {
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
