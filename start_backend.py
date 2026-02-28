#!/usr/bin/env python
"""
Script de lancement automatique du backend IvoCulture
Tue automatiquement tout processus utilisant le port 8000 puis démarre le serveur
"""
import socket
import subprocess
import sys
import os
import time


def kill_port_8000():
    """Tue tout processus utilisant le port 8000"""
    try:
        # Windows: trouver le PID du processus sur le port 8000
        result = subprocess.run(
            ["netstat", "-ano"],
            capture_output=True,
            text=True,
            creationflags=(
                subprocess.CREATE_NO_WINDOW
                if hasattr(subprocess, "CREATE_NO_WINDOW")
                else 0
            ),
        )

        for line in result.stdout.split("\n"):
            if ":8000" in line and "LISTENING" in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    try:
                        pid = int(pid)
                        print(f"  🔪 Arrêt du processus {pid} sur le port 8000...")
                        subprocess.run(
                            ["taskkill", "/F", "/PID", str(pid)],
                            capture_output=True,
                            creationflags=(
                                subprocess.CREATE_NO_WINDOW
                                if hasattr(subprocess, "CREATE_NO_WINDOW")
                                else 0
                            ),
                        )
                        time.sleep(1)
                    except (ValueError, subprocess.CalledProcessError):
                        pass
    except Exception as e:
        print(f"  Note: Impossible de tuer le processus: {e}")


def get_local_ip():
    """Récupère l'adresse IP locale de la machine"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"


def main():
    # Se déplacer dans le répertoire du projet
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)

    port = 8000  # On utilise toujours 8000
    local_ip = get_local_ip()

    print("\n" + "=" * 60)
    print("  LANCEMENT DU BACKEND IVOCULTURE")
    print("=" * 60)
    print(f"\n  📡 Port: {port}")
    print(f"  💻 IP locale: {local_ip}")
    print(f"  🌐 URL API: http://{local_ip}:{port}/api")
    print(f"  🏥 Santé: http://{local_ip}:{port}/")
    print("\n" + "=" * 60)

    # Tuer tout processus sur le port 8000
    print("\n  Vérification du port 8000...")
    kill_port_8000()

    print("\n  ▶ Démarrage du serveur...")
    print("  Appuyez sur Ctrl+C pour arrêter\n")

    # Lancer uvicorn
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        str(port),
    ]

    try:
        subprocess.run(cmd, cwd=project_dir)
    except KeyboardInterrupt:
        print("\n\n🛑 Serveur arrêté")


if __name__ == "__main__":
    main()
