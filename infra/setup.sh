# Create group `www-data` and user `www-data`
sudo addgroup www-data
sudo adduser --system --ingroup www-data --home /www --shell /bin/bash www

# Add user `www-data` to group `docker`
sudo usermod -aG docker www-data

# Copy systemd service file
sudo cp pangenome.service /etc/systemd/system/

# Reload service files
sudo systemctl daemon-reload

# Start service
sudo systemctl start pangenome.service
