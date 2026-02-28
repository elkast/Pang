// =============================================================================
// IvoCulture — Écran Détail Promotion
// Affiche tous les détails d'une entité promue
// =============================================================================

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Linking,
    Alert,
    Share,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useDetailPromotion } from '../hooks/usePromotions';

const LIBELLES_TYPE: Record<string, string> = {
    site: 'Site Culturel',
    mosquee: 'Mosquée',
    musique: 'Musique Traditionnelle',
    legende: 'Légende & Mythe',
    touriste: 'Tourisme',
};

const COULEURS_TYPE: Record<string, string> = {
    site: '#1E6B45',
    mosquee: '#C4A02A',
    musique: '#8B5C34',
    legende: '#9D2235',
    touriste: '#3498DB',
};

function BarreNotoriete({ note, couleur }: { note: number; couleur: string }) {
    return (
        <View>
            <View style={styles.barreConteneur}>
                <View style={styles.barreFond}>
                    <View style={[styles.barreRemplie, { width: `${note}%` as any, backgroundColor: couleur }]} />
                </View>
                <Text style={[styles.noteTexte, { color: couleur }]}>{note}%</Text>
            </View>
            <View style={styles.barreLegende}>
                <Text style={styles.barreLegendeTexte}>Faible</Text>
                <Text style={styles.barreLegendeTexte}>Modéré</Text>
                <Text style={styles.barreLegendeTexte}>Élevé</Text>
                <Text style={styles.barreLegendeTexte}>Très populaire</Text>
            </View>
        </View>
    );
}

export default function EcranDetailPromotion() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { id } = route.params;
    const { data: promo, isLoading } = useDetailPromotion(id);

    const couleur = COULEURS_TYPE[promo?.type_promotion] || Couleurs.accent.principal;

    const appelTelephone = (numero: string) => {
        const url = `tel:${numero}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) Linking.openURL(url);
                else Alert.alert('Numéro de contact', numero);
            })
            .catch(() => Alert.alert('Numéro', numero));
    };

    const partager = async () => {
        if (!promo) return;
        try {
            await Share.share({
                message: `${promo.titre} — ${promo.description}\n📞 ${promo.numero_contact || ''}`,
                title: promo.titre,
            });
        } catch { }
    };

    if (isLoading || !promo) {
        return (
            <View style={[styles.conteneur, styles.centre]}>
                <Text style={styles.chargementTexte}>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.conteneur}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image en-tête */}
                <View style={styles.imageConteneur}>
                    <Image
                        source={{ uri: promo.image_url || 'https://picsum.photos/800/500' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />
                    {/* Boutons retour et partage */}
                    <TouchableOpacity
                        style={[styles.boutonFlottant, { left: 16 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.boutonFlottant, { right: 16 }]}
                        onPress={partager}
                    >
                        <Ionicons name="share-social" size={22} color="#FFF" />
                    </TouchableOpacity>
                    {/* Badge type */}
                    <View style={[styles.badgeTypeImg, { backgroundColor: couleur }]}>
                        <Text style={styles.badgeTypeTexte}>
                            {LIBELLES_TYPE[promo.type_promotion] || promo.type_promotion}
                        </Text>
                    </View>
                </View>

                {/* Contenu principal */}
                <View style={styles.corps}>
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <Text style={styles.titre}>{promo.titre}</Text>
                        <Text style={styles.description}>{promo.description}</Text>
                    </Animated.View>

                    {/* Notoriété */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
                        <Text style={styles.titreSectionAvecIcone}>
                            <Ionicons name="star" size={18} color={couleur} /> Notoriété
                        </Text>
                        <BarreNotoriete note={promo.note_popularite || 50} couleur={couleur} />
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons name="eye-outline" size={16} color="#999" />
                                <Text style={styles.statTexte}>{promo.vues || 0} vues</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Adresse */}
                    {promo.adresse && (
                        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
                            <View style={styles.ligneIcon}>
                                <View style={[styles.iconeConteneur, { backgroundColor: couleur + '15' }]}>
                                    <Ionicons name="location" size={20} color={couleur} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.etiquette}>Adresse</Text>
                                    <Text style={styles.valeur}>{promo.adresse}</Text>
                                </View>
                            </View>
                        </Animated.View>
                    )}

                    {/* Texte complet */}
                    {promo.texte_complet && (
                        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
                            <Text style={styles.titreSectionAvecIcone}>À propos</Text>
                            <Text style={styles.texteComplet}>{promo.texte_complet}</Text>
                        </Animated.View>
                    )}

                    {/* Bouton contact */}
                    {promo.numero_contact && (
                        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
                            <TouchableOpacity
                                style={[styles.boutonContact, { backgroundColor: couleur }]}
                                onPress={() => appelTelephone(promo.numero_contact)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="call" size={22} color="#FFF" />
                                <View>
                                    <Text style={styles.boutonContactLabel}>Appeler maintenant</Text>
                                    <Text style={styles.boutonContactNumero}>{promo.numero_contact}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    centre: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargementTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
    },
    imageConteneur: {
        height: 280,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    boutonFlottant: {
        position: 'absolute',
        top: 52,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTypeImg: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: Rayons.complet,
    },
    badgeTypeTexte: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: Typographie.tailles.sm,
    },
    corps: {
        padding: 20,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxl,
        fontWeight: '800',
        marginBottom: 8,
    },
    description: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        lineHeight: 24,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#F8F8F8',
        borderRadius: Rayons.lg,
    },
    titreSectionAvecIcone: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
        fontWeight: '700',
        marginBottom: 12,
    },
    barreConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    barreFond: {
        flex: 1,
        height: 10,
        backgroundColor: '#E8E8E8',
        borderRadius: 5,
        overflow: 'hidden',
    },
    barreRemplie: {
        height: '100%',
        borderRadius: 5,
    },
    noteTexte: {
        fontWeight: '700',
        fontSize: Typographie.tailles.lg,
        width: 42,
        textAlign: 'right',
    },
    barreLegende: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    barreLegendeTexte: {
        fontSize: 9,
        color: '#BBB',
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statTexte: {
        color: '#999',
        fontSize: Typographie.tailles.sm,
    },
    ligneIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconeConteneur: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    etiquette: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    valeur: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.md,
        fontWeight: '500',
        marginTop: 2,
    },
    texteComplet: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        lineHeight: 22,
    },
    boutonContact: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 18,
        borderRadius: Rayons.xl,
        marginTop: 4,
    },
    boutonContactLabel: {
        color: '#FFF',
        fontSize: Typographie.tailles.sm,
        fontWeight: '600',
        opacity: 0.9,
    },
    boutonContactNumero: {
        color: '#FFF',
        fontSize: Typographie.tailles.lg,
        fontWeight: '800',
    },
});
