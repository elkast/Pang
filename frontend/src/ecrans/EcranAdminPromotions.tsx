// =============================================================================
// IvoCulture — Écran Admin Promotions
// CRUD promotions : liste, toggle featured, suppression, création
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
    Image,
    TextInput,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import {
    usePromotionsAdmin,
    useCreerPromotionAdmin,
    useModifierPromotionAdmin,
    useSupprimerPromotionAdmin,
} from '../hooks/useAdmin';

const TYPE_OPTIONS = ['site', 'mosquee', 'musique', 'legende', 'touriste'];
const TYPE_COULEURS: Record<string, string> = {
    site: '#1E6B45',
    mosquee: '#C4A02A',
    musique: '#8B5C34',
    legende: '#9D2235',
    touriste: '#9B59B6',
};
const TYPE_ICONES: Record<string, string> = {
    site: 'location-outline',
    mosquee: 'business-outline',
    musique: 'musical-notes-outline',
    legende: 'book-outline',
    touriste: 'airplane-outline',
};

function FormPromotion({ initial, onSave, onCancel }: any) {
    const [titre, setTitre] = useState(initial?.titre || '');
    const [type, setType] = useState(initial?.type_promotion || 'site');
    const [description, setDescription] = useState(initial?.description || '');
    const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
    const [contact, setContact] = useState(initial?.numero_contact || '');
    const [adresse, setAdresse] = useState(initial?.adresse || '');
    const [note, setNote] = useState(String(initial?.note_popularite || 50));

    return (
        <View style={styles.form}>
            <Text style={styles.formTitre}>{initial ? 'Modifier la promotion' : 'Nouvelle promotion'}</Text>
            <TextInput style={styles.input} value={titre} onChangeText={setTitre} placeholder="Titre" placeholderTextColor={Couleurs.texte.desactive} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {TYPE_OPTIONS.map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.typeBtn, type === t && { backgroundColor: TYPE_COULEURS[t] }]}
                            onPress={() => setType(t)}
                        >
                            <Text style={[styles.typeBtnTexte, type === t && { color: '#FFF' }]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <TextInput style={[styles.input, { height: 70 }]} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor={Couleurs.texte.desactive} multiline />
            <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="URL image" placeholderTextColor={Couleurs.texte.desactive} />
            <TextInput style={styles.input} value={contact} onChangeText={setContact} placeholder="Numéro de contact" placeholderTextColor={Couleurs.texte.desactive} />
            <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} placeholder="Adresse" placeholderTextColor={Couleurs.texte.desactive} />
            <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="Note de popularité (0-100)" placeholderTextColor={Couleurs.texte.desactive} keyboardType="numeric" />
            <View style={styles.formActions}>
                <TouchableOpacity style={styles.boutonAnnuler} onPress={onCancel}>
                    <Text style={styles.boutonAnnulerTexte}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.boutonSauver}
                    onPress={() => {
                        if (!titre.trim()) { Alert.alert('Erreur', 'Le titre est requis'); return; }
                        onSave({ titre, type_promotion: type, description, image_url: imageUrl, numero_contact: contact, adresse, note_popularite: parseInt(note) || 50 });
                    }}
                >
                    <Text style={styles.boutonSauverTexte}>{initial ? 'Modifier' : 'Créer'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function CartePromotion({ promo, onFeatured, onSupprimer, onModifier }: any) {
    const couleur = TYPE_COULEURS[promo.type_promotion] || Couleurs.accent.principal;
    return (
        <View style={styles.carte}>
            {promo.image_url ? (
                <Image source={{ uri: promo.image_url }} style={styles.image} />
            ) : (
                <View style={[styles.image, { backgroundColor: couleur + '20', alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name={TYPE_ICONES[promo.type_promotion] as any || 'star-outline'} size={24} color={couleur} />
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.titrePromo} numberOfLines={1}>{promo.titre}</Text>
                <View style={[styles.typeBadge, { backgroundColor: couleur + '20' }]}>
                    <Text style={[styles.typeBadgeTexte, { color: couleur }]}>{promo.type_promotion?.toUpperCase()}</Text>
                </View>
                <View style={styles.statRow}>
                    <Ionicons name="eye-outline" size={12} color={Couleurs.texte.secondaire} />
                    <Text style={styles.statTexte}>{promo.vues || 0} vues</Text>
                    <View style={[styles.noteIndicateur, { backgroundColor: Couleurs.accent.principal + '20' }]}>
                        <Text style={styles.noteTexte}>★ {promo.note_popularite || 0}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.boutonAction, { backgroundColor: promo.is_featured ? '#F39C1220' : Couleurs.fond.surface }]}
                    onPress={() => onFeatured(promo)}
                >
                    <Ionicons name={promo.is_featured ? 'star' : 'star-outline'} size={18} color={promo.is_featured ? '#F39C12' : Couleurs.texte.desactive} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.boutonAction, { backgroundColor: '#3498DB20' }]}
                    onPress={() => onModifier(promo)}
                >
                    <Ionicons name="create-outline" size={18} color="#3498DB" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.boutonAction, { backgroundColor: '#E74C3C20' }]}
                    onPress={() => onSupprimer(promo)}
                >
                    <Ionicons name="trash-outline" size={18} color="#E74C3C" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function EcranAdminPromotions() {
    const navigation = useNavigation<any>();
    const { data: promotions, isLoading } = usePromotionsAdmin();
    const creerMutation = useCreerPromotionAdmin();
    const modifierMutation = useModifierPromotionAdmin();
    const supprimerMutation = useSupprimerPromotionAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editPromo, setEditPromo] = useState<any>(null);

    const handleSave = async (donnees: any) => {
        try {
            if (editPromo) {
                await modifierMutation.mutateAsync({ id: editPromo.id, donnees });
            } else {
                await creerMutation.mutateAsync(donnees);
            }
            setShowForm(false);
            setEditPromo(null);
        } catch {
            Alert.alert('Erreur', 'Impossible de sauvegarder');
        }
    };

    const handleSupprimer = (promo: any) => {
        Alert.alert('Supprimer cette promotion ?', promo.titre, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    try { await supprimerMutation.mutateAsync(promo.id); }
                    catch { Alert.alert('Erreur', 'Suppression impossible'); }
                },
            },
        ]);
    };

    const handleFeatured = async (promo: any) => {
        try {
            await modifierMutation.mutateAsync({ id: promo.id, donnees: { is_featured: !promo.is_featured } });
        } catch {
            Alert.alert('Erreur', 'Action impossible');
        }
    };

    return (
        <View style={styles.conteneur}>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.entete}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                    <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titre}>Promotions</Text>
                    <Text style={styles.sousTitre}>{promotions?.length || 0} entités</Text>
                </View>
                <TouchableOpacity
                    style={styles.boutonAjouter}
                    onPress={() => { setEditPromo(null); setShowForm(true); }}
                >
                    <Ionicons name="add" size={22} color="#FFF" />
                    <Text style={styles.boutonAjouterTexte}>Nouvelle</Text>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liste}>
                {showForm && (
                    <FormPromotion
                        initial={editPromo}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditPromo(null); }}
                    />
                )}
                {isLoading ? (
                    <View style={styles.centrer}>
                        <ActivityIndicator size="large" color={Couleurs.accent.principal} />
                    </View>
                ) : (
                    promotions?.map((promo: any, i: number) => (
                        <Animated.View key={promo.id} entering={FadeInDown.delay(i * 50).duration(400)}>
                            <CartePromotion
                                promo={promo}
                                onFeatured={handleFeatured}
                                onSupprimer={handleSupprimer}
                                onModifier={(p: any) => { setEditPromo(p); setShowForm(true); }}
                            />
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
    typeBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.surface,
    },
    typeBtnTexte: { fontSize: Typographie.tailles.sm, fontWeight: '600', color: Couleurs.texte.secondaire },
    formActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    image: { width: 62, height: 62, borderRadius: Rayons.md },
    info: { flex: 1 },
    titrePromo: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.md },
    typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginTop: 4 },
    typeBadgeTexte: { fontSize: 10, fontWeight: '700' },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    statTexte: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs },
    noteIndicateur: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginLeft: 4 },
    noteTexte: { color: Couleurs.accent.principal, fontSize: Typographie.tailles.xs, fontWeight: '700' },
    actions: { gap: 6 },
    boutonAction: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centrer: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
});
