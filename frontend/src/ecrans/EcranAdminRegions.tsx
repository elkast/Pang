// =============================================================================
// IvoCulture — Écran Admin Régions
// CRUD régions : liste, ajout, modification
// =============================================================================

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
    Image,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useRegionsAdmin, useCreerRegion, useModifierRegion, useSupprimerRegion } from '../hooks/useAdmin';

function FormRegion({ initial, onSave, onCancel }: any) {
    const [nom, setNom] = useState(initial?.nom || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
    const [couleur, setCouleur] = useState(initial?.couleur_theme || '#E67E22');

    return (
        <View style={styles.form}>
            <Text style={styles.formTitre}>{initial ? 'Modifier la région' : 'Nouvelle région'}</Text>
            <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom de la région" placeholderTextColor={Couleurs.texte.desactive} />
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor={Couleurs.texte.desactive} multiline />
            <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="URL de l'image" placeholderTextColor={Couleurs.texte.desactive} />
            <TextInput style={styles.input} value={couleur} onChangeText={setCouleur} placeholder="Couleur (#E67E22)" placeholderTextColor={Couleurs.texte.desactive} />
            <View style={styles.formActions}>
                <TouchableOpacity style={styles.boutonAnnuler} onPress={onCancel}>
                    <Text style={styles.boutonAnnulerTexte}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.boutonSauver}
                    onPress={() => {
                        if (!nom.trim()) { Alert.alert('Erreur', 'Le nom est requis'); return; }
                        onSave({ nom, description, image_url: imageUrl, couleur_theme: couleur });
                    }}
                >
                    <Text style={styles.boutonSauverTexte}>{initial ? 'Modifier' : 'Créer'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function EcranAdminRegions() {
    const navigation = useNavigation<any>();
    const { data: regions, isLoading } = useRegionsAdmin();
    const creerMutation = useCreerRegion();
    const modifierMutation = useModifierRegion();
    const supprimerMutation = useSupprimerRegion();
    const [showForm, setShowForm] = useState(false);
    const [editRegion, setEditRegion] = useState<any>(null);

    const handleSave = async (donnees: any) => {
        try {
            if (editRegion) {
                await modifierMutation.mutateAsync({ id: editRegion.id, donnees });
            } else {
                await creerMutation.mutateAsync(donnees);
            }
            setShowForm(false);
            setEditRegion(null);
        } catch {
            Alert.alert('Erreur', 'Impossible de sauvegarder la région');
        }
    };

    const handleSupprimer = (region: any) => {
        Alert.alert('Supprimer la région ?', region.nom, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await supprimerMutation.mutateAsync(region.id);
                    } catch {
                        Alert.alert('Erreur', 'Impossible de supprimer (des contenus lui sont associés ?)');
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.conteneur}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titre}>Régions</Text>
                    <Text style={styles.sousTitre}>{regions?.length || 0} régions</Text>
                </View>
                <TouchableOpacity
                    style={styles.boutonAjouter}
                    onPress={() => { setEditRegion(null); setShowForm(true); }}
                >
                    <Ionicons name="add" size={22} color="#FFF" />
                    <Text style={styles.boutonAjouterTexte}>Nouvelle</Text>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liste}>
                {showForm && (
                    <FormRegion
                        initial={editRegion}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditRegion(null); }}
                    />
                )}
                {isLoading ? (
                    <View style={styles.centrer}>
                        <ActivityIndicator size="large" color={Couleurs.accent.principal} />
                    </View>
                ) : (
                    regions?.map((region: any, i: number) => (
                        <Animated.View key={region.id} entering={FadeInDown.delay(i * 50).duration(400)}>
                            <View style={styles.carte}>
                                <View style={[styles.bandeCouleur, { backgroundColor: region.couleur_theme || Couleurs.accent.principal }]} />
                                {region.image_url ? (
                                    <Image source={{ uri: region.image_url }} style={styles.image} />
                                ) : (
                                    <View style={[styles.image, { backgroundColor: Couleurs.fond.surface, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="map-outline" size={24} color={Couleurs.accent.principal} />
                                    </View>
                                )}
                                <View style={styles.info}>
                                    <Text style={styles.nomRegion}>{region.nom}</Text>
                                    <Text style={styles.descRegion} numberOfLines={2}>{region.description}</Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.boutonAction, { backgroundColor: '#3498DB20' }]}
                                        onPress={() => { setEditRegion(region); setShowForm(true); }}
                                    >
                                        <Ionicons name="create-outline" size={18} color="#3498DB" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.boutonAction, { backgroundColor: '#E74C3C20' }]}
                                        onPress={() => handleSupprimer(region)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    ))
                )}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    entete: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
        gap: 14,
        borderBottomWidth: 1,
        borderBottomColor: Couleurs.fond.surface,
    },
    retour: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titre: { color: Couleurs.texte.primaire, fontSize: Typographie.tailles.xxl, fontWeight: '800' },
    sousTitre: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.sm },
    boutonAjouter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Couleurs.accent.principal,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
    },
    boutonAjouterTexte: { color: '#FFF', fontWeight: '700', fontSize: Typographie.tailles.sm },
    liste: { padding: 16 },
    form: {
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    formTitre: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.lg, marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
        borderRadius: Rayons.md,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.md,
        marginBottom: 10,
    },
    formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
    boutonAnnuler: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: Rayons.md,
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
        alignItems: 'center',
    },
    boutonAnnulerTexte: { color: Couleurs.texte.secondaire, fontWeight: '600' },
    boutonSauver: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: Rayons.md,
        backgroundColor: Couleurs.accent.principal,
        alignItems: 'center',
    },
    boutonSauverTexte: { color: '#FFF', fontWeight: '700' },
    carte: {
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    bandeCouleur: { width: 4, height: '100%', borderRadius: 2, position: 'absolute', left: 0 },
    image: { width: 56, height: 56, borderRadius: Rayons.md, marginLeft: 8 },
    info: { flex: 1 },
    nomRegion: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.md },
    descRegion: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.sm, marginTop: 2 },
    actions: { gap: 8 },
    boutonAction: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centrer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
});
