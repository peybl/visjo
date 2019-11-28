#!/usr/bin/env bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" || exit
cd .. # go to project root

docker image build -f docker/Dockerfile -t visjo:latest .
