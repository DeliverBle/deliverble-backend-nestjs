redeploy:
	@echo "building..."
	npm run build

	@echo "restarting pm2..."
	pm2 restart main
