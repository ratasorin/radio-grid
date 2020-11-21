container-name=square-grid

start:
	docker run --name $(container-name) --mount type=bind,source=$(PWD)/src,target=/usr/share/nginx/html -p 8080:80 --rm -dit nginx:1.19-alpine

attach:
	docker attach $(container-name)

stop:
	docker kill $(container-name)
