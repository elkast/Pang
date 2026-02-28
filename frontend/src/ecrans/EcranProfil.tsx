// =============================================================================
// IvoCulture — Écran Profil
// Menu utilisateur avec navigation vers les sections
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { Chargement } from '../composants';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ElementMenu {
    titre: string;
    icone: string;
    action: string;
    couleur: string;
}

export default function EcranProfil() {
    const navigation = useNavigation<Nav>();
    const { utilisateur, estAdmin, chargement, seDeconnecter } = useAuth();

    const elementsMenu: ElementMenu[] = [
        { titre: 'Mes Favoris', icone: 'heart-outline', action: 'Favoris', couleur: Couleurs.etat.erreur },
        { titre: 'Mes Contributions', icone: 'create-outline', action: 'Contribution', couleur: Couleurs.or.principal },
        { titre: 'Découvrir', icone: 'compass-outline', action: 'Decouverte', couleur: Couleurs.accent.vert },
        { titre: 'Portails d\'Ivoire', icone: 'map-outline', action: 'Portails', couleur: Couleurs.foret.principal },
    ];

    const gererDeconnexion = () => {
        Alert.alert(
            'Déconnexion',
            'Voulez-vous vraiment vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        await seDeconnecter();
                        navigation.reset({ index: 0, routes: [{ name: 'Connexion' }] });
                    },
                },
            ]
        );
    };

    const gererNavigation = (action: string) => {
        switch (action) {
            case 'Favoris':
                navigation.navigate('Favoris');
                break;
            case 'Contribution':
                navigation.navigate('Contribution');
                break;
            case 'Decouverte':
                navigation.navigate('Decouverte');
                break;
            case 'Portails':
                navigation.navigate('Portails');
                break;
        }
    };

    if (chargement) {
        return <Chargement message="Chargement du profil..." />;
    }

    return (
        <View style={styles.conteneur}>
            {/* En-tête */}
            <Animated.View entering={FadeInDown.duration(500)}>
                <View style={styles.entete}>
                    <Text style={styles.titreEntete}>Profil</Text>
                </View>
            </Animated.View>

            {/* Carte profil */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                <View style={styles.carteProfil}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarTexte}>
                            {utilisateur?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.infoProfil}>
                        <Text style={styles.nomProfil}>
                            {utilisateur?.username || 'Utilisateur'}
                        </Text>
                        <Text style={styles.emailProfil}>
                            {utilisateur?.email || 'email@exemple.com'}
                        </Text>
                        {utilisateur?.is_premium && (
                            <View style={styles.badgePremium}>
                                <Text style={styles.textePremium}>⭐ PREMIUM</Text>
                            </View>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Couleurs.texte.secondaire} />
                </View>
            </Animated.View>

            {/* Menu */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <View style={styles.menu}>
                    {elementsMenu.map((item, index) => (
                        <TouchableOpacity
                            key={item.titre}
                            style={styles.elementMenu}
                            onPress={() => gererNavigation(item.action)}
                        >
                            <View style={styles.gauchMenu}>
                                <View style={[styles.iconeConteneur, { backgroundColor: item.couleur + '15' }]}>
                                    <Ionicons name={item.icone as any} size={20} color={item.couleur} />
                                </View>
                                <Text style={styles.titreMenu}>{item.titre}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Couleurs.texte.secondaire} />
                        </TouchableOpacity>
                    ))}

                    {/* Section admin */}
                    {estAdmin && (
                        <>
                            <View style={styles.separateur} />
                            <TouchableOpacity
                                style={styles.elementMenu}
                                onPress={() => Alert.alert('Admin', 'Dashboard admin en développement.')}
                            >
                                <View style={styles.gauchMenu}>
                                    <View style={[styles.iconeConteneur, { backgroundColor: Couleurs.etat.succes + '15' }]}>
                                        <Ionicons name="shield-checkmark-outline" size={20} color={Couleurs.etat.succes} />
                                    </View>
                                    <Text style={styles.titreMenu}>Dashboard Admin</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color={Couleurs.texte.secondaire} />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Déconnexion */}
                    <View style={styles.separateur} />
                    <TouchableOpacity style={styles.elementMenu} onPress={gererDeconnexion}>
                        <View style={styles.gauchMenu}>
                            <View style={[styles.iconeConteneur, { backgroundColor: Couleurs.etat.erreur + '15' }]}>
                                <Ionicons name="log-out-outline" size={20} color={Couleurs.etat.erreur} />
                            </View>
                            <Text style={[styles.titreMenu, { color: Couleurs.etat.erreur }]}>
                                Déconnexion
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    entete: {
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 12,
    },
    titreEntete: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: Typographie.poids.bold,
    },
    // Carte profil
    carteProfil: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Couleurs.fond.carte,
        marginHorizontal: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: Rayons.lg,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Couleurs.accent.principal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarTexte: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
    },
    infoProfil: {
        flex: 1,
        marginLeft: 14,
    },
    nomProfil: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
    },
    emailProfil: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        marginTop: 2,
    },
    badgePremium: {
        alignSelf: 'flex-start',
        backgroundColor: Couleurs.or.principal + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    textePremium: {
        color: Couleurs.or.principal,
        fontSize: 10,
        fontWeight: '700',
    },
    // Menu
    menu: {
        marginTop: 20,
        marginHorizontal: 16,
    },
    elementMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
    },
    gauchMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconeConteneur: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titreMenu: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
    },
    separateur: {
        height: 1,
        backgroundColor: Couleurs.fond.surface,
        marginVertical: 4,
    },
});
