// =============================================================================
// IvoCulture — Recommandations IA (simulation)
// Budget + événements → recommandations + partage WhatsApp
// =============================================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { EnteteEcran } from '../composants';
import { PROMOTIONS_MOCK, CONTENUS_MOCK } from '../donnees/mockDonnees';

const EVENEMENTS = [
    { id: 'festival', label: 'Festival des masques' },
    { id: 'gastronomie', label: 'Découverte gastronomique' },
    { id: 'sites', label: 'Visite des sites UNESCO' },
    { id: 'musique', label: 'Concert et percussions' },
];

export default function EcranRecommandationsIA() {
    const [budget, setBudget] = useState('');
    const [selectionEvenements, setSelectionEvenements] = useState<Set<string>>(new Set());
    const [recommandations, setRecommandations] = useState<any[] | null>(null);

    const toggleEvenement = (id: string) => {
        const next = new Set(selectionEvenements);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectionEvenements(next);
    };

    const generer = () => {
        const b = parseInt(budget, 10) || 50000;
        const events = [...selectionEvenements];
        let results: any[] = [];

        if (events.includes('festival')) {
            results = results.concat(PROMOTIONS_MOCK.filter(p => p.type_promotion === 'site').slice(0, 2));
        }
        if (events.includes('gastronomie')) {
            results = results.concat(CONTENUS_MOCK.filter(c => c.type_contenu === 'gastronomie').slice(0, 2));
        }
        if (events.includes('sites')) {
            results = results.concat(PROMOTIONS_MOCK.filter(p => p.type_promotion === 'site'));
        }
        if (events.includes('musique')) {
            results = results.concat(PROMOTIONS_MOCK.filter(p => p.type_promotion === 'musique'));
        }

        if (results.length === 0) {
            results = [...PROMOTIONS_MOCK.slice(0, 4), ...CONTENUS_MOCK.slice(0, 2)];
        }

        setRecommandations(results.slice(0, 6));
    };

    const envoyerWhatsApp = (item: any) => {
        const texte = `Découverte IvoCulture : ${item.titre || item.nom} — Recommandé par l'assistant IA`;
        const url = `https://wa.me/?text=${encodeURIComponent(texte)}`;
        Linking.openURL(url).catch(() => Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp.'));
    };

    return (
        <View style={styles.conteneur}>
            <EnteteEcran titre="Assistant IA" />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    <Text style={styles.label}>Budget (FCFA)</Text>
                    <TextInput
                        style={styles.champ}
                        placeholder="Ex: 50000"
                        placeholderTextColor={Couleurs.texte.desactive}
                        value={budget}
                        onChangeText={setBudget}
                        keyboardType="number-pad"
                    />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <Text style={styles.label}>Événements / Activités souhaités</Text>
                    <View style={styles.evenements}>
                        {EVENEMENTS.map((ev) => (
                            <TouchableOpacity
                                key={ev.id}
                                style={[styles.chip, selectionEvenements.has(ev.id) && styles.chipActif]}
                                onPress={() => toggleEvenement(ev.id)}
                            >
                                <Text style={[styles.chipTexte, selectionEvenements.has(ev.id) && styles.chipTexteActif]}>
                                    {ev.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <TouchableOpacity style={styles.bouton} onPress={generer}>
                    <Ionicons name="sparkles" size={20} color="#FFF" />
                    <Text style={styles.boutonTexte}>Générer les recommandations</Text>
                </TouchableOpacity>

                {recommandations && (
                    <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.resultats}>
                        <Text style={styles.titreResultats}>Recommandations pour vous</Text>
                        {recommandations.map((item, i) => (
                            <View key={i} style={styles.carte}>
                                <Text style={styles.carteTitre}>{item.titre || item.nom}</Text>
                                <Text style={styles.carteDesc} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <TouchableOpacity
                                    style={styles.boutonWhatsApp}
                                    onPress={() => envoyerWhatsApp(item)}
                                >
                                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                                    <Text style={styles.boutonWhatsAppTexte}>Partager sur WhatsApp</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </Animated.View>
                )}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    scroll: { padding: 20 },
    label: {
        fontSize: Typographie.tailles.md,
        fontWeight: '600',
        color: Couleurs.texte.primaire,
        marginBottom: 8,
    },
    champ: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.md,
        padding: 16,
        fontSize: Typographie.tailles.lg,
        marginBottom: 24,
    },
    evenements: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.carte,
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
    },
    chipActif: {
        backgroundColor: Couleurs.accent.principal + '20',
        borderColor: Couleurs.accent.principal,
    },
    chipTexte: { color: Couleurs.texte.secondaire, fontSize: 14 },
    chipTexteActif: { color: Couleurs.accent.principal, fontWeight: '600' },
    bouton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Couleurs.accent.principal,
        paddingVertical: 16,
        borderRadius: Rayons.lg,
        marginBottom: 32,
    },
    boutonTexte: { color: '#FFF', fontWeight: '700', fontSize: Typographie.tailles.lg },
    resultats: { marginTop: 8 },
    titreResultats: {
        fontSize: Typographie.tailles.xl,
        fontWeight: '700',
        color: Couleurs.texte.primaire,
        marginBottom: 16,
    },
    carte: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        padding: 16,
        marginBottom: 12,
    },
    carteTitre: {
        fontSize: Typographie.tailles.lg,
        fontWeight: '700',
        color: Couleurs.texte.primaire,
        marginBottom: 6,
    },
    carteDesc: {
        fontSize: Typographie.tailles.sm,
        color: Couleurs.texte.secondaire,
        marginBottom: 12,
    },
    boutonWhatsApp: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
    },
    boutonWhatsAppTexte: { color: '#25D366', fontWeight: '600', fontSize: 14 },
});
