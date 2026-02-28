#!/usr/bin/env python3
"""
IvoCulture — Script de configuration réseau
Détecte l'IP locale de la machine et configure le pare-feu pour Expo/FastAPI.
Doit être lancé avec les droits administrateur.

Usage:
    python setup_network.py
"""

import subprocess
import socket
import sys
import os
import platform


def get_local_ip() -> str:
    """Récupère l'adresse IP locale de la machine (interface principale)."""
    try:
        # Connexion factice pour déterminer l'interface principale
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"


def ask_confirmation(message: str) -> bool:
    print(f"\n[?] {message}")
    reponse = input("    Confirmer ? (oui/non) : ").strip().lower()
    return reponse in ("oui", "o", "yes", "y")


def ouvrir_port_windows(port: int, nom: str):
    """Ouvre un port entrant dans le pare-feu Windows via netsh."""
    cmd_entrant = [
        "netsh", "advfirewall", "firewall", "add", "rule",
        f"name=IvoCulture_{nom}_IN",
        "protocol=TCP",
        "dir=in",
        "action=allow",
        f"localport={port}",
        "profile=private"
    ]
    cmd_sortant = [
        "netsh", "advfirewall", "firewall", "add", "rule",
        f"name=IvoCulture_{nom}_OUT",
        "protocol=TCP",
        "dir=out",
        "action=allow",
        f"localport={port}",
        "profile=private"
    ]
    subprocess.run(cmd_entrant, check=True, capture_output=True)
    subprocess.run(cmd_sortant, check=True, capture_output=True)
    print(f"    ✅ Port {port} ({nom}) ouvert (entrant + sortant)")


def supprimer_regles_existantes(nom_pattern: str):
    """Supprime les règles IvoCulture précédentes pour éviter les doublons."""
    subprocess.run(
        ["netsh", "advfirewall", "firewall", "delete", "rule", f"name={nom_pattern}"],
        capture_output=True
    )


def ecrire_env_frontend(ip: str):
    """Met à jour le fichier .env du frontend avec l'IP détectée."""
    env_path = os.path.join(os.path.dirname(__file__), "frontend", ".env")
    contenu = f"""# Généré automatiquement par setup_network.py
EXPO_PUBLIC_API_URL=http://{ip}:8000/api
EXPO_PUBLIC_IP={ip}
"""
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(contenu)
    print(f"    ✅ frontend/.env mis à jour → API: http://{ip}:8000/api")


def ecrire_env_backend(ip: str):
    """Met à jour le fichier .env du backend."""
    env_path = os.path.join(os.path.dirname(__file__), "backend", ".env")
    contenu = f"""# Généré automatiquement par setup_network.py
HOST={ip}
PORT=8000
SECRET_KEY=ivoculture_dev_secret_key_change_in_prod
DATABASE_URL=sqlite:///./ivoculture.db
"""
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(contenu)
    print(f"    ✅ backend/.env mis à jour → HOST: {ip}")


def main():
    print("=" * 60)
    print("  IvoCulture — Configuration Réseau Automatique")
    print("=" * 60)

    # Vérifier le système d'exploitation
    if platform.system() != "Windows":
        print("[!] Ce script est conçu pour Windows.")
        print("    Sur Linux/Mac, ouvrez les ports manuellement.")
        ip = get_local_ip()
        print(f"\n[i] IP locale détectée : {ip}")
        ecrire_env_frontend(ip)
        ecrire_env_backend(ip)
        print("\n✅ Fichiers .env mis à jour. Pare-feu ignoré (non-Windows).")
        return

    # Détecter l'IP
    ip = get_local_ip()
    print(f"\n[i] IP locale détectée : {ip}")
    print(f"    Backend accessible sur : http://{ip}:8000")
    print(f"    Expo accessible sur    : http://{ip}:8081")

    # Confirmer avant toute modification
    if not ask_confirmation(
        "Ce script va :\n"
        "    • Ouvrir les ports 8000 (FastAPI) et 8081 (Expo) dans le pare-feu Windows\n"
        "    • Mettre à jour frontend/.env et backend/.env avec votre IP locale\n"
        "    ⚠️  REQUIERT des droits ADMINISTRATEUR Windows."
    ):
        print("\n❌ Opération annulée par l'utilisateur.")
        sys.exit(0)

    print("\n[1] Nettoyage des règles IvoCulture existantes...")
    supprimer_regles_existantes("IvoCulture_FastAPI_IN")
    supprimer_regles_existantes("IvoCulture_FastAPI_OUT")
    supprimer_regles_existantes("IvoCulture_Expo_IN")
    supprimer_regles_existantes("IvoCulture_Expo_OUT")

    print("\n[2] Ouverture des ports dans le pare-feu Windows...")
    try:
        ouvrir_port_windows(8000, "FastAPI")
        ouvrir_port_windows(8081, "Expo")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Erreur pare-feu : {e}")
        print("   → Relancez ce script en tant qu'Administrateur Windows.")
        sys.exit(1)

    print("\n[3] Mise à jour des fichiers .env...")
    ecrire_env_frontend(ip)
    ecrire_env_backend(ip)

    print("\n" + "=" * 60)
    print("  ✅ Configuration terminée !")
    print(f"  IP : {ip}")
    print(f"  Backend  : http://{ip}:8000")
    print(f"  Frontend : http://{ip}:8081")
    print("=" * 60)
    print("\nLancer le backend :")
    print(f"  cd backend && .\\venv\\Scripts\\activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
    print("\nLancer le frontend :")
    print(f"  cd frontend && npx expo start --clear")


if __name__ == "__main__":
    main()
