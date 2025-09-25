#!/bin/bash

# Initial Let's Encrypt certificate setup script for tymoshov.net.ua
# Usage: ./init-letsencrypt.sh <email>

if [ $# -ne 1 ]; then
    echo "Usage: $0 <email> <domain>"
    echo "Example: $0 admin@gmail.com tymoshov.info"
    exit 1
fi

if [ $# -ne 2 ]; then
    echo "Usage: $0 <email> <domain>"
    echo "Example: $0 admin@gmail.com tymoshov.info"
    exit 1
fi

DOMAIN=$2
EMAIL=$1
DATA_PATH="./certbot"
RSA_KEY_SIZE=4096
STAGING=0 # Set to 1 if testing

# Check if certificates already exist
if [ -d "$DATA_PATH/conf/live/$DOMAIN" ]; then
    echo "### Existing certificates found for $DOMAIN..."
    echo "### Would you like to continue? This will replace existing certificates."
    read -p "Continue (y/N)? " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
        exit
    fi
fi

# Download recommended TLS parameters
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ] || [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    echo "### Downloading recommended TLS parameters..."
    mkdir -p "$DATA_PATH/conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
    echo
fi

# Create temporary self-signed certificate for nginx to start
echo "### Creating temporary certificate for $DOMAIN..."
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"
docker compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$RSA_KEY_SIZE -days 1\
    -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
    -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

# Start nginx
echo "### Starting nginx..."
docker compose up --force-recreate -d nginx
echo

# Delete temporary certificate
echo "### Deleting temporary certificate for $DOMAIN..."
docker compose run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$DOMAIN && \
    rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
    rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot
echo

# Select appropriate email arg
case "$EMAIL" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $EMAIL" ;;
esac

# Enable staging mode if needed
if [ $STAGING != "0" ]; then staging_arg="--staging"; fi

# Request Let's Encrypt certificate
echo "### Requesting Let's Encrypt certificate for $DOMAIN..."
docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    -d $DOMAIN \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --force-renewal" certbot
echo

# Reload nginx
echo "### Reloading nginx..."
docker compose exec nginx nginx -s reload
echo "### Done!"
