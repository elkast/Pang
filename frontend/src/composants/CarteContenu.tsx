// =============================================================================
// Composant CarteContenu — Carte de contenu culturel réutilisable
// Utilisé dans : Accueil, Découverte, Favoris, Catégories, Détail Région
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Couleurs, Typographie, Rayons, Ombres, obtenirCouleurCategorie } from '../constantes';

export interface DonneesContenu {
    id: number;
    titre: string;
    type_contenu: string;
    description: string;
    image_url?: string;
    vues?: number;
    likes?: number;
    audio_url?: string;
}

interface PropsCarteContenu {
    contenu: DonneesContenu;
    onPress: () => void;
    index?: number;
    variante?: 'horizontal' | 'vertical';
}

export default function CarteContenu({
    contenu,
    onPress,
    index = 0,
    variante = 'horizontal',
}: PropsCarteContenu) {
    const couleurBadge = obtenirCouleurCategorie(contenu.type_contenu);
    const imageUri = contenu.image_url || 'https://picsum.photos/400/300';

    if (variante === 'vertical') {
        return (
            <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
                <TouchableOpacity
                    style={styles.carteVerticale}
                    onPress={onPress}
                    activeOpacity={0.85}
                >
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.imageVerticale}
                    />
                    <View style={styles.contenuVertical}>
                        <View style={[styles.badge, { backgroundColor: couleurBadge }]}>
                            <Text style={styles.texteBadge}>
                                {contenu.type_contenu?.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.titreVertical} numberOfLines={2}>
                            {contenu.titre}
                        </Text>
                        <Text style={styles.descriptionVerticale} numberOfLines={2}>
                            {contenu.description}
                        </Text>
                        {contenu.audio_url && (
                            <View style={styles.ligneAudio}>
                                <Ionicons name="musical-notes" size={14} color={Couleurs.accent.principal} />
                                <Text style={styles.texteAudio}>Audio disponible</Text>
                            </View>
                        )}
                        <View style={styles.piedCarte}>
                            <View style={styles.stat}>
                                <Ionicons name="eye-outline" size={14} color={Couleurs.texte.secondaire} />
                                <Text style={styles.texteStat}>{contenu.vues || 0}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="heart" size={14} color={Couleurs.accent.principal} />
                                <Text style={styles.texteStat}>{contenu.likes || 0}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    // Variante horizontale (compacte)
    return (
        <Animated.View entering={FadeInUp.delay(index * 60).springify()}>
            <TouchableOpacity
                style={styles.carteHorizontale}
                onPress={onPress}
                activeOpacity={0.85}
            >
                <Image source={{ uri: imageUri }} style={styles.imageHorizontale} />
                <View style={styles.contenuHorizontal}>
                    <View style={[styles.badge, { backgroundColor: couleurBadge }]}>
                        <Text style={styles.texteBadge}>
                            {contenu.type_contenu?.toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.titreHorizontal} numberOfLines={2}>
                        {contenu.titre}
                    </Text>
                    <Text style={styles.descriptionHorizontale} numberOfLines={1}>
                        {contenu.description}
                    </Text>
                    <Text style={styles.statsTexte}>
                        {contenu.vues ?? 0} vues · {contenu.likes ?? 0} ♥
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    // Carte verticale (grande)
    carteVerticale: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.xl,
        marginBottom: 16,
        overflow: 'hidden',
        ...Ombres.moyen,
    },
    imageVerticale: {
        width: '100%',
        height: 180,
    },
    contenuVertical: {
        padding: 16,
    },
    titreVertical: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.bold,
        marginBottom: 4,
    },
    descriptionVerticale: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        lineHeight: 20,
    },

    // Carte horizontale (compacte)
    carteHorizontale: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        ...Ombres.petit,
    },
    imageHorizontale: {
        width: 90,
        height: 90,
    },
    contenuHorizontal: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    titreHorizontal: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.semiBold,
        marginTop: 4,
    },
    descriptionHorizontale: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        marginTop: 2,
    },
    statsTexte: {
        color: Couleurs.texte.desactive,
        fontSize: Typographie.tailles.xs,
        marginTop: 4,
    },

    // Communs
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginBottom: 4,
    },
    texteBadge: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    piedCarte: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    texteStat: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
    },
    ligneAudio: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    texteAudio: {
        color: Couleurs.accent.principal,
        fontSize: Typographie.tailles.sm,
    },
});
