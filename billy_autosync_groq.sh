#!/bin/bash
# billy_autosync_groq.sh
#
# Watches GitHub for new commits on main, validates them in an isolated
# temp copy BEFORE touching the live running backend, and only restarts
# Billy if the new code actually passes checks. If validation fails,
# the live backend is left completely untouched and still running on
# the last known-good code.

set -u

REPO_DIR="$HOME/Desktop/billy-project-groq"
VENV_ACTIVATE="$HOME/billy-env/bin/activate"
LIVE_PORT=8001
VALIDATION_PORT=8099
POLL_INTERVAL=15
LOG_FILE="$REPO_DIR/billy_autosync.log"
TEMP_DIR="/tmp/billy-validate-$$"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

notify_github() {
    local sha="$1"
    local message="$2"
    gh api "repos/billydpuai/billy-groq-full-project/commits/${sha}/comments" \
        -f body="$message" > /dev/null 2>>"$LOG_FILE"
}

cleanup_temp() {
    rm -rf "$TEMP_DIR"
}
trap cleanup_temp EXIT

log "=== Billy autosync started (polling every ${POLL_INTERVAL}s) ==="

cd "$REPO_DIR" || { log "ERROR: cannot cd into $REPO_DIR"; exit 1; }

while true; do
    sleep "$POLL_INTERVAL"

    git fetch origin main --quiet 2>>"$LOG_FILE"
    LOCAL_SHA=$(git rev-parse HEAD)
    REMOTE_SHA=$(git rev-parse origin/main)

    if [ "$LOCAL_SHA" == "$REMOTE_SHA" ]; then
        continue
    fi

    log "New commit detected: $LOCAL_SHA -> $REMOTE_SHA"
    log "Validating before touching the live backend..."

    rm -rf "$TEMP_DIR"
    git clone --quiet "$REPO_DIR" "$TEMP_DIR" 2>>"$LOG_FILE"
    cd "$TEMP_DIR" || { log "ERROR: could not create validation copy"; cd "$REPO_DIR"; continue; }
    git checkout --quiet "$REMOTE_SHA" 2>>"$LOG_FILE"

    VALIDATION_PASSED=true

    if ! find backend -name "*.py" -exec python3 -m py_compile {} \; 2>>"$LOG_FILE"; then
        log "FAILED: Python syntax error in new commit. Rejecting update."
        VALIDATION_PASSED=false
    fi

    if [ "$VALIDATION_PASSED" == "true" ]; then
        source "$VENV_ACTIVATE"
        uvicorn backend.main:app --port "$VALIDATION_PORT" > /tmp/billy-validate-boot.log 2>&1 &
        TEST_PID=$!
        sleep 4

        HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${VALIDATION_PORT}/" 2>/dev/null)

        kill -9 "$TEST_PID" 2>/dev/null
        wait "$TEST_PID" 2>/dev/null

        if [ "$HEALTH_CHECK" != "200" ]; then
            log "FAILED: new backend did not respond healthy (got HTTP $HEALTH_CHECK). Rejecting update."
            VALIDATION_PASSED=false
        fi
    fi

    cd "$REPO_DIR" || exit 1

    if [ "$VALIDATION_PASSED" == "true" ]; then
        log "Validation PASSED. Pulling into live repo and restarting Billy..."
        git pull origin main --quiet 2>>"$LOG_FILE"

        LIVE_PID=$(lsof -ti:"$LIVE_PORT")
        if [ -n "$LIVE_PID" ]; then
            kill -9 $LIVE_PID 2>/dev/null
            sleep 1
        fi

        source "$VENV_ACTIVATE"
        nohup uvicorn backend.main:app --reload --port "$LIVE_PORT" >> "$REPO_DIR/billy_live.log" 2>&1 &
        sleep 3

        NEW_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${LIVE_PORT}/" 2>/dev/null)
        if [ "$NEW_HEALTH" == "200" ]; then
            log "Billy is back online on the new commit ($REMOTE_SHA). Deploy successful."
            notify_github "$REMOTE_SHA" "✅ **Autosync: Deployed successfully.** This commit passed syntax check and a live health check, and is now running on the production tunnel."
        else
            log "WARNING: live restart did not come back healthy — check billy_live.log manually."
            notify_github "$REMOTE_SHA" "⚠️ **Autosync: Deployed but unhealthy.** This commit was pulled in, but the live backend didn't respond healthy after restart. @Sarim needs to check billy_live.log manually."
        fi
    else
        log "Update REJECTED — live Billy left untouched, still running on $LOCAL_SHA."
        notify_github "$REMOTE_SHA" "❌ **Autosync: Rejected.** This commit failed automated validation (syntax check or health check) and was NOT deployed. The live backend is still running the previous commit. Check billy_autosync.log on Sarim's machine, or re-check your changes for errors before pushing again."
    fi

    rm -rf "$TEMP_DIR"
done
