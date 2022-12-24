redeploy:
	@echo "building..."
	npm run build

	@echo "restarting pm2..."
	pm2 restart main

redeploy-pull:
	@echo "pulling..."
	git pull origin develop

	# run make redeploy
	make redeploy
