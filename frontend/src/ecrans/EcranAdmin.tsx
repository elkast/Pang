// =============================================================================
//  — Écran Admin Principal
// Tableau de bord avec stats et navigation vers les sous-sections
// =============================================================================

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useAuthContext } from '../context/AuthContext';
import api from '../api/client';
import { useQuery } from '@tanstack/react-query';

const STATS_MOCK = {
    total_utilisateurs: 24,
    total_contenus: 38,
    total_regions: 5,
    total_interactions: 156,
    total_promotions: 8,
    utilisateurs_premium: 6,
    utilisateurs_touristes: 10,
    utilisateurs_locaux: 14,
};

function useStatsAdmin() {
    return useQuery({
        queryKey: ['admin_stats'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/admin/stats');
                return data;
            } catch {
                return STATS_MOCK;
            }
        },
    });
}

function CarteStat({ icone, label, valeur, couleur }: any) {
    return (
        <View style={[styles.carteStat, { borderLeftColor: couleur, borderLeftWidth: 4 }]}>
            <View style={[styles.iconeStatConteneur, { backgroundColor: couleur + '15' }]}>
                <Ionicons name={icone} size={22} color={couleur} />
            </View>
            <View style={styles.corpsStatCarte}>
                <Text style={styles.valeurStat}>{valeur}</Text>
                <Text style={styles.labelStat}>{label}</Text>
            </View>
        </View>
    );
}

const SECTIONS_ADMIN = [
    { id: 'contenus', label: 'Gestion Contenus', sousTitre: 'Publier, modifier, supprimer', icone: 'album-outline', couleur: '#E67E22', ecran: 'AdminContenus' },
    { id: 'promotions', label: 'Promotions', sousTitre: 'Sites, mosquées, musiques, légendes', icone: 'star-outline', couleur: '#C4A02A', ecran: 'AdminPromotions' },
    { id: 'utilisateurs', label: 'Utilisateurs', sousTitre: 'Gérer les comptes et rôles', icone: 'people-outline', couleur: '#3498DB', ecran: 'AdminUtilisateurs' },
    { id: 'regions', label: 'Régions', sousTitre: 'Ajouter et modifier les régions', icone: 'map-outline', couleur: '#1E6B45', ecran: 'AdminRegions' },
];

export default function EcranAdmin() {
    const navigation = useNavigation<any>();
    const { utilisateur } = useAuthContext();
    const { data: stats } = useStatsAdmin();

    const seeder = async () => {
        try {
            const { data } = await api.post('/admin/seed');
            Alert.alert('Seed', data.message);
        } catch (e: any) {
            Alert.alert('Info', e?.response?.data?.detail || 'Erreur seed');
        }
    };

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* En-tête */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <View>
                    <Text style={styles.bonjour}>Bienvenue,</Text>
                    <Text style={styles.nomAdmin}>{utilisateur?.username || 'Admin'} 👑</Text>
                </View>
                <TouchableOpacity style={styles.boutonSeed} onPress={seeder} activeOpacity={0.8}>
                    <Ionicons name="server-outline" size={18} color={Couleurs.accent.principal} />
                    <Text style={styles.boutonSeedTexte}>Seed DB</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Statistiques */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
                <Text style={styles.titreSect}>Vue d'ensemble</Text>
                <View style={styles.grilleStats}>
                    <CarteStat icone="people" label="Utilisateurs" valeur={stats?.total_utilisateurs || 0} couleur="#3498DB" />
                    <CarteStat icone="book" label="Contenus" valeur={stats?.total_contenus || 0} couleur="#E67E22" />
                    <CarteStat icone="map" label="Régions" valeur={stats?.total_regions || 0} couleur="#1E6B45" />
                    <CarteStat icone="star" label="Promotions" valeur={stats?.total_promotions || 0} couleur="#C4A02A" />
                    <CarteStat icone="heart" label="Interactions" valeur={stats?.total_interactions || 0} couleur="#9D2235" />
                    <CarteStat icone="airplane" label="Touristes" valeur={stats?.utilisateurs_touristes || 0} couleur="#9B59B6" />
                </View>
            </Animated.View>

            {/* Sections admin */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
                <Text style={styles.titreSect}>Gestion</Text>
                {SECTIONS_ADMIN.map((sec, i) => (
                    <Animated.View key={sec.id} entering={FadeInDown.delay(250 + i * 60).duration(400)}>
                        <TouchableOpacity
                            style={styles.carteSection}
                            onPress={() => navigation.navigate(sec.ecran as any)}
                            activeOpacity={0.85}
                        >
                            <View style={[styles.iconeSection, { backgroundColor: sec.couleur + '15' }]}>
                                <Ionicons name={sec.icone as any} size={26} color={sec.couleur} />
                            </View>
                            <View style={styles.corpsSectionAdmin}>
                                <Text style={styles.labelSection}>{sec.label}</Text>
                                <Text style={styles.sousTitreSection}>{sec.sousTitre}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#CCC" />
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </Animated.View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    entete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
    },
    bonjour: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
    },
    nomAdmin: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxl,
        fontWeight: '800',
    },
    boutonSeed: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
        borderWidth: 1.5,
        borderColor: Couleurs.accent.principal,
    },
    boutonSeedTexte: {
        color: Couleurs.accent.principal,
        fontWeight: '600',
        fontSize: Typographie.tailles.sm,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    titreSect: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: '700',
        marginBottom: 14,
        marginTop: 12,
    },
    grilleStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    carteStat: {
        width: '47%',
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    iconeStatConteneur: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    corpsStatCarte: {
        flex: 1,
    },
    valeurStat: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxl,
        fontWeight: '800',
    },
    labelStat: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.xs,
    },
    carteSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    iconeSection: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    corpsSectionAdmin: {
        flex: 1,
        marginLeft: 14,
    },
    labelSection: {
        color: Couleurs.texte.primaire,
        fontWeight: '700',
        fontSize: Typographie.tailles.lg,
    },
    sousTitreSection: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        marginTop: 2,
    },
});
