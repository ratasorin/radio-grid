container-name=pop-the-grid-frontend
prod-image-name=$(container-name)
dev-image-name=$(container-name)-dev

dev:
	docker build -f ./dev.Dockerfile -t $(dev-image-name) .
	docker run \
		--name $(container-name) \
		--mount type=bind,source=$(PWD),target=/home/node/app \
		--mount type=volume,target=/home/node/app/node_modules \
		-p 8080:8080 -p 35729:35729 \
		-e NODE_ENV=development -e DEBUG=square-grid* \
		--rm \
		-dit \
		$(dev-image-name)

build:
	VERSION=`node -pe "require('./package.json').version"` && \
	docker build -t $(prod-image-name) -t $(prod-image-name):"$$VERSION" .

start:
	docker run --name $(container-name) -p 8080:80 -e NODE_ENV=production --rm -dit $(prod-image-name)

attach:
	docker attach $(container-name)

stop:
	docker kill $(container-name)
