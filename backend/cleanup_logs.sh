#!/bin/bash
LOG_DIR="/webapps/moviegallery/backend/logs"

# Найти и удалить файлы, модифицированные более 7 дней назад
find "$LOG_DIR" -type f -mtime +7 -exec rm -f {} \;
