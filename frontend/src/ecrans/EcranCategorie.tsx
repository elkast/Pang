// =============================================================================
// IvoCulture — Écran Catégorie Générique
// UN SEUL composant remplace les 6 écrans dupliqués
// (Masques, Gastronomie, Légendes, Sites, Musique, Rituel)
// =============================================================================

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Couleurs } from '../constantes';
import { obtenirCategorieParType } from '../constantes/categories';
import { EnteteEcran, Chargement, EtatVide, CarteContenu } from '../composants';
import { useContenusParType } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

type RouteCategorie = RouteProp<RootStackParamList, 'Categorie'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranCategorie() {
    const route = useRoute<RouteCategorie>();
    const navigation = useNavigation<Nav>();
    const { typeContenu } = route.params;

    const config = obtenirCategorieParType(typeContenu);
    const { data: contenus, isLoading, refetch } = useContenusParType(typeContenu);

    if (!config) return null;

    if (isLoading) {
        return (
            <View style={styles.conteneur}>
                <EnteteEcran titre={config.nom} />
                <Chargement message={`Chargement des ${config.nom.toLowerCase()}...`} />
            </View>
        );
    }

    return (
        <View style={styles.conteneur}>
            <EnteteEcran titre={config.nom} />
            <FlatList
                data={contenus || []}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.liste}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isLoading}
                renderItem={({ item, index }) => (
                    <CarteContenu
                        contenu={item}
                        index={index}
                        variante="vertical"
                        onPress={() => navigation.navigate('DetailContenu', { id: item.id })}
                    />
                )}
                ListEmptyComponent={
                    <EtatVide
                        icone={config.iconeVide}
                        titre={config.texteVide}
                        sousTitre={config.sousTexteVide}
                        couleurIcone={config.couleur}
                        texteBouton="Contribuer"
                        onPressBouton={() => navigation.navigate('Contribution')}
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
    liste: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
});
