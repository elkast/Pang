// =============================================================================
// IvoCulture — Écran Favoris
// Liste des contenus favoris de l'utilisateur connecté
// =============================================================================

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Couleurs } from '../constantes';
import { EnteteEcran, Chargement, EtatVide, CarteContenu } from '../composants';
import { useFavoris } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranFavoris() {
    const navigation = useNavigation<Nav>();
    const { data: favoris, isLoading, refetch } = useFavoris();

    return (
        <View style={styles.conteneur}>
            <EnteteEcran titre="Mes Favoris" />

            {isLoading ? (
                <Chargement message="Chargement des favoris..." />
            ) : (
                <FlatList
                    data={favoris || []}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.liste}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                    renderItem={({ item, index }) => (
                        <CarteContenu
                            contenu={item}
                            index={index}
                            onPress={() => navigation.navigate('DetailContenu', { id: item.id })}
                        />
                    )}
                    ListEmptyComponent={
                        <EtatVide
                            icone="heart-outline"
                            titre="Pas encore de favoris"
                            sousTitre="Explorez les contenus culturels et ajoutez vos préférés."
                            texteBouton="Explorer"
                            onPressBouton={() => navigation.goBack()}
                            couleurIcone={Couleurs.accent.principal}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    liste: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
