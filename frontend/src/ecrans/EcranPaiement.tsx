// =============================================================================
// IvoCulture — Simulateur paiement CinetPay
// Déblocage Premium en LocalStorage si API indisponible
// =============================================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Couleurs, Typographie, Rayons } from '../constantes';
import api from '../api/client';
import type { RootStackParamList } from '../navigation/AppNavigator';

const STORAGE_PREMIUM = 'abonnement_premium';

type RoutePayment = RouteProp<RootStackParamList, 'Paiement'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranPaiement() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<RoutePayment>();
    const { recharger } = useAuthContext();
    const { montant = 39900, plan = 'annuel' } = (route.params as any) || {};

    const [methode, setMethode] = useState<'mom' | 'card'>('mom');
    const [numero, setNumero] = useState('');
    const [enCours, setEnCours] = useState(false);
    const [succes, setSucces] = useState(false);

    const payer = async () => {
        if (methode === 'mom' && numero.length < 8) {
            return;
        }
        setEnCours(true);
        await new Promise((r) => setTimeout(r, 2500));

        try {
            const { utilisateur } = (route.params as any) || {};
            if (utilisateur?.id) {
                await api.patch(`/admin/utilisateurs/${utilisateur.id}`, { is_premium: true });
            }
        } catch {}

        await AsyncStorage.setItem(STORAGE_PREMIUM, JSON.stringify({
            actif: true,
            date: new Date().toISOString(),
            plan,
        }));

        await recharger?.();
        setSucces(true);
        setEnCours(false);
    };

    if (succes) {
        return (
            <View style={styles.conteneur}>
                <Animated.View entering={FadeInDown.duration(500)} style={styles.succesContenu}>
                    <View style={styles.succesIcone}>
                        <Ionicons name="checkmark-circle" size={80} color="#2ECC71" />
                    </View>
                    <Text style={styles.succesTitre}>Paiement réussi</Text>
                    <Text style={styles.succesDesc}>Votre abonnement Premium est activé.</Text>
                    <TouchableOpacity
                        style={styles.boutonContinuer}
                        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Principal' }] })}
                    >
                        <Text style={styles.boutonContinuerTexte}>Accéder à l'app</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* En-tête type CinetPay */}
            <View style={styles.enTete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.titrePaiement}>Paiement sécurisé</Text>
                <View style={styles.badge}>
                    <Ionicons name="lock-closed" size={12} color="#2ECC71" />
                    <Text style={styles.badgeTexte}>Sécurisé</Text>
                </View>
            </View>

            <View style={styles.corps}>
                <Text style={styles.montant}>{montant.toLocaleString('fr-FR')} FCFA</Text>
                <Text style={styles.libelle}>IvoCulture Premium — {plan}</Text>

                <Text style={styles.labelMethode}>Méthode de paiement</Text>
                <View style={styles.optionsMethode}>
                    <TouchableOpacity
                        style={[styles.optionMethode, methode === 'mom' && styles.optionMethodeActive]}
                        onPress={() => setMethode('mom')}
                    >
                        <Ionicons name="phone-portrait" size={24} color={methode === 'mom' ? '#FFF' : Couleurs.texte.secondaire} />
                        <Text style={[styles.optionTexte, methode === 'mom' && { color: '#FFF' }]}>Mobile Money</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.optionMethode, methode === 'card' && styles.optionMethodeActive]}
                        onPress={() => setMethode('card')}
                    >
                        <Ionicons name="card" size={24} color={methode === 'card' ? '#FFF' : Couleurs.texte.secondaire} />
                        <Text style={[styles.optionTexte, methode === 'card' && { color: '#FFF' }]}>Carte</Text>
                    </TouchableOpacity>
                </View>

                {methode === 'mom' && (
                    <View style={styles.champConteneur}>
                        <Text style={styles.label}>Numéro Orange Money / MTN</Text>
                        <TextInput
                            style={styles.champ}
                            placeholder="07 XX XX XX XX"
                            placeholderTextColor={Couleurs.texte.desactive}
                            value={numero}
                            onChangeText={setNumero}
                            keyboardType="phone-pad"
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.boutonPayer, enCours && styles.boutonDesactive]}
                    onPress={payer}
                    disabled={enCours || (methode === 'mom' && numero.length < 8)}
                >
                    {enCours ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <Ionicons name="card-outline" size={20} color="#FFF" />
                            <Text style={styles.boutonPayerTexte}>Payer {montant.toLocaleString('fr-FR')} FCFA</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.mention}>Simulation CinetPay — Paiement de démonstration</Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#0D1B2A' },
    enTete: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 24,
    },
    retour: { padding: 8, marginRight: 12 },
    titrePaiement: {
        color: '#FFF',
        fontSize: Typographie.tailles.xl,
        fontWeight: '700',
        flex: 1,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(46,204,113,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeTexte: { color: '#2ECC71', fontSize: 12, fontWeight: '600' },
    corps: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    montant: {
        fontSize: 36,
        fontWeight: '800',
        color: Couleurs.texte.primaire,
        textAlign: 'center',
        marginBottom: 4,
    },
    libelle: {
        color: Couleurs.texte.secondaire,
        textAlign: 'center',
        marginBottom: 28,
    },
    labelMethode: {
        fontSize: Typographie.tailles.md,
        fontWeight: '600',
        color: Couleurs.texte.primaire,
        marginBottom: 12,
    },
    optionsMethode: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    optionMethode: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: Rayons.lg,
        borderWidth: 2,
        borderColor: Couleurs.fond.surface,
    },
    optionMethodeActive: {
        backgroundColor: Couleurs.accent.principal,
        borderColor: Couleurs.accent.principal,
    },
    optionTexte: {
        fontSize: Typographie.tailles.sm,
        fontWeight: '600',
        color: Couleurs.texte.secondaire,
    },
    champConteneur: { marginBottom: 24 },
    label: {
        fontSize: Typographie.tailles.sm,
        color: Couleurs.texte.secondaire,
        marginBottom: 8,
    },
    champ: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.md,
        padding: 16,
        fontSize: Typographie.tailles.lg,
    },
    boutonPayer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Couleurs.accent.principal,
        paddingVertical: 18,
        borderRadius: Rayons.lg,
    },
    boutonDesactive: { opacity: 0.7 },
    boutonPayerTexte: { color: '#FFF', fontSize: Typographie.tailles.lg, fontWeight: '700' },
    mention: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: Typographie.tailles.xs,
        color: Couleurs.texte.desactive,
    },
    succesContenu: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    succesIcone: { marginBottom: 24 },
    succesTitre: {
        fontSize: Typographie.tailles.xxl,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    succesDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Typographie.tailles.md,
        marginBottom: 32,
    },
    boutonContinuer: {
        backgroundColor: '#2ECC71',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: Rayons.complet,
    },
    boutonContinuerTexte: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: Typographie.tailles.lg,
    },
});
