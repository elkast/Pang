// =============================================================================
// IvoCulture — Écran Détail de Région
// Header coloré + contenus culturels de la région
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { Chargement, CarteContenu, EtatVide } from '../composants';
import { useDetailRegion, useContenusRegion } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');
type RouteRegion = RouteProp<RootStackParamList, 'DetailRegion'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranDetailRegion() {
    const route = useRoute<RouteRegion>();
    const navigation = useNavigation<Nav>();
    const { region_id } = route.params;

    const { data: region, isLoading: chargementRegion } = useDetailRegion(region_id);
    const { data: contenus, isLoading: chargementContenus } = useContenusRegion(region_id);

    if (chargementRegion) {
        return <Chargement message="Chargement de la région..." />;
    }

    return (
        <View style={styles.conteneur}>
            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.boutonRetour}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>

            <Animated.ScrollView showsVerticalScrollIndicator={false}>
                {/* Header immersif */}
                <View style={[styles.header, { backgroundColor: region?.couleur_theme || Couleurs.foret.principal }]}>
                    {region?.image_url && (
                        <Image
                            source={{ uri: region.image_url }}
                            style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
                        />
                    )}
                    <View style={styles.overlay} />
                    <View style={styles.headerContenu}>
                        <Animated.View entering={FadeIn.delay(300)}>
                            <Text style={styles.labelRegion}>RÉGION</Text>
                            <Text style={styles.nomRegion}>{region?.nom || 'Région'}</Text>
                        </Animated.View>
                    </View>
                </View>

                {/* Corps */}
                <View style={styles.corps}>
                    <Animated.View entering={FadeInUp.delay(200)}>
                        <Text style={styles.description}>{region?.description}</Text>
                    </Animated.View>

                    <Text style={styles.titreSection}>Contenus culturels</Text>

                    {chargementContenus ? (
                        <Chargement message="" taille="small" pleinEcran={false} />
                    ) : contenus && contenus.length > 0 ? (
                        contenus.map((item: any, index: number) => (
                            <CarteContenu
                                key={item.id}
                                contenu={item}
                                index={index}
                                onPress={() => navigation.navigate('DetailContenu', { id: item.id })}
                            />
                        ))
                    ) : (
                        <EtatVide
                            icone="library-outline"
                            titre="Aucun contenu pour cette région"
                            sousTitre="Soyez le premier à contribuer !"
                            texteBouton="Ajouter un contenu"
                            onPressBouton={() => navigation.navigate('Contribution')}
                            couleurIcone={region?.couleur_theme}
                        />
                    )}

                    <View style={{ height: 100 }} />
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
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 280,
        width,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerContenu: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    labelRegion: {
        color: Couleurs.or.doux,
        fontSize: Typographie.tailles.xs,
        fontWeight: '700',
        letterSpacing: 2,
    },
    nomRegion: {
        color: '#FFF',
        fontSize: Typographie.tailles.titre,
        fontWeight: Typographie.poids.bold,
        marginTop: 4,
    },
    corps: {
        backgroundColor: Couleurs.fond.primaire,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -24,
        paddingTop: 24,
        paddingHorizontal: 20,
        minHeight: 400,
    },
    description: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        lineHeight: 26,
        marginBottom: 24,
    },
    titreSection: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
        marginBottom: 16,
    },
});
