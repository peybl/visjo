#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" || exit
cd "${DIR}/.." || exit  # go to project root

REPO_PATH="$(pwd)"
export REPO_PATH

docker-compose up -d
docker-compose logs -f
