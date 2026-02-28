// =============================================================================
// IvoCulture — Écran d'Accueil
// Page principale : bannière, catégories, recommandations, régions
// =============================================================================

import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons, CATEGORIES } from '../constantes';
import { Chargement, CarteContenu } from '../composants';
import { useRecommandations, useRegions } from '../hooks/useContenus';
import { usePromotionsFeatured } from '../hooks/usePromotions';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranAccueil() {
    const navigation = useNavigation<Nav>();
    const [refreshing, setRefreshing] = useState(false);

    // Utiliser useFocusEffect pour rafraîchir les données à chaque affichage
    useFocusEffect(
        useCallback(() => {
            // Les données seront automatiquement rafraîchies grâce à React Query
        }, [])
    );

    const { data: recommandations, isLoading: chargementReco, refetch: refreshReco } = useRecommandations();
    const { data: regions, refetch: refreshRegions } = useRegions();
    const { data: promotionsFeatured } = usePromotionsFeatured();

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                refreshReco(),
                refreshRegions()
            ]);
        } finally {
            setRefreshing(false);
        }
    }, [refreshReco, refreshRegions]);

    const allerVersCategorie = (typeContenu: string) => {
        navigation.navigate('Categorie', { typeContenu });
    };

    return (
        <View style={styles.conteneur}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Couleurs.accent.principal}
                        colors={[Couleurs.accent.principal]}
                    />
                }
            >
                {/* En-tête */}
                <Animated.View entering={FadeInDown.duration(500)}>
                    <View style={styles.entete}>
                        <View>
                            <Text style={styles.salutation}>Trésors d'Ivoire</Text>
                            <Text style={styles.titreEntete}>Explorer la culture</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.boutonFavoris}
                            onPress={() => navigation.navigate('Favoris')}
                        >
                            <Ionicons name="heart" size={22} color={Couleurs.accent.principal} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Bannière */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)}>
                    <TouchableOpacity
                        style={styles.banniere}
                        onPress={() => navigation.navigate('Portails')}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1516617171622-32994d23f543?w=800' }}
                            style={styles.imageBanniere}
                            resizeMode="cover"
                        />
                        <View style={styles.overlayBanniere}>
                            <Text style={styles.badgeBanniere}>DÉCOUVERTE</Text>
                            <Text style={styles.titreBanniere}>L'âme de la Côte d'Ivoire</Text>
                            <Text style={styles.sousTitreBanniere}>
                                Explorez notre héritage culturel ancestral
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Promotions à la Une */}
                {promotionsFeatured && promotionsFeatured.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(150).duration(500)}>
                        <View style={styles.section}>
                            <View style={styles.ligneTitre}>
                                <Text style={styles.titreSection}>✨ À la Une</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Principal')}>
                                    <Text style={styles.voirTout}>Voir tout</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20 }}>
                                {promotionsFeatured.map((promo: any) => (
                                    <TouchableOpacity
                                        key={promo.id}
                                        style={styles.cartePromotion}
                                        onPress={() => navigation.navigate('DetailPromotion', { id: promo.id })}
                                        activeOpacity={0.85}
                                    >
                                        <Image
                                            source={{ uri: promo.image_url || 'https://picsum.photos/300/200' }}
                                            style={styles.imagePromotion}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.overlayPromotion}>
                                            <View style={styles.badgePopularite}>
                                                <Text style={styles.texteBadgePopularite}>★ {promo.note_popularite}</Text>
                                            </View>
                                            <Text style={styles.titrePromotion} numberOfLines={2}>{promo.titre}</Text>
                                            <Text style={styles.typePromotion}>{promo.type_promotion?.toUpperCase()}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Animated.View>
                )}

                {/* Catégories */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <View style={styles.section}>
                        <Text style={styles.titreSection}>Explorer par Thèmes</Text>
                        <View style={styles.grilleCategories}>
                            {CATEGORIES.map((cat, index) => (
                                <Animated.View
                                    key={cat.id}
                                    entering={FadeInDown.delay(250 + index * 50).springify()}
                                >
                                    <TouchableOpacity
                                        style={[styles.carteCategorie, { borderColor: cat.couleur + '30' }]}
                                        onPress={() => allerVersCategorie(cat.typeContenu)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.iconeCategorie, { backgroundColor: cat.couleur + '20' }]}>
                                            <Ionicons name={cat.icone as any} size={26} color={cat.couleur} />
                                        </View>
                                        <Text style={styles.nomCategorie}>{cat.nom.split(' ')[0]}</Text>
                                        <Text style={styles.descCategorie} numberOfLines={1}>
                                            {cat.sousTitre.substring(0, 30)}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                {/* Recommandations avec images mieux recadrées */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                    <View style={styles.section}>
                        <View style={styles.ligneTitre}>
                            <Text style={styles.titreSection}>Recommandations</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Decouverte')}>
                                <Text style={styles.voirTout}>Voir tout</Text>
                            </TouchableOpacity>
                        </View>
                        {chargementReco ? (
                            <Chargement message="" taille="small" pleinEcran={false} />
                        ) : (
                            <>
                                {/* Grande carte pour le premier contenu */}
                                {recommandations && recommandations.length > 0 && (
                                    <TouchableOpacity
                                        style={styles.uneReco}
                                        onPress={() => navigation.navigate('DetailContenu', { id: recommandations[0].id })}
                                        activeOpacity={0.9}
                                    >
                                        <Image
                                            source={{ uri: recommandations[0].image_url || 'https://picsum.photos/600/400' }}
                                            style={styles.imageUneReco}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.overlayUneReco}>
                                            <View style={[styles.badgeReco, { backgroundColor: Couleurs.accent.principal }]}>
                                                <Text style={styles.texteBadgeReco}>
                                                    {recommandations[0].type_contenu?.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Text style={styles.titreUneReco} numberOfLines={2}>
                                                {recommandations[0].titre}
                                            </Text>
                                            <Text style={styles.descUneReco} numberOfLines={2}>
                                                {recommandations[0].description}
                                            </Text>
                                            <View style={styles.statsUneReco}>
                                                <View style={styles.statItem}>
                                                    <Ionicons name="eye" size={14} color="#FFF" />
                                                    <Text style={styles.statText}>{recommandations[0].vues || 0}</Text>
                                                </View>
                                                <View style={styles.statItem}>
                                                    <Ionicons name="heart" size={14} color="#FFF" />
                                                    <Text style={styles.statText}>{recommandations[0].likes || 0}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}

                                {/* Autres recommandations en grille */}
                                <View style={styles.grilleRecos}>
                                    {recommandations?.slice(1, 4).map((contenu: any, index: number) => (
                                        <TouchableOpacity
                                            key={contenu.id}
                                            style={styles.carteReco}
                                            onPress={() => navigation.navigate('DetailContenu', { id: contenu.id })}
                                            activeOpacity={0.85}
                                        >
                                            <Image
                                                source={{ uri: contenu.image_url || 'https://picsum.photos/300/200' }}
                                                style={styles.imageCarteReco}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.overlayCarteReco}>
                                                <Text style={styles.titreCarteReco} numberOfLines={2}>
                                                    {contenu.titre}
                                                </Text>
                                                <Text style={styles.sousTitreCarteReco} numberOfLines={1}>
                                                    {contenu.vues || 0} vues
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                </Animated.View>

                {/* Régions */}
                <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                    <View style={styles.section}>
                        <View style={styles.ligneTitre}>
                            <Text style={styles.titreSection}>Régions</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Portails')}>
                                <Text style={styles.voirTout}>Voir tout</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {regions?.slice(0, 5).map((region: any) => (
                                <TouchableOpacity
                                    key={region.id}
                                    style={styles.carteRegion}
                                    onPress={() =>
                                        navigation.navigate('DetailRegion', {
                                            region_id: region.id,
                                            nom: region.nom,
                                        })
                                    }
                                    activeOpacity={0.85}
                                >
                                    <Image
                                        source={{ uri: region.image_url || 'https://picsum.photos/300/200' }}
                                        style={styles.imageRegion}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.overlayRegion}>
                                        <Text style={styles.nomRegion}>{region.nom}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>

                {/* Bouton contribuer */}
                <Animated.View entering={FadeInDown.delay(600).duration(500)}>
                    <TouchableOpacity
                        style={styles.boutonContribuer}
                        onPress={() => navigation.navigate('Contribution')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="add-circle" size={24} color="#FFF" />
                        <Text style={styles.texteContribuer}>Confier au savoir</Text>
                    </TouchableOpacity>
                </Animated.View>

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
    scrollContent: {
        flexGrow: 1,
    },
    entete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 8,
    },
    salutation: {
        color: Couleurs.accent.principal,
        fontSize: Typographie.tailles.sm,
        fontWeight: Typographie.poids.bold,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    titreEntete: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: Typographie.poids.bold,
        marginTop: 2,
    },
    boutonFavoris: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Bannière
    banniere: {
        marginHorizontal: 20,
        marginTop: 12,
        height: 180,
        borderRadius: Rayons.xl,
        overflow: 'hidden',
    },
    imageBanniere: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayBanniere: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
        padding: 20,
    },
    badgeBanniere: {
        color: Couleurs.accent.principal,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 4,
    },
    titreBanniere: {
        color: '#FFF',
        fontSize: Typographie.tailles.xxl,
        fontWeight: Typographie.poids.bold,
    },
    sousTitreBanniere: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Typographie.tailles.md,
        marginTop: 2,
    },
    // Sections
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    ligneTitre: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titreSection: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
    },
    voirTout: {
        color: Couleurs.accent.vert,
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.medium,
    },
    // Catégories
    grilleCategories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    carteCategorie: {
        width: (width - 52) / 2,
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    iconeCategorie: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    nomCategorie: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.semiBold,
    },
    descCategorie: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        marginTop: 2,
    },

    // Recommandations - Grande carte
    uneReco: {
        height: 220,
        borderRadius: Rayons.xl,
        overflow: 'hidden',
        marginBottom: 12,
    },
    imageUneReco: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayUneReco: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        padding: 16,
    },
    badgeReco: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    texteBadgeReco: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    titreUneReco: {
        color: '#FFF',
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
        marginBottom: 4,
    },
    descUneReco: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: Typographie.tailles.sm,
        lineHeight: 18,
    },
    statsUneReco: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        color: '#FFF',
        fontSize: Typographie.tailles.sm,
    },

    // Grille des autres reco
    grilleRecos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    carteReco: {
        width: (width - 52) / 2,
        height: 140,
        borderRadius: Rayons.lg,
        overflow: 'hidden',
        marginBottom: 12,
    },
    imageCarteReco: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayCarteReco: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: 10,
    },
    titreCarteReco: {
        color: '#FFF',
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.semiBold,
    },
    sousTitreCarteReco: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: Typographie.tailles.xs,
        marginTop: 2,
    },

    // Promotions
    cartePromotion: {
        width: 200,
        height: 150,
        borderRadius: Rayons.lg,
        overflow: 'hidden',
        marginRight: 12,
    },
    imagePromotion: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayPromotion: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
        padding: 12,
    },
    badgePopularite: {
        alignSelf: 'flex-start',
        backgroundColor: Couleurs.accent.principal,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        marginBottom: 6,
    },
    texteBadgePopularite: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    titrePromotion: {
        color: '#FFF',
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.bold,
    },
    typePromotion: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: Typographie.tailles.xs,
        marginTop: 2,
    },
    // Régions
    carteRegion: {
        width: 160,
        height: 110,
        borderRadius: Rayons.lg,
        overflow: 'hidden',
        marginRight: 12,
    },
    imageRegion: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayRegion: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
        padding: 12,
    },
    nomRegion: {
        color: '#FFF',
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.semiBold,
    },
    // Contribuer
    boutonContribuer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: Rayons.lg,
        backgroundColor: Couleurs.accent.principal,
    },
    texteContribuer: {
        color: '#FFF',
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.bold,
    },
});
