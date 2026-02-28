// =============================================================================
// IvoCulture — Écran d'Inscription
// Formulaire : nom, email, mot de passe, type utilisateur
// =============================================================================

import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { ChampSaisie, BoutonPrincipal } from '../composants';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type TypeUtilisateur = 'local' | 'touriste';

const TYPE_OPTIONS: { id: TypeUtilisateur; label: string; icone: string; description: string; couleur: string }[] = [
    {
        id: 'local',
        label: 'Local',
        icone: 'home-outline',
        description: "J'habite en Côte d'Ivoire",
        couleur: Couleurs.foret.principal,
    },
    {
        id: 'touriste',
        label: 'Touriste',
        icone: 'airplane-outline',
        description: "Je visite la Côte d'Ivoire",
        couleur: '#9B59B6',
    },
];

export default function EcranInscription() {
    const navigation = useNavigation<Nav>();
    const { inscrire } = useAuth();

    const [nomUtilisateur, setNomUtilisateur] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [typeUtilisateur, setTypeUtilisateur] = useState<TypeUtilisateur>('local');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');

    const gererInscription = async () => {
        if (!nomUtilisateur || !email || !motDePasse) {
            setErreur('Veuillez remplir tous les champs.');
            return;
        }
        if (motDePasse.length < 6) {
            setErreur('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        setChargement(true);
        setErreur('');
        try {
            await inscrire(nomUtilisateur, email, motDePasse, typeUtilisateur);
            Alert.alert('Succès', 'Compte créé ! Veuillez vous connecter.');
            navigation.navigate('Connexion');
        } catch (error: any) {
            setErreur(error.response?.data?.detail || "Erreur lors de l'inscription.");
        } finally {
            setChargement(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.conteneur}>
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <Text style={styles.titre}>Créer un compte</Text>
                        <Text style={styles.sousTitre}>
                            Rejoignez la communauté culturelle ivoirienne
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                        {erreur ? (
                            <View style={styles.boiteErreur}>
                                <Text style={styles.texteErreur}>{erreur}</Text>
                            </View>
                        ) : null}

                        {/* Sélecteur type utilisateur */}
                        <Text style={styles.labelType}>Je suis…</Text>
                        <View style={styles.typeConteneur}>
                            {TYPE_OPTIONS.map(opt => {
                                const actif = typeUtilisateur === opt.id;
                                return (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[
                                            styles.typeBouton,
                                            actif && { borderColor: opt.couleur, backgroundColor: opt.couleur + '12' },
                                        ]}
                                        onPress={() => setTypeUtilisateur(opt.id)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.typeIconeConteneur, { backgroundColor: actif ? opt.couleur + '20' : Couleurs.fond.surface }]}>
                                            <Ionicons name={opt.icone as any} size={24} color={actif ? opt.couleur : Couleurs.texte.secondaire} />
                                        </View>
                                        <Text style={[styles.typeLabel, actif && { color: opt.couleur, fontWeight: '700' }]}>{opt.label}</Text>
                                        <Text style={styles.typeDescription}>{opt.description}</Text>
                                        {actif && (
                                            <View style={[styles.typeCheck, { backgroundColor: opt.couleur }]}>
                                                <Ionicons name="checkmark" size={12} color="#FFF" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <ChampSaisie
                            label="Nom d'utilisateur"
                            icone="person-outline"
                            placeholder="Votre pseudo"
                            value={nomUtilisateur}
                            onChangeText={setNomUtilisateur}
                            autoCapitalize="none"
                        />

                        <ChampSaisie
                            label="Email"
                            icone="mail-outline"
                            placeholder="votre@email.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <ChampSaisie
                            label="Mot de passe"
                            icone="lock-closed-outline"
                            placeholder="Minimum 6 caractères"
                            value={motDePasse}
                            onChangeText={setMotDePasse}
                            secureTextEntry
                        />

                        {typeUtilisateur === 'touriste' && (
                            <Animated.View entering={FadeInDown.duration(400)} style={styles.infoTouriste}>
                                <Ionicons name="information-circle-outline" size={18} color="#9B59B6" />
                                <Text style={styles.infoTouristeTexte}>
                                    En tant que touriste, vous aurez accès à une offre Premium exclusive avec des contenus culturels enrichis.
                                </Text>
                            </Animated.View>
                        )}

                        <BoutonPrincipal
                            titre="S'inscrire"
                            onPress={gererInscription}
                            chargement={chargement}
                            couleur={typeUtilisateur === 'touriste' ? '#9B59B6' : Couleurs.foret.principal}
                            style={{ marginTop: 8 }}
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Connexion')}
                            style={styles.lien}
                        >
                            <Text style={styles.texteLien}>
                                Déjà un compte ?{' '}
                                <Text style={styles.texteLienAccent}>Se connecter</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scroll: { flexGrow: 1 },
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingVertical: 40,
    },
    titre: {
        color: Couleurs.or.principal,
        fontSize: Typographie.tailles.titre,
        fontWeight: Typographie.poids.bold,
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        marginTop: 4,
        marginBottom: 28,
    },
    boiteErreur: {
        backgroundColor: '#3D1F1F',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    texteErreur: {
        color: Couleurs.etat.erreur,
        fontSize: Typographie.tailles.md,
    },
    labelType: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.md,
        fontWeight: '700',
        marginBottom: 10,
    },
    typeConteneur: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    typeBouton: {
        flex: 1,
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        padding: 14,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Couleurs.fond.surface,
        position: 'relative',
    },
    typeIconeConteneur: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    typeLabel: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.md,
        fontWeight: '600',
    },
    typeDescription: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.xs,
        textAlign: 'center',
        marginTop: 3,
    },
    typeCheck: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTouriste: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#9B59B610',
        borderRadius: Rayons.md,
        padding: 12,
        marginBottom: 12,
    },
    infoTouristeTexte: {
        flex: 1,
        color: '#9B59B6',
        fontSize: Typographie.tailles.sm,
        lineHeight: 18,
    },
    lien: {
        marginTop: 24,
        alignItems: 'center',
    },
    texteLien: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
    },
    texteLienAccent: {
        color: Couleurs.accent.vert,
        fontWeight: Typographie.poids.bold,
    },
});
