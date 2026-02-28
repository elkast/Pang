// =============================================================================
// IvoCulture — Écran Connexion Générique (accès rapide "déjà un compte")
// =============================================================================

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
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

export default function EcranConnexion() {
    const navigation = useNavigation<Nav>();
    const { seConnecter } = useAuth();
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [afficherMdp, setAfficherMdp] = useState(false);

    const gererConnexion = async () => {
        if (!email || !motDePasse) { setErreur('Veuillez remplir tous les champs.'); return; }
        setChargement(true);
        setErreur('');
        try {
            await seConnecter(email, motDePasse);
            navigation.replace('Principal');
        } catch (err: any) {
            setErreur(err?.message || 'Identifiants incorrects ou API indisponible. Inscrivez-vous pour le mode hors-ligne.');
        } finally {
            setChargement(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Couleurs.fond.primaire} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bouton retour */}
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <TouchableOpacity style={styles.retour} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={22} color={Couleurs.texte.primaire} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* En-tête */}
                    <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.entete}>
                        <Text style={styles.titre}>Bon retour 👋</Text>
                        <Text style={styles.sousTitre}>Reconnectez-vous à vos racines.</Text>
                    </Animated.View>

                    {/* Formulaire */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Ionicons name="alert-circle-outline" size={16} color={Couleurs.etat.erreur} />
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

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
                    </Animated.View>

                    {/* Séparateur */}
                    <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.separateur}>
                        <View style={styles.ligne} />
                        <Text style={styles.ouTexte}>ou</Text>
                        <View style={styles.ligne} />
                    </Animated.View>

                    {/* Liens vers les espaces typés */}
                    <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.espaces}>
                        <TouchableOpacity
                            style={[styles.boutonEspace, { borderColor: Couleurs.foret.principal }]}
                            onPress={() => navigation.navigate('ConnexionLocal')}
                        >
                            <Text style={styles.espaceEmoji}>🏠</Text>
                            <Text style={[styles.espaceTexte, { color: Couleurs.foret.principal }]}>Espace Local</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.boutonEspace, { borderColor: '#9B59B6' }]}
                            onPress={() => navigation.navigate('ConnexionTouriste')}
                        >
                            <Text style={styles.espaceEmoji}>✈️</Text>
                            <Text style={[styles.espaceTexte, { color: '#9B59B6' }]}>Espace Touriste</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Inscription */}
                    <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.footer}>
                        <Text style={styles.footerTexte}>Pas encore de compte ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Inscription')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.footerLien}>S'inscrire</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 22, paddingVertical: 16 },
    retour: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center', justifyContent: 'center',
        alignSelf: 'flex-start', marginBottom: 24,
    },
    entete: { marginBottom: 28 },
    titre: { color: Couleurs.texte.primaire, fontSize: 30, fontWeight: '800' },
    sousTitre: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.lg, marginTop: 6 },
    boiteErreur: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: '#FFF0F0', borderRadius: Rayons.md,
        padding: 14, marginBottom: 14,
        borderLeftWidth: 3, borderLeftColor: Couleurs.etat.erreur,
    },
    texteErreur: { color: Couleurs.etat.erreur, fontSize: Typographie.tailles.sm, flex: 1 },
    separateur: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
    ligne: { flex: 1, height: 1, backgroundColor: Couleurs.fond.surface },
    ouTexte: { color: Couleurs.texte.desactive, fontSize: Typographie.tailles.sm },
    espaces: { flexDirection: 'row', gap: 12 },
    boutonEspace: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 6,
        borderWidth: 1.5, borderRadius: Rayons.lg,
        paddingVertical: 12,
    },
    espaceEmoji: { fontSize: 18 },
    espaceTexte: { fontWeight: '700', fontSize: Typographie.tailles.sm },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
    footerTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.md },
    footerLien: { color: Couleurs.accent.principal, fontWeight: '700', fontSize: Typographie.tailles.md },
});
