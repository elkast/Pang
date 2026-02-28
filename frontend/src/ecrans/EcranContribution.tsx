// =============================================================================
// IvoCulture — Écran Contribution
// Formulaire unifié pour créer un nouveau contenu culturel
// =============================================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons, TYPES_CONTENU_FORMULAIRE } from '../constantes';
import { EnteteEcran, ChampSaisie, BoutonPrincipal } from '../composants';
import { useCreerContenu, useRegions } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranContribution() {
    const navigation = useNavigation<Nav>();
    const { data: regions } = useRegions();
    const mutation = useCreerContenu();

    const [titre, setTitre] = useState('');
    const [typeContenu, setTypeContenu] = useState('');
    const [description, setDescription] = useState('');
    const [texteComplet, setTexteComplet] = useState('');
    const [regionId, setRegionId] = useState<number | null>(null);
    const [etape, setEtape] = useState(1);

    const soumettre = () => {
        if (!titre || !typeContenu || !description) {
            Alert.alert('Champs manquants', 'Veuillez remplir le titre, le type et la description.');
            return;
        }
        mutation.mutate(
            {
                titre,
                type_contenu: typeContenu,
                description,
                texte_complet: texteComplet,
                region_id: regionId || 1,
                image_url: 'https://images.unsplash.com/photo-1542104473-ebcf1d44005e?w=600',
                tags: [],
            },
            {
                onSuccess: () => {
                    Alert.alert('Succès', 'Votre contribution a été publiée !');
                    navigation.goBack();
                },
                onError: () => {
                    Alert.alert('Erreur', 'Connectez-vous pour publier un contenu.');
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.conteneur}>
                <EnteteEcran titre="Contribuer" />

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Étape indicator */}
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <View style={styles.etapes}>
                            <View style={[styles.etapeDot, etape >= 1 && styles.etapeDotActif]} />
                            <View style={styles.etapeLigne} />
                            <View style={[styles.etapeDot, etape >= 2 && styles.etapeDotActif]} />
                        </View>
                        <Text style={styles.etapeTitre}>
                            {etape === 1 ? 'Étape 1: Nature du Savoir' : 'Étape 2: Détails'}
                        </Text>
                    </Animated.View>

                    {etape === 1 ? (
                        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                            {/* Sélection type */}
                            <Text style={styles.label}>Catégorie du contenu *</Text>
                            <View style={styles.grillTypes}>
                                {TYPES_CONTENU_FORMULAIRE.map((type) => (
                                    <TouchableOpacity
                                        key={type.valeur}
                                        style={[
                                            styles.chipType,
                                            typeContenu === type.valeur && styles.chipTypeActif,
                                        ]}
                                        onPress={() => setTypeContenu(type.valeur)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipTypeTexte,
                                                typeContenu === type.valeur && styles.chipTypeTexteActif,
                                            ]}
                                        >
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <ChampSaisie
                                label="Titre du savoir *"
                                placeholder="Ex: Le Masque Gouro, Sauce Graine..."
                                value={titre}
                                onChangeText={setTitre}
                            />

                            <ChampSaisie
                                label="Description courte *"
                                placeholder="Décrivez l'origine, la signification et les aspects clés"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                            />

                            {/* Sélection région */}
                            <Text style={styles.label}>Région associée</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {regions?.map((r: any) => (
                                    <TouchableOpacity
                                        key={r.id}
                                        style={[
                                            styles.chipRegion,
                                            regionId === r.id && styles.chipRegionActif,
                                        ]}
                                        onPress={() => setRegionId(r.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.chipRegionTexte,
                                                regionId === r.id && styles.chipRegionTexteActif,
                                            ]}
                                        >
                                            {r.nom}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <BoutonPrincipal
                                titre="Suivant"
                                onPress={() => {
                                    if (!titre || !typeContenu || !description) {
                                        Alert.alert('Champs manquants', 'Remplissez les champs obligatoires.');
                                        return;
                                    }
                                    setEtape(2);
                                }}
                            />
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.duration(400)}>
                            <ChampSaisie
                                label="Histoire complète (optionnel)"
                                placeholder="Partagez l'histoire, la signification et les traditions liées..."
                                value={texteComplet}
                                onChangeText={setTexteComplet}
                                multiline
                                numberOfLines={8}
                                style={{ height: 180, textAlignVertical: 'top' }}
                            />

                            <View style={styles.ligneEtape2}>
                                <BoutonPrincipal
                                    titre="Retour"
                                    onPress={() => setEtape(1)}
                                    variante="contour"
                                    style={{ flex: 1 }}
                                />
                                <BoutonPrincipal
                                    titre="Publier le savoir"
                                    onPress={soumettre}
                                    chargement={mutation.isPending}
                                    couleur={Couleurs.foret.principal}
                                    style={{ flex: 1 }}
                                />
                            </View>
                        </Animated.View>
                    )}
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    etapes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
        gap: 0,
    },
    etapeDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Couleurs.fond.surface,
    },
    etapeDotActif: {
        backgroundColor: Couleurs.accent.principal,
    },
    etapeLigne: {
        width: 60,
        height: 2,
        backgroundColor: Couleurs.fond.surface,
    },
    etapeTitre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.bold,
        textAlign: 'center',
        marginBottom: 24,
    },
    label: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        fontWeight: Typographie.poids.medium,
        marginBottom: 10,
        marginTop: 8,
    },
    grillTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    chipType: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.carte,
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
    },
    chipTypeActif: {
        backgroundColor: Couleurs.accent.principal + '20',
        borderColor: Couleurs.accent.principal,
    },
    chipTypeTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
    },
    chipTypeTexteActif: {
        color: Couleurs.accent.principal,
        fontWeight: Typographie.poids.bold,
    },
    chipRegion: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.carte,
        marginRight: 8,
    },
    chipRegionActif: {
        backgroundColor: Couleurs.foret.principal,
    },
    chipRegionTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
    },
    chipRegionTexteActif: {
        color: '#FFF',
        fontWeight: Typographie.poids.bold,
    },
    ligneEtape2: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
});
