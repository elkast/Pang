// =============================================================================
// IvoCulture — Écran Connexion Touriste (thème violet)
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
const COULEUR = '#9B59B6';

export default function EcranConnexionTouriste() {
    const navigation = useNavigation<Nav>();
    const { seConnecter } = useAuth();
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [afficherMdp, setAfficherMdp] = useState(false);

    const gererConnexion = async () => {
        if (!email || !motDePasse) { setErreur('Please fill in all fields.'); return; }
        setChargement(true); setErreur('');
        try {
            await seConnecter(email, motDePasse);
            navigation.replace('Principal');
        } catch {
            setErreur('Incorrect credentials or network issue.');
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
                            <Text style={styles.badgeEmoji}>✈️</Text>
                            <Text style={styles.badgeTexte}>Tourist Space</Text>
                        </View>
                        <Text style={[styles.titre, { color: COULEUR }]}>Welcome back!</Text>
                        <Text style={styles.sousTitre}>Discover Ivory Coast's hidden treasures.</Text>
                    </Animated.View>

                    {/* Formulaire */}
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formulaire}>
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Ionicons name="alert-circle-outline" size={16} color={Couleurs.etat.erreur} />
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

                        <ChampSaisie label="Email" icone="mail-outline" placeholder="your@email.com"
                            value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

                        <ChampSaisie label="Password" icone="lock-closed-outline" placeholder="••••••••"
                            value={motDePasse} onChangeText={setMotDePasse} secureTextEntry={!afficherMdp}
                            iconeDroite={afficherMdp ? 'eye-off-outline' : 'eye-outline'}
                            onPressIconeDroite={() => setAfficherMdp(!afficherMdp)} />

                        <BoutonPrincipal titre="Sign in" onPress={gererConnexion}
                            chargement={chargement} couleur={COULEUR} style={{ marginTop: 8 }} />
                    </Animated.View>

                    {/* CTA Premium */}
                    <Animated.View entering={FadeInDown.delay(280).duration(500)}>
                        <TouchableOpacity
                            style={styles.boxPremium}
                            onPress={() => navigation.navigate('Abonnement')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.boxPremiumGauche}>
                                <Ionicons name="diamond-outline" size={22} color={COULEUR} />
                                <View>
                                    <Text style={styles.boxTitre}>Offre Premium Touriste</Text>
                                    <Text style={styles.boxDesc}>Contenus exclusifs & guide audio</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={COULEUR} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Footer inscription */}
                    <Animated.View entering={FadeInDown.delay(330).duration(500)} style={styles.footer}>
                        <Text style={styles.footerTexte}>No account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Inscription')}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={[styles.footerLien, { color: COULEUR }]}>Create tourist profile</Text>
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
    boxPremium: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#9B59B610', borderRadius: Rayons.lg,
        padding: 16, marginTop: 18,
        borderWidth: 1, borderColor: '#9B59B625',
    },
    boxPremiumGauche: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    boxTitre: { color: COULEUR, fontWeight: '700', fontSize: Typographie.tailles.md },
    boxDesc: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs, marginTop: 2 },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
    footerTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.md },
    footerLien: { fontWeight: '700', fontSize: Typographie.tailles.md },
});
