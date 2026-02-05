# Observabilite
# Observabilité - App Node.js (Projet SRE junior)

But : mettre en place une application instrumentée et une stack d'observabilité (Prometheus, Grafana, Alertmanager) via Docker Compose. Objectif d'apprentissage : instrumentation, métriques, dashboards, alerting et runbook.

Prérequis
- Docker & Docker Compose
- (Optionnel) accès à internet pour récupérer images Docker

Quickstart (local)
1. Cloner ce repo
2. Lancer :
   ```bash
   docker compose up --build
   ```
3. Accéder :
   - App : http://localhost:8080/
   - Prometheus : http://localhost:9090/
   - Grafana : http://localhost:3000/ (admin/admin)
   - Alertmanager : http://localhost:9093/

Simuler du trafic
- Page OK : curl http://localhost:8080/
- Simuler erreur : curl http://localhost:8080/error
- Métriques Prometheus : http://localhost:8080/metrics

Contenu important
- app/ : application Node.js instrumentée
- Dockerfile : build de l'app
- docker-compose.yml : app + prometheus + grafana + alertmanager
- prometheus/prometheus.yml : config Prometheus
- prometheus/alerts.yml : règles d'alerte
- grafana/provisioning/ : datasource + dashboard provisioning
- runbook.md : playbook d'alerte simple

Prochaines étapes (je peux t'aider)
- Importer/améliorer le dashboard Grafana (j’ai ajouté un dashboard de base)
- Ajouter des scénarios de test d’alerte automatisés
- Versionner et créer issues GitHub pour milestones
- Ajouter CI minimal (lint/test) ou déploiement k8s quand tu seras prêt
