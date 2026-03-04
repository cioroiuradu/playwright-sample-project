#!/bin/bash

# -------------------------------------------------------------------
# Load secrets from AWS Secrets Manager into a local .env file.
#
# Fetches a JSON secret, extracts all key-value pairs, and writes
# them to .env in KEY='VALUE' format so dotenv can pick them up.
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - jq installed (brew install jq / apt install jq)
#   - Valid AWS credentials for the target profile
#
# Usage:
#   ./scripts/loadSecrets.sh
#
# Override defaults via environment variables:
#   AWS_SECRET_ID=my/secret AWS_PROFILE=dev AWS_REGION=us-east-1 ./scripts/loadSecrets.sh
# -------------------------------------------------------------------

SECRET_ID="${AWS_SECRET_ID:-your-secret-id}"
PROFILE="${AWS_PROFILE:-your-aws-profile}"
REGION="${AWS_REGION:-eu-central-1}"

echo "Fetching secret '${SECRET_ID}' (profile=${PROFILE}, region=${REGION})..."

aws secretsmanager get-secret-value \
  --secret-id "${SECRET_ID}" \
  --profile "${PROFILE}" \
  --region "${REGION}" \
  | jq -r '.SecretString' | jq -r 'keys[] as $k | "\($k)='"'"'\(.[$k])'"'"'"' > .env

echo "Secrets written to .env"
