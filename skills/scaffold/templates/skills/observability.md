---
name: observability
description: >
  Manage metrics, monitoring, tracing, and observability for {PROJECT_NAME}.
  Auto-invoke when asked about metrics, logging, monitoring, or observability.
---

# Observability — {PROJECT_NAME}

## Observability Stack

- **Metrics**: {METRICS_SYSTEM}
- **Logging**: {LOGGING_SYSTEM}
- **Tracing**: {TRACING_SYSTEM}
- **APM**: {APM_TOOL}

## Metrics

### Prometheus Metrics Location
{METRICS_ENDPOINT}

### Custom Metrics Pattern

{CUSTOM_METRICS_PATTERN}

### Standard Metrics to Track

#### Application Metrics
- Request count by endpoint
- Request duration (histogram)
- Error rate
- Active connections
- Database query latency
- Cache hit/miss ratio
- Queue depth
- Background job duration

#### Infrastructure Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network throughput
- Container restarts
- Pod count

### Adding New Metrics

{ADD_METRICS_INSTRUCTIONS}

Example for this project:
```{LANGUAGE}
{METRICS_CODE_EXAMPLE}
```

## Logging

### Structured Logging Pattern

{STRUCTURED_LOGGING_PATTERN}

### Log Levels
- **DEBUG**: Development troubleshooting
- **INFO**: Normal operations
- **WARN**: Unexpected but handled
- **ERROR**: Failures requiring attention
- **FATAL**: Service shutdown

### Required Log Fields

{REQUIRED_LOG_FIELDS}

### Logging Best Practices

[OK] **Always Include**:
- Request ID / Correlation ID
- User ID (if authenticated)
- Operation name
- Duration
- Error details (if error)

[FAIL] **Never Log**:
- Passwords or secrets
- Credit card numbers
- PII without proper redaction
- Large payloads (>1KB)

### Log Aggregation

{LOG_AGGREGATION_SETUP}

## Distributed Tracing

### Tracing Configuration

{TRACING_CONFIG}

### Adding Spans

{SPAN_CREATION_PATTERN}

### Trace Context Propagation

{CONTEXT_PROPAGATION}

## Dashboards

### Grafana Dashboards

{GRAFANA_DASHBOARD_LOCATION}

### Key Dashboards
- **Service Overview**: Request rate, error rate, latency (RED metrics)
- **Resource Usage**: CPU, memory, disk, network
- **Database**: Query performance, connection pool
- **Business Metrics**: {BUSINESS_METRICS}

### Creating New Dashboard

{DASHBOARD_CREATION_INSTRUCTIONS}

## Alerts

### AlertManager Configuration

{ALERT_CONFIG_LOCATION}

### Standard Alerts
- High error rate (>1% for 5 minutes)
- High latency (p99 >2s for 5 minutes)
- Low availability (<99.9%)
- High memory usage (>90%)
- Pod restarts (>3 in 10 minutes)

### Adding New Alert

{ADD_ALERT_INSTRUCTIONS}

Example:
```yaml
{ALERT_EXAMPLE}
```

## Health Checks

### Liveness Probe
Endpoint: {LIVENESS_ENDPOINT}
- Checks if service is running
- Kubernetes restarts on failure

### Readiness Probe
Endpoint: {READINESS_ENDPOINT}
- Checks if service can handle traffic
- Kubernetes removes from load balancer on failure

### Health Check Implementation

{HEALTH_CHECK_PATTERN}

## Performance Profiling

### CPU Profiling

{CPU_PROFILING_COMMAND}

### Memory Profiling

{MEMORY_PROFILING_COMMAND}

### Continuous Profiling

{CONTINUOUS_PROFILING_SETUP}

## Debugging Production Issues

### 1. Check Logs
```bash
{LOG_QUERY_COMMAND}
```

### 2. Check Metrics
- Open Grafana: {GRAFANA_URL}
- Check service dashboard
- Look for anomalies

### 3. Check Traces
```bash
{TRACE_QUERY_COMMAND}
```

### 4. Check Alerts
```bash
{ALERT_QUERY_COMMAND}
```

## Service Level Objectives (SLOs)

{SLO_DEFINITIONS}

## Runbooks

{RUNBOOK_LOCATION}

## Usage

Ask Claude for help with:
- "Add metrics for new endpoint"
- "Create dashboard for X"
- "Set up alert for Y"
- "Debug production issue with high latency"
- "Add distributed tracing to new service"
