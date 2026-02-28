// =============================================================================
// IvoCulture — Écran Connexion Local (thème vert)
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { ChampSaisie, BoutonPrincipal } from '../composants';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
const COULEUR = Couleurs.foret.principal;

export default function EcranConnexionLocal() {
    const navigation = useNavigation<Nav>();
    const { seConnecter } = useAuth();
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [afficherMdp, setAfficherMdp] = useState(false);

    const gererConnexion = async () => {
        if (!email || !motDePasse) { setErreur('Veuillez remplir tous les champs.'); return; }
        setChargement(true); setErreur('');
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
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* Retour */}
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={22} color={Couleurs.texte.primaire} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Badge espace */}
                    <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                        <View style={[styles.badge, { backgroundColor: COULEUR }]}>
                            <Text style={styles.badgeEmoji}>🏠</Text>
                            <Text style={styles.badgeTexte}>Espace Local</Text>
                        </View>
                        <Text style={[styles.titre, { color: COULEUR }]}>Bon retour !</Text>
                        <Text style={styles.sousTitre}>Reconnectez-vous à nos racines.</Text>
                    </Animated.View>

                    {/* Formulaire */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formulaire}>
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Ionicons name="alert-circle-outline" size={16} color={Couleurs.etat.erreur} />
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

                        <ChampSaisie label="Email" icone="mail-outline" placeholder="votre@email.com"
                            value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

                        <ChampSaisie label="Mot de passe" icone="lock-closed-outline" placeholder="••••••••"
                            value={motDePasse} onChangeText={setMotDePasse} secureTextEntry={!afficherMdp}
                            iconeDroite={afficherMdp ? 'eye-off-outline' : 'eye-outline'}
                            onPressIconeDroite={() => setAfficherMdp(!afficherMdp)} />

                        <BoutonPrincipal titre="Se connecter" onPress={gererConnexion}
                            chargement={chargement} couleur={COULEUR} style={{ marginTop: 8 }} />
                    </Animated.View>

                    {/* Footer inscription */}
                    <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.footer}>
                        <Text style={styles.footerTexte}>Pas encore de compte ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Inscription')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={[styles.footerLien, { color: COULEUR }]}>Créer un profil local</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFF' },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 22, paddingVertical: 16 },
    retour: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'flex-start', marginBottom: 20,
    },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: 100, marginBottom: 20,
    },
    badgeEmoji: { fontSize: 18 },
    badgeTexte: { color: '#FFF', fontWeight: '800', fontSize: Typographie.tailles.md },
    titre: { fontSize: 30, fontWeight: '800', lineHeight: 36 },
    sousTitre: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.lg, marginTop: 6, marginBottom: 28 },
    formulaire: { gap: 0 },
    boiteErreur: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFF0F0', borderRadius: Rayons.md,
        padding: 14, marginBottom: 14,
        borderLeftWidth: 3, borderLeftColor: Couleurs.etat.erreur,
    },
    texteErreur: { color: Couleurs.etat.erreur, fontSize: Typographie.tailles.sm, flex: 1 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
    footerTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.md },
    footerLien: { fontWeight: '700', fontSize: Typographie.tailles.md },
});
