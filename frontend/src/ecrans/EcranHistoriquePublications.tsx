// =============================================================================
// IvoCulture — Historique des publications de l'utilisateur
// =============================================================================

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie } from '../constantes';
import { EnteteEcran, Chargement, EtatVide, CarteContenu } from '../composants';
import { useHistoriquePublications } from '../hooks/useHistorique';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranHistoriquePublications() {
    const navigation = useNavigation<Nav>();
    const { data: publications, isLoading, refetch } = useHistoriquePublications();

    return (
        <View style={styles.conteneur}>
            <EnteteEcran titre="Mes Publications" />
            {isLoading ? (
                <Chargement message="Chargement de l'historique..." />
            ) : (
                <FlatList
                    data={publications || []}
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
                            icone="document-text-outline"
                            titre="Aucune publication"
                            sousTitre="Vos contributions apparaîtront ici."
                            texteBouton="Contribuer"
                            onPressBouton={() => navigation.navigate('Contribution')}
                            couleurIcone={Couleurs.accent.principal}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    liste: { paddingHorizontal: 20, paddingBottom: 100 },
});
