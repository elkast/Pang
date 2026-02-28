// =============================================================================
// IvoCulture — Écran Promotions
// Découverte des entités promues : sites, mosquées, musiques, légendes, tourisme
// Thème : Blanc/Orange
// =============================================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    Linking,
    Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { usePromotions } from '../hooks/usePromotions';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTRES = [
    { id: 'tous', label: 'Tous', icone: 'grid', couleur: '#E67E22' },
    { id: 'site', label: 'Sites', icone: 'location', couleur: '#1E6B45' },
    { id: 'mosquee', label: 'Mosquées', icone: 'moon', couleur: '#C4A02A' },
    { id: 'musique', label: 'Musique', icone: 'musical-notes', couleur: '#8B5C34' },
    { id: 'legende', label: 'Légendes', icone: 'book', couleur: '#9D2235' },
    { id: 'touriste', label: 'Tourisme', icone: 'airplane', couleur: '#3498DB' },
];

function BarreNotoriete({ note, couleur }: { note: number; couleur: string }) {
    return (
        <View style={styles.barreConteneur}>
            <View style={styles.barreFond}>
                <View style={[styles.barreRemplie, { width: `${note}%` as any, backgroundColor: couleur }]} />
            </View>
            <Text style={[styles.noteTexte, { color: couleur }]}>{note}%</Text>
        </View>
    );
}

export default function EcranPromotion() {
    const navigation = useNavigation<Nav>();
    const [filtreActif, setFiltreActif] = useState('tous');

    const typePromotion = filtreActif === 'tous' ? undefined : filtreActif;
    const { data: promotions, isLoading } = usePromotions(typePromotion);

    const couleurParType: Record<string, string> = {
        site: '#1E6B45',
        mosquee: '#C4A02A',
        musique: '#8B5C34',
        legende: '#9D2235',
        touriste: '#3498DB',
    };

    const appelTelephone = (numero: string) => {
        const url = `tel:${numero}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) Linking.openURL(url);
                else Alert.alert('Numéro', numero);
            })
            .catch(() => Alert.alert('Numéro', numero));
    };

    return (
        <View style={styles.conteneur}>
            {/* En-tête */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <View>
                    <Text style={styles.soustitre}>Découvrez &amp; Contactez</Text>
                    <Text style={styles.titre}>Promotions</Text>
                </View>
                <View style={styles.badgeTotal}>
                    <Text style={styles.badgeTotalTexte}>{promotions?.length || 0}</Text>
                </View>
            </Animated.View>

            {/* Filtres horizontaux */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtresScroll}
                >
                    {FILTRES.map(filtre => (
                        <TouchableOpacity
                            key={filtre.id}
                            style={[
                                styles.filtre,
                                filtreActif === filtre.id && {
                                    backgroundColor: filtre.couleur,
                                    borderColor: filtre.couleur,
                                },
                            ]}
                            onPress={() => setFiltreActif(filtre.id)}
                            activeOpacity={0.85}
                        >
                            <Ionicons
                                name={filtre.icone as any}
                                size={16}
                                color={filtreActif === filtre.id ? '#FFF' : filtre.couleur}
                            />
                            <Text
                                style={[
                                    styles.filtreTexte,
                                    { color: filtreActif === filtre.id ? '#FFF' : '#555' },
                                ]}
                            >
                                {filtre.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Liste des promotions */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.liste}
            >
                {isLoading ? (
                    <View style={styles.chargement}>
                        <Text style={styles.chargementTexte}>Chargement...</Text>
                    </View>
                ) : promotions?.length === 0 ? (
                    <View style={styles.vide}>
                        <Ionicons name="star-outline" size={60} color={Couleurs.accent.principal} />
                        <Text style={styles.videTexte}>Aucune promotion disponible</Text>
                    </View>
                ) : (
                    promotions?.map((promo: any, index: number) => {
                        const couleur = couleurParType[promo.type_promotion] || Couleurs.accent.principal;
                        return (
                            <Animated.View
                                key={promo.id}
                                entering={FadeInDown.delay(index * 80).duration(400)}
                            >
                                <TouchableOpacity
                                    style={styles.carte}
                                    onPress={() => navigation.navigate('DetailPromotion', { id: promo.id })}
                                    activeOpacity={0.9}
                                >
                                    {/* Image */}
                                    <View style={styles.imageConteneur}>
                                        <Image
                                            source={{ uri: promo.image_url || 'https://picsum.photos/400/250' }}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                        <View style={[styles.badgeType, { backgroundColor: couleur }]}>
                                            <Text style={styles.badgeTypeTexte}>
                                                {promo.type_promotion?.toUpperCase()}
                                            </Text>
                                        </View>
                                        {promo.is_featured && (
                                            <View style={styles.badgeFeatured}>
                                                <Ionicons name="star" size={12} color="#FFF" />
                                                <Text style={styles.badgeFeaturedTexte}>À la une</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Contenu */}
                                    <View style={styles.corps}>
                                        <Text style={styles.titreCarte} numberOfLines={1}>
                                            {promo.titre}
                                        </Text>
                                        <Text style={styles.descriptionCarte} numberOfLines={2}>
                                            {promo.description}
                                        </Text>

                                        {/* Adresse */}
                                        {promo.adresse && (
                                            <View style={styles.ligneMeta}>
                                                <Ionicons name="location-outline" size={13} color="#999" />
                                                <Text style={styles.metaTexte} numberOfLines={1}>
                                                    {promo.adresse}
                                                </Text>
                                            </View>
                                        )}

                                        {/* Notoriété */}
                                        <Text style={styles.etiquetteNotoriete}>Notoriété</Text>
                                        <BarreNotoriete note={promo.note_popularite || 50} couleur={couleur} />

                                        {/* Bouton contact */}
                                        {promo.numero_contact && (
                                            <TouchableOpacity
                                                style={[styles.boutonContact, { borderColor: couleur }]}
                                                onPress={() => appelTelephone(promo.numero_contact)}
                                                activeOpacity={0.8}
                                            >
                                                <Ionicons name="call-outline" size={16} color={couleur} />
                                                <Text style={[styles.boutonContactTexte, { color: couleur }]}>
                                                    {promo.numero_contact}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
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
    soustitre: {
        color: Couleurs.accent.principal,
        fontSize: Typographie.tailles.sm,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: '800',
    },
    badgeTotal: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Couleurs.accent.principal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTotalTexte: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: Typographie.tailles.lg,
    },
    filtresScroll: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
    },
    filtre: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        backgroundColor: '#F8F8F8',
    },
    filtreTexte: {
        fontSize: Typographie.tailles.sm,
        fontWeight: '600',
    },
    liste: {
        paddingHorizontal: 16,
        gap: 16,
    },
    carte: {
        backgroundColor: '#FFF',
        borderRadius: Rayons.xl,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    imageConteneur: {
        height: 180,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeType: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Rayons.complet,
    },
    badgeTypeTexte: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    badgeFeatured: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E67E22',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Rayons.complet,
    },
    badgeFeaturedTexte: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    corps: {
        padding: 16,
    },
    titreCarte: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: '700',
        marginBottom: 6,
    },
    descriptionCarte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        lineHeight: 20,
        marginBottom: 8,
    },
    ligneMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    metaTexte: {
        color: '#999',
        fontSize: Typographie.tailles.sm,
        flex: 1,
    },
    etiquetteNotoriete: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    barreConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    barreFond: {
        flex: 1,
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barreRemplie: {
        height: '100%',
        borderRadius: 4,
    },
    noteTexte: {
        fontSize: Typographie.tailles.sm,
        fontWeight: '700',
        width: 36,
        textAlign: 'right',
    },
    boutonContact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: Rayons.lg,
        borderWidth: 1.5,
        backgroundColor: '#FFF',
    },
    boutonContactTexte: {
        fontSize: Typographie.tailles.md,
        fontWeight: '600',
    },
    chargement: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },
    chargementTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
    },
    vide: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
        gap: 12,
    },
    videTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
    },
});
