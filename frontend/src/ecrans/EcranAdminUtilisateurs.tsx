// =============================================================================
// IvoCulture — Écran Admin Utilisateurs
// CRUD utilisateurs : liste, modification rôle, désactivation
// =============================================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useUtilisateursAdmin, useModifierUtilisateur, useDesactiverUtilisateur } from '../hooks/useAdmin';

const TYPE_COULEURS: Record<string, string> = {
    local: Couleurs.foret.principal,
    touriste: '#9B59B6',
};

const ROLE_COULEURS: Record<string, string> = {
    explorateur: Couleurs.texte.secondaire,
    contributeur: '#3498DB',
    gardien: '#E67E22',
    admin: '#E74C3C',
};

function CarteUtilisateur({ user, onModifier, onDesactiver }: any) {
    return (
        <View style={[styles.carte, !user.is_active && styles.carteInactive]}>
            <View style={styles.carteEntete}>
                <View style={[styles.avatar, { backgroundColor: TYPE_COULEURS[user.type_utilisateur] || '#999' }]}>
                    <Text style={styles.avatarLettre}>{(user.username || '?')[0].toUpperCase()}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
                    <View style={styles.badges}>
                        <View style={[styles.badge, { backgroundColor: TYPE_COULEURS[user.type_utilisateur] + '20' }]}>
                            <Text style={[styles.badgeTexte, { color: TYPE_COULEURS[user.type_utilisateur] }]}>
                                {user.type_utilisateur}
                            </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: ROLE_COULEURS[user.role] + '20' }]}>
                            <Text style={[styles.badgeTexte, { color: ROLE_COULEURS[user.role] }]}>
                                {user.role}
                            </Text>
                        </View>
                        {user.is_premium && (
                            <View style={[styles.badge, { backgroundColor: '#F39C1220' }]}>
                                <Text style={[styles.badgeTexte, { color: '#F39C12' }]}>⭐ premium</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.boutonAction, { backgroundColor: user.is_active ? '#E74C3C20' : '#2ECC7120' }]}
                        onPress={() => onDesactiver(user)}
                    >
                        <Ionicons
                            name={user.is_active ? 'eye-off-outline' : 'eye-outline'}
                            size={18}
                            color={user.is_active ? '#E74C3C' : '#2ECC71'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.boutonAction, { backgroundColor: '#3498DB20' }]}
                        onPress={() => onModifier(user)}
                    >
                        <Ionicons name="create-outline" size={18} color="#3498DB" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.cartePied}>
                <Text style={styles.stat}>{user.contributions_count || 0} contributions</Text>
                {!user.is_active && <Text style={styles.inactifLabel}>Compte désactivé</Text>}
            </View>
        </View>
    );
}

export default function EcranAdminUtilisateurs() {
    const navigation = useNavigation<any>();
    const { data: utilisateurs, isLoading, error } = useUtilisateursAdmin();
    const modifierMutation = useModifierUtilisateur();
    const desactiverMutation = useDesactiverUtilisateur();

    const handleDesactiver = (user: any) => {
        Alert.alert(
            user.is_active ? 'Désactiver ce compte ?' : 'Réactiver ce compte ?',
            `Utilisateur : ${user.username}`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: user.is_active ? 'Désactiver' : 'Réactiver',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (user.is_active) {
                                await desactiverMutation.mutateAsync(user.id);
                            } else {
                                await modifierMutation.mutateAsync({ id: user.id, donnees: { is_active: true } });
                            }
                        } catch {
                            Alert.alert('Erreur', 'Action impossible');
                        }
                    },
                },
            ]
        );
    };

    const handleModifier = (user: any) => {
        Alert.alert(
            `Modifier ${user.username}`,
            'Changer le rôle :',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: '👤 Explorateur', onPress: () => modifierMutation.mutateAsync({ id: user.id, donnees: { role: 'explorateur' } }) },
                { text: '✍️ Contributeur', onPress: () => modifierMutation.mutateAsync({ id: user.id, donnees: { role: 'contributeur' } }) },
                { text: '🛡️ Gardien', onPress: () => modifierMutation.mutateAsync({ id: user.id, donnees: { role: 'gardien' } }) },
                {
                    text: user.is_premium ? '⭐ Retirer Premium' : '⭐ Activer Premium',
                    onPress: () => modifierMutation.mutateAsync({ id: user.id, donnees: { is_premium: !user.is_premium } }),
                },
            ]
        );
    };

    return (
        <View style={styles.conteneur}>
            {/* En-tête */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titre}>Utilisateurs</Text>
                    <Text style={styles.sousTitre}>{utilisateurs?.length || 0} comptes enregistrés</Text>
                </View>
            </Animated.View>

            {isLoading ? (
                <View style={styles.centrer}>
                    <ActivityIndicator size="large" color={Couleurs.accent.principal} />
                    <Text style={styles.chargementTexte}>Chargement des utilisateurs…</Text>
                </View>
            ) : error ? (
                <View style={styles.centrer}>
                    <Ionicons name="wifi-outline" size={48} color={Couleurs.texte.desactive} />
                    <Text style={styles.erreurTexte}>Backend non disponible</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liste}>
                    {utilisateurs?.map((user: any, i: number) => (
                        <Animated.View key={user.id} entering={FadeInDown.delay(i * 50).duration(400)}>
                            <CarteUtilisateur
                                user={user}
                                onModifier={handleModifier}
                                onDesactiver={handleDesactiver}
                            />
                        </Animated.View>
                    ))}
                    <View style={{ height: 80 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    entete: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
        gap: 14,
        borderBottomWidth: 1,
        borderBottomColor: Couleurs.fond.surface,
    },
    retour: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxl,
        fontWeight: '800',
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
    },
    liste: { paddingHorizontal: 16, paddingTop: 12 },
    carte: {
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    carteInactive: { opacity: 0.5 },
    carteEntete: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLettre: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    info: { flex: 1 },
    username: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.md },
    email: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs, marginTop: 1 },
    badges: { flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
    badgeTexte: { fontSize: 10, fontWeight: '700' },
    actions: { gap: 8 },
    boutonAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartePied: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Couleurs.fond.surface,
    },
    stat: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs },
    inactifLabel: { color: '#E74C3C', fontSize: Typographie.tailles.xs, fontWeight: '700' },
    centrer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    chargementTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.md },
    erreurTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.lg, fontWeight: '600' },
});
