// =============================================================================
// IvoCulture — Écran Abonnement Premium
// Offre premium pour les touristes
// =============================================================================

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { useAuthContext } from '../context/AuthContext';

const AVANTAGES = [
    { icone: 'lock-open-outline', label: 'Accès aux contenus premium', detail: 'Légendes rares, rituels secrets et sites sacrés' },
    { icone: 'map-outline', label: 'Cartes culturelles interactives', detail: 'Localisation GPS de tous les sites importants' },
    { icone: 'download-outline', label: 'Contenus hors ligne', detail: 'Téléchargez pour voyager sans connexion' },
    { icone: 'star-outline', label: 'Promotions exclusives', detail: 'Offres partenaires et réductions circuits' },
    { icone: 'headset-outline', label: 'Guide audio personnalisé', detail: 'Narration immersive des anecdotes culturelles' },
];

const PLANS = [
    { id: 'mensuel', label: 'Mensuel', prix: '4 900 FCFA', periode: '/mois', accroche: '' },
    { id: 'annuel', label: 'Annuel', prix: '39 900 FCFA', periode: '/an', accroche: '🔥 -32%', populaire: true },
];

export default function EcranAbonnement() {
    const navigation = useNavigation<any>();
    const { utilisateur, recharger } = useAuthContext();
    const [planChoisi, setPlanChoisi] = React.useState('annuel');

    const souscrire = () => {
        const plan = planChoisi === 'annuel' ? 'annuel' : 'mensuel';
        const montant = planChoisi === 'annuel' ? 39900 : 4900;
        navigation.navigate('Paiement', { montant, plan, utilisateur });
    };

    if (utilisateur?.is_premium) {
        return (
            <View style={styles.conteneurPremium}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.cartePremiumActif}>
                    <Text style={styles.premiumIcone}>👑</Text>
                    <Text style={styles.premiumTitre}>Vous êtes déjà Premium !</Text>
                    <Text style={styles.premiumDesc}>Profitez de tous les avantages exclusifs.</Text>
                    <TouchableOpacity style={styles.boutonRetour} onPress={() => navigation.goBack()}>
                        <Text style={styles.boutonRetourTexte}>Retour</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={styles.conteneur}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* En-tête */}
                <Animated.View entering={FadeInDown.duration(500)} style={styles.entete}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retour}>
                        <Ionicons name="close" size={24} color={Couleurs.texte.primaire} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Héros */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.heros}>
                    <View style={styles.coronneBadge}>
                        <Text style={styles.coronneIcone}>👑</Text>
                    </View>
                    <Text style={styles.herosTitre}>IvoCulture Premium</Text>
                    <Text style={styles.herosDesc}>
                        Découvrez les trésors culturels cachés de la Côte d'Ivoire.{'\n'}Réservé aux voyageurs passionnés.
                    </Text>
                </Animated.View>

                {/* Avantages */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.section}>
                    <Text style={styles.sectionTitre}>Ce qui vous attend</Text>
                    {AVANTAGES.map((av, i) => (
                        <View key={i} style={styles.ligneAvantage}>
                            <View style={styles.iconeAvantage}>
                                <Ionicons name={av.icone as any} size={22} color={Couleurs.accent.principal} />
                            </View>
                            <View style={styles.texteAvantage}>
                                <Text style={styles.labelAvantage}>{av.label}</Text>
                                <Text style={styles.detailAvantage}>{av.detail}</Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
                        </View>
                    ))}
                </Animated.View>

                {/* Plans */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.section}>
                    <Text style={styles.sectionTitre}>Choisissez votre formule</Text>
                    <View style={styles.plansConteneur}>
                        {PLANS.map(plan => (
                            <TouchableOpacity
                                key={plan.id}
                                style={[styles.cartePlan, planChoisi === plan.id && styles.cartePlanActive]}
                                onPress={() => setPlanChoisi(plan.id)}
                                activeOpacity={0.8}
                            >
                                {plan.populaire && (
                                    <View style={styles.badgePopulaire}>
                                        <Text style={styles.badgePopulaireTexte}>POPULAIRE</Text>
                                    </View>
                                )}
                                {plan.accroche ? (
                                    <Text style={styles.accrocheTexte}>{plan.accroche}</Text>
                                ) : null}
                                <Text style={styles.planLabel}>{plan.label}</Text>
                                <Text style={styles.planPrix}>{plan.prix}</Text>
                                <Text style={styles.planPeriode}>{plan.periode}</Text>
                                {planChoisi === plan.id && (
                                    <Ionicons name="checkmark-circle" size={22} color={Couleurs.accent.principal} style={styles.checkPlan} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* CTA flottant */}
            <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.ctaConteneur}>
                <TouchableOpacity
                    style={[styles.boutonSouscrire, chargement && { opacity: 0.7 }]}
                    onPress={souscrire}
                    disabled={chargement}
                    activeOpacity={0.85}
                >
                    <Ionicons name="diamond-outline" size={20} color="#FFF" />
                    <Text style={styles.boutonSouscrireTexte}>
                        {chargement ? 'Activation…' : 'Souscrire maintenant'}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.mentionLegale}>Résiliable à tout moment • Sans engagement</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: Couleurs.fond.primaire },
    scroll: { flexGrow: 1 },
    entete: {
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 8,
        alignItems: 'flex-end',
    },
    retour: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heros: {
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 24,
    },
    coronneBadge: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Couleurs.or.clair,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    coronneIcone: { fontSize: 44 },
    herosTitre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: '800',
        textAlign: 'center',
    },
    herosDesc: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 10,
    },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: '700',
        marginBottom: 14,
    },
    ligneAvantage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: Rayons.lg,
        padding: 14,
        marginBottom: 8,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    iconeAvantage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Couleurs.or.clair,
        alignItems: 'center',
        justifyContent: 'center',
    },
    texteAvantage: { flex: 1 },
    labelAvantage: { color: Couleurs.texte.primaire, fontWeight: '700', fontSize: Typographie.tailles.md },
    detailAvantage: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.sm, marginTop: 2 },
    plansConteneur: { flexDirection: 'row', gap: 12 },
    cartePlan: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: Rayons.xl,
        padding: 18,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Couleurs.fond.surface,
        position: 'relative',
        minHeight: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cartePlanActive: {
        borderColor: Couleurs.accent.principal,
        backgroundColor: Couleurs.or.clair,
    },
    badgePopulaire: {
        position: 'absolute',
        top: -12,
        backgroundColor: Couleurs.accent.principal,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    badgePopulaireTexte: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    accrocheTexte: { color: Couleurs.accent.principal, fontSize: Typographie.tailles.sm, fontWeight: '700', marginBottom: 4 },
    planLabel: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.sm, fontWeight: '600', marginTop: 8 },
    planPrix: { color: Couleurs.texte.primaire, fontSize: Typographie.tailles.xxl, fontWeight: '800', marginTop: 4 },
    planPeriode: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.xs },
    checkPlan: { marginTop: 12 },
    ctaConteneur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Couleurs.fond.primaire,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 36,
        borderTopWidth: 1,
        borderTopColor: Couleurs.fond.surface,
    },
    boutonSouscrire: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Couleurs.accent.principal,
        paddingVertical: 16,
        borderRadius: Rayons.lg,
    },
    boutonSouscrireTexte: { color: '#FFF', fontSize: Typographie.tailles.lg, fontWeight: '800' },
    mentionLegale: {
        color: Couleurs.texte.desactive,
        fontSize: Typographie.tailles.xs,
        textAlign: 'center',
        marginTop: 10,
    },
    // État premium déjà actif
    conteneurPremium: { flex: 1, backgroundColor: Couleurs.fond.primaire, alignItems: 'center', justifyContent: 'center', padding: 32 },
    cartePremiumActif: { alignItems: 'center', gap: 14 },
    premiumIcone: { fontSize: 64 },
    premiumTitre: { color: Couleurs.texte.primaire, fontSize: Typographie.tailles.xxl, fontWeight: '800', textAlign: 'center' },
    premiumDesc: { color: Couleurs.texte.secondaire, fontSize: Typographie.tailles.md, textAlign: 'center' },
    boutonRetour: {
        marginTop: 12,
        paddingHorizontal: 28,
        paddingVertical: 12,
        backgroundColor: Couleurs.accent.principal,
        borderRadius: Rayons.complet,
    },
    boutonRetourTexte: { color: '#FFF', fontWeight: '700', fontSize: Typographie.tailles.md },
});
