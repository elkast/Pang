// =============================================================================
// IvoCulture — Écran Portails d'Ivoire
// Liste des régions avec images immersives
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { Chargement, EtatVide } from '../composants';
import { useRegions } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranPortails() {
    const navigation = useNavigation<Nav>();
    const { data: regions, isLoading, refetch } = useRegions();

    if (isLoading) {
        return <Chargement message="Chargement des régions..." />;
    }

    return (
        <View style={styles.conteneur}>
            <View style={styles.entete}>
                <Text style={styles.titre}>Portails d'Ivoire</Text>
                <Text style={styles.sousTitre}>
                    Explorez les régions culturelles
                </Text>
            </View>

            <FlatList
                data={regions || []}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.liste}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isLoading}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
                        <TouchableOpacity
                            style={styles.carte}
                            onPress={() =>
                                navigation.navigate('DetailRegion', {
                                    region_id: item.id,
                                    nom: item.nom,
                                })
                            }
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: item.image_url || '' }}
                                style={styles.image}
                            />
                            <View style={styles.overlay}>
                                <Text style={styles.nomRegion}>{item.nom}</Text>
                                <Text style={styles.descRegion} numberOfLines={2}>
                                    {item.description}
                                </Text>
                                <View style={styles.decouvrir}>
                                    <Ionicons name="location" size={14} color="#FFF" />
                                    <Text style={styles.texteDecouvrir}>Découvrir</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                ListEmptyComponent={
                    <EtatVide
                        icone="map-outline"
                        titre="Aucune région"
                        sousTitre="Les régions seront bientôt disponibles."
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    entete: {
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: Typographie.poids.bold,
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        marginTop: 4,
    },
    liste: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 100,
    },
    carte: {
        height: 180,
        borderRadius: Rayons.xl,
        overflow: 'hidden',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
        padding: 20,
    },
    nomRegion: {
        color: '#FFF',
        fontSize: Typographie.tailles.xxl,
        fontWeight: Typographie.poids.bold,
    },
    descRegion: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: Typographie.tailles.md,
        marginTop: 4,
    },
    decouvrir: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    texteDecouvrir: {
        color: '#FFF',
        fontSize: Typographie.tailles.sm,
    },
});
