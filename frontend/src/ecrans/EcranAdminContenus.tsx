// =============================================================================
// IvoCulture — Écran Admin Contenus
// CRUD contenus : liste, toggle publié/featured, suppression
// =============================================================================

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useContenusAdmin, usePublierContenu, useToggleFeaturedContenu, useSupprimerContenu } from '../hooks/useAdmin';

const TYPE_ICONES: Record<string, string> = {
    masque: 'happy-outline',
    gastronomie: 'restaurant-outline',
    legende: 'book-outline',
    site: 'location-outline',
    musique: 'musical-notes-outline',
    rituel: 'flame-outline',
    conte: 'chatbubble-outline',
    danse: 'body-outline',
    art: 'color-palette-outline',
};

function CarteContenu({ contenu, onPublier, onFeatured, onSupprimer }: any) {
    return (
        <View style={styles.carte}>
            <View style={styles.carteGauche}>
                {contenu.image_url ? (
                    <Image source={{ uri: contenu.image_url }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Ionicons name={TYPE_ICONES[contenu.type_contenu] as any || 'document-outline'} size={24} color={Couleurs.accent.principal} />
                    </View>
                )}
            </View>
            <View style={styles.contenuInfo}>
                <Text style={styles.titre} numberOfLines={1}>{contenu.titre}</Text>
                <Text style={styles.type}>{contenu.type_contenu?.toUpperCase()}</Text>
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={12} color={Couleurs.texte.secondaire} />
                        <Text style={styles.statTexte}>{contenu.vues || 0}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="heart-outline" size={12} color={Couleurs.texte.secondaire} />
                        <Text style={styles.statTexte}>{contenu.likes || 0}</Text>
                    </View>
                </View>
                <View style={styles.badges}>
                    <TouchableOpacity
                        style={[styles.badge, { backgroundColor: contenu.is_published ? '#2ECC7120' : '#E74C3C20' }]}
                        onPress={() => onPublier(contenu)}
                    >
                        <Text style={[styles.badgeTexte, { color: contenu.is_published ? '#2ECC71' : '#E74C3C' }]}>
                            {contenu.is_published ? '✓ Publié' : '✗ Dépublié'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.badge, { backgroundColor: contenu.is_featured ? '#F39C1220' : Couleurs.fond.surface }]}
                        onPress={() => onFeatured(contenu)}
                    >
                        <Text style={[styles.badgeTexte, { color: contenu.is_featured ? '#F39C12' : Couleurs.texte.secondaire }]}>
                            {contenu.is_featured ? '⭐ Featured' : '☆ Normal'}
                        </Text>
                    </TouchableOpacity>
                    {contenu.is_premium && (
                        <View style={[styles.badge, { backgroundColor: '#9B59B620' }]}>
                            <Text style={[styles.badgeTexte, { color: '#9B59B6' }]}>💎 Premium</Text>
                        </View>
                    )}
                </View>
            </View>
            <TouchableOpacity
                style={styles.boutonSupprimer}
                onPress={() => onSupprimer(contenu)}
            >
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
            </TouchableOpacity>
        </View>
    );
}

export default function EcranAdminContenus() {
    const navigation = useNavigation<any>();
    const { data: contenus, isLoading, error } = useContenusAdmin();
    const publierMutation = usePublierContenu();
    const featuredMutation = useToggleFeaturedContenu();
    const supprimerMutation = useSupprimerContenu();

    const handleSupprimer = (contenu: any) => {
        Alert.alert(
            'Supprimer ce contenu ?',
            contenu.titre,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await supprimerMutation.mutateAsync(contenu.id);
                        } catch {
                            Alert.alert('Erreur', 'Impossible de supprimer ce contenu');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.conteneur}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titreEntete}>Contenus</Text>
                    <Text style={styles.sousTitre}>{contenus?.length || 0} contenus culturels</Text>
                </View>
            </Animated.View>

            {isLoading ? (
                <View style={styles.centrer}>
                    <ActivityIndicator size="large" color={Couleurs.accent.principal} />
                </View>
            ) : error ? (
                <View style={styles.centrer}>
                    <Ionicons name="wifi-outline" size={48} color={Couleurs.texte.desactive} />
                    <Text style={styles.erreurTexte}>Backend non disponible</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liste}>
                    {contenus?.map((contenu: any, i: number) => (
                        <Animated.View key={contenu.id} entering={FadeInDown.delay(i * 40).duration(400)}>
                            <CarteContenu
                                contenu={contenu}
                                onPublier={(c: any) => publierMutation.mutate(c.id)}
                                onFeatured={(c: any) => featuredMutation.mutate(c.id)}
                                onSupprimer={handleSupprimer}
                            />
                        </Animated.View>
                    ))}
                    <View style={{ height: 80 }} />
                </ScrollView>
            )}
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
    titreEntete: { color: Couleurs.texte.primaire, fontSize: Typographie.tailles.xxl, fontWeight: '800' },
    sousTitre: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.sm },
    liste: { paddingHorizontal: 16, paddingTop: 12 },
    carte: {
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    carteGauche: {},
    image: { width: 70, height: 70, borderRadius: Rayons.md },
    imagePlaceholder: {
        backgroundColor: Couleurs.fond.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contenuInfo: { flex: 1 },
    titre: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.md },
    type: { color: Couleurs.accent.principal, fontSize: Typographie.tailles.xs, fontWeight: '700', marginTop: 2 },
    stats: { flexDirection: 'row', gap: 10, marginTop: 4 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    statTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs },
    badges: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    badgeTexte: { fontSize: 10, fontWeight: '700' },
    boutonSupprimer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E74C3C15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centrer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    erreurTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.lg, fontWeight: '600' },
});
