# Runbook — Alerte HighErrorRate

Contexte : cette alerte déclenche si le taux d'erreurs 5xx dépasse 5% sur 5 minutes (condition persistante 2m).

1) Vérifier l'alerte
- Ouvrir Alertmanager: http://localhost:9093/
- Ouvrir Grafana: http://localhost:3000/ (dashboard 'Observability - Basic')

2) Diagnostic rapide
- Vérifier les logs du service :
  ```bash
  docker logs obs_app --tail 200
  ```
- Tester endpoints :
  ```bash
  curl -v http://localhost:8080/      # ok
  curl -v http://localhost:8080/error # force 500
  curl -v http://localhost:8080/slow  # test latence
  ```
- Inspecter métriques dans Prometheus :
  - Aller dans http://localhost:9090/graph
  - Tester `rate(http_requests_total[1m])`
  - Tester `sum(rate(http_requests_total{status_code=~"5.."}[5m]))`

3) Mitigation rapide
- Si bug dans l’app : rollback image / redeploy local (ici redémarrer le container)
  ```bash
  docker restart obs_app
  ```
- Si surcharge : réduire trafic, augmenter replicas (sur k8s), ou activer circuit-breaker

4) Post-incident
- Prendre note : heure, root cause, actions prises
- Metriques à joindre : p95 latency, error rate, request rate, logs d'app
- Rédiger un post-mortem court (5W + impact + remediation + follow-ups)

5) Tests
- Pour tester l’alerte manuellement, exécuter plusieurs requêtes erreurs :
  ```bash
  for i in {1..200}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/error; done
  ```
  Puis vérifier dans Grafana/Prometheus si l'alerte s'est déclenchée.
