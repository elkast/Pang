// =============================================================================
// IvoCulture — Écran Détail d'un Contenu Culturel
// Image parallax, storytelling immersif, actions (like, favori)
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Alert } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    FadeIn,
    SlideInDown,
} from 'react-native-reanimated';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons, obtenirCouleurCategorie } from '../constantes';
import { Chargement } from '../composants';
import { useDetailContenu, useLikerContenu, useAjouterFavori } from '../hooks/useContenus';
import { useSignalerContenu } from '../hooks/useSignalement';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');
const HAUTEUR_HEADER = 380;

type RouteDetail = RouteProp<RootStackParamList, 'DetailContenu'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranDetailContenu() {
    const route = useRoute<RouteDetail>();
    const navigation = useNavigation<Nav>();
    const { id } = route.params;

    const { data: contenu, isLoading } = useDetailContenu(id);
    const mutationLike = useLikerContenu();
    const mutationFavori = useAjouterFavori();
    const mutationSignaler = useSignalerContenu();

    // Animation parallax
    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const styleHeader = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [-100, 0, HAUTEUR_HEADER],
                    [50, 0, -HAUTEUR_HEADER / 2],
                    Extrapolation.CLAMP
                ),
            },
            {
                scale: interpolate(
                    scrollY.value,
                    [-100, 0],
                    [1.4, 1],
                    { extrapolateRight: Extrapolation.CLAMP }
                ),
            },
        ],
    }));

    if (isLoading) {
        return <Chargement message="Chargement du contenu..." />;
    }

    if ((contenu as any)?.is_verrouille) {
        return (
            <View style={[styles.conteneur, { justifyContent: 'center', padding: 24 }]}>
                <Text style={{ fontSize: 18, textAlign: 'center', color: Couleurs.etat.erreur }}>
                    Ce contenu a été verrouillé après plusieurs signalements (fausse information).
                </Text>
            </View>
        );
    }

    const titre = contenu?.titre || '';
    const type = contenu?.type_contenu || '';
    const texte = contenu?.texte_complet || contenu?.description || '';
    const image = contenu?.image_url || 'https://picsum.photos/600/400';
    const couleurType = obtenirCouleurCategorie(type);

    return (
        <View style={styles.conteneur}>
            {/* Image header avec parallax */}
            <Animated.View style={[styles.header, styleHeader]}>
                <Animated.Image
                    source={{ uri: image }}
                    style={styles.headerImage}
                    entering={SlideInDown.duration(600)}
                />
                <View style={styles.headerGradient} />
            </Animated.View>

            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.boutonRetour}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>

            {/* Contenu scrollable */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.corps}>
                    {/* Badge type */}
                    <Animated.View entering={FadeIn.delay(300)}>
                        <View style={[styles.badge, { backgroundColor: couleurType }]}>
                            <Text style={styles.texteBadge}>{type.toUpperCase()}</Text>
                        </View>
                    </Animated.View>

                    {/* Titre */}
                    <Animated.View entering={FadeIn.delay(400)}>
                        <Text style={styles.titre}>{titre}</Text>
                    </Animated.View>

                    {/* Stats + Actions */}
                    <Animated.View entering={FadeIn.delay(500)}>
                        <View style={styles.ligneStats}>
                            <View style={styles.stats}>
                                <View style={styles.stat}>
                                    <Ionicons name="eye-outline" size={16} color={Couleurs.texte.secondaire} />
                                    <Text style={styles.texteStat}>{contenu?.vues || 0}</Text>
                                </View>
                                <View style={styles.stat}>
                                    <Ionicons name="heart" size={16} color={Couleurs.accent.principal} />
                                    <Text style={styles.texteStat}>{contenu?.likes || 0}</Text>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.boutonAction}
                                    onPress={() => mutationLike.mutate(id)}
                                >
                                    <Ionicons name="heart-outline" size={22} color={Couleurs.accent.principal} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.boutonAction}
                                    onPress={() => mutationFavori.mutate(id)}
                                >
                                    <Ionicons name="bookmark-outline" size={22} color={Couleurs.foret.principal} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.boutonAction}
                                    onPress={() => {
                                        Alert.alert(
                                            'Signaler',
                                            'Signaler ce contenu comme fausse information ou inapproprié ? (5 signalements = verrouillage)',
                                            [
                                                { text: 'Annuler', style: 'cancel' },
                                                {
                                                    text: 'Signaler',
                                                    style: 'destructive',
                                                    onPress: () => mutationSignaler.mutate({ contenuId: id, motif: 'fausse_info' }),
                                                },
                                            ]
                                        );
                                    }}
                                >
                                    <Ionicons name="flag-outline" size={22} color={Couleurs.etat.attention} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Signification culturelle */}
                    {contenu?.metadata_extra?.signification && (
                        <Animated.View entering={FadeIn.delay(600)}>
                            <View style={styles.encadre}>
                                <Text style={styles.encadreTitre}>🏛️ Signification Culturelle</Text>
                                <Text style={styles.encadreTexte}>
                                    {contenu.metadata_extra.signification}
                                </Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* Corps du texte */}
                    <Animated.View entering={FadeIn.delay(700)}>
                        <Text style={styles.corpsTexte}>{texte}</Text>
                    </Animated.View>

                    <View style={{ height: 80 }} />
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    boutonRetour: {
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 10,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HAUTEUR_HEADER,
        zIndex: 1,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    scrollContent: {
        paddingTop: HAUTEUR_HEADER - 40,
        paddingBottom: 40,
    },
    corps: {
        backgroundColor: Couleurs.fond.primaire,
        minHeight: height,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 24,
        paddingHorizontal: 24,
        zIndex: 10,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Rayons.complet,
        marginBottom: 12,
    },
    texteBadge: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: Typographie.poids.bold,
        marginBottom: 16,
        lineHeight: 36,
    },
    ligneStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    stats: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    texteStat: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    boutonAction: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
    },
    encadre: {
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: Couleurs.accent.principal,
    },
    encadreTitre: {
        color: Couleurs.accent.principal,
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.bold,
        marginBottom: 8,
    },
    encadreTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        lineHeight: 22,
    },
    corpsTexte: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
        lineHeight: 28,
    },
});
