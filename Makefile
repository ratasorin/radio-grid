container-name=square-grid
dev-image-name=$(container-name)-dev
mount-args=

dev:
	docker build --tag $(dev-image-name) .
	docker run \
		--name $(container-name) \
		--mount type=bind,source=$(PWD),target=/home/node/app \
		--mount type=volume,target=/home/node/app/node_modules \
		-p 8080:8080 -p 8081:8081 \
		--rm \
		-dit \
		$(dev-image-name)

start:
	docker run --name $(container-name) --mount type=bind,source=$(PWD)/src,target=/usr/share/nginx/html -p 8080:80 --rm -dit nginx:1.19-alpine

attach:
	docker attach $(container-name)

stop:
	docker kill $(container-name)
