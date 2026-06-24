#!/bin/bash
# ==============================================================================
# Script: backup.sh
# Purpose: Automatically backup MongoDB Atlas database, rotate logs, clean old
#          backups, and send alerts on failure.
# Rules: Follows Bash Linux Patterns (set -euo pipefail, trapping, logging)
# ==============================================================================
set -euo pipefail

# Configuration
BACKUP_DIR="/opt/todo-app/backups"
ENV_FILE="/opt/todo-app/backend/.env"
RETENTION_DAYS=7
LOG_FILE="/var/log/todo-backup.log"

# Colors for terminal output (if run interactively)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if log file is writable, fallback if not
if [ ! -w "$(dirname "$LOG_FILE")" ] || { [ -f "$LOG_FILE" ] && [ ! -w "$LOG_FILE" ]; }; then
    # Fallback to backup directory log if syslog/var/log is not writable by current user
    LOG_FILE="${BACKUP_DIR}/backup.log"
fi

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"
touch "$LOG_FILE"

# Log functions
log_info() {
    local msg="[$(date +'%Y-%m-%d %H:%M:%S')] [INFO] $1"
    echo -e "${GREEN}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

log_warn() {
    local msg="[$(date +'%Y-%m-%d %H:%M:%S')] [WARN] $1"
    echo -e "${YELLOW}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

log_error() {
    local msg="[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR] $1"
    echo -e "${RED}${msg}${NC}" >&2
    echo "$msg" >> "$LOG_FILE"
}

# Alert function for Slack/Discord Webhook (configured via SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL env)
send_alert() {
    local message="$1"
    log_warn "Sending alert: $message"
    
    # Check if a webhook URL is defined
    local webhook_url="${BACKUP_WEBHOOK_URL:-""}"
    if [ -n "$webhook_url" ]; then
        local payload
        if [[ "$webhook_url" == *"discord.com"* ]]; then
            payload="{\"content\": \"⚠️ **Database Backup Alert:** $message\"}"
        else
            payload="{\"text\": \"⚠️ *Database Backup Alert:* $message\"}"
        fi
        
        # Send HTTP POST request in background
        curl -s -X POST -H "Content-Type: application/json" -d "$payload" "$webhook_url" > /dev/null || log_error "Failed to send webhook notification"
    else
        log_info "No alert webhook configured. Alert was not sent externally."
    fi
}

# Cleanup handler on script termination
cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        log_error "Backup script failed with exit code $exit_code"
        send_alert "Backup failed on VM: $(hostname). Check log file at $LOG_FILE"
    fi
}
trap cleanup EXIT

# Main Execution
main() {
    log_info "Starting database backup process..."

    # 1. Verify mongodump is installed
    if ! command -v mongodump &> /dev/null; then
        log_error "Command 'mongodump' is not installed. Run: apt-get install mongodb-database-tools"
        exit 1
    fi

    # 2. Load environment variables
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file not found at $ENV_FILE"
        exit 1
    fi

    # Extract MONGODB_URI safely (handles inline comments and spaces)
    local mongodb_uri
    mongodb_uri=$(grep -E "^MONGODB_URI=" "$ENV_FILE" | cut -d'=' -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

    if [ -z "$mongodb_uri" ]; then
        log_error "MONGODB_URI is empty or not defined in $ENV_FILE"
        exit 1
    fi

    # Optionally load Backup Webhook URL if defined
    if grep -E "^BACKUP_WEBHOOK_URL=" "$ENV_FILE" &>/dev/null; then
        export BACKUP_WEBHOOK_URL=$(grep -E "^BACKUP_WEBHOOK_URL=" "$ENV_FILE" | cut -d'=' -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
    fi

    # 3. Create Backup File Name
    local date_str
    date_str=$(date +'%Y%m%d_%H%M%S')
    local backup_file="${BACKUP_DIR}/todo_db_backup_${date_str}.gz"

    log_info "Backing up database to ${backup_file}..."

    # 4. Run Mongodump
    # --archive: stream data to a single compressed archive file
    # --gzip: compress the output
    if mongodump --uri="$mongodb_uri" --archive="$backup_file" --gzip >> "$LOG_FILE" 2>&1; then
        log_info "Database backup created successfully: $(basename "$backup_file")"
        log_info "Backup file size: $(du -sh "$backup_file" | cut -f1)"
    else
        log_error "Failed to create database backup archive using mongodump"
        exit 1
    fi

    # 5. Clean up old backups (Retention Policy)
    log_info "Cleaning up backups older than ${RETENTION_DAYS} days in ${BACKUP_DIR}..."
    local deleted_count=0
    
    # Find and delete files older than retention days
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            log_info "Deleting old backup: $(basename "$file")"
            rm -f "$file"
            deleted_count=$((deleted_count + 1))
        fi
    done < <(find "$BACKUP_DIR" -name "todo_db_backup_*.gz" -type f -mtime +"$RETENTION_DAYS")

    log_info "Cleanup finished. Deleted ${deleted_count} old backup file(s)."
    log_info "Backup process completed successfully."
}

main "$@"
