export class BaseHTMLElement extends HTMLElement{
	#rendered
	#shadow
	#useShadow

	constructor(useShadow=true){
		super()
		this.#useShadow=useShadow
	}

	$(selector){
		return this.#getContainer().querySelector(selector)
	}

	$$(selector){
		return this.#getContainer().querySelectorAll(selector)
	}

	findCallback(eventName){
		let registeredEventName=this.getAttribute(eventName)
		let parent = this.parentNode
		while (parent !=document.body) {
			let node = parent.host ? parent.host:parent
			let eventCallback=node[registeredEventName]
			if(eventCallback){
				return eventCallback.bind(node)
			}
			parent=parent.parentNode
		}
		return null
	}

	findAttrValue(attrName){
		let registeredAttrName=this.getAttribute(attrName)
		if(!registeredAttrName.includes('$')){
			return null
		}
		registeredAttrName = registeredAttrName.split("$")[1]
		let parent = this.parentNode
		while (parent !=document.body) {
			let node = parent.host ? parent.host:parent
			let attr=node[registeredAttrName]
			if(attr){
				return attr
			}
			parent=parent.parentNode
		}
		return null
	}

	build() {
		if(this.#useShadow) {
			return `<slot></slot>`
		}
		return this.innerHTML
	}

	#getContainer(){
		let container = this
		if(this.#useShadow){
			if(!this.#shadow){
				this.#shadow = this.attachShadow({mode:'open'})
			}	
			container = this.#shadow
		}
		return container
	}

	render(){
		if(!this.shouldRender()){
			return
		}
		this.#getContainer().innerHTML = this.build()
		this.onRendered()
	}
	shouldRender(){
		return true
	}
	onRendered(){}

	connectedCallback(){
		if(!this.#rendered) {
			this.render()
			this.#rendered = true
		}
	}
}

export const defineTag=(name,definition)=>{
	if(customElements.get(name)) {
		return
	}
	customElements.define(name,definition)
}

/**
* Example:
* 
* 	<x-router>
*		<x-route path='/login' page='login-page'></x-route>
*		<x-route path='/register' page='register-page'></x-route>
*
*		<protected author='x-author' return-path='/login'>
*			<x-route path='/home' page='home-page' default></x-route>
*			<x-route path='/home1' page='home1-page' default></x-route>
*		</protected>
*	</x-router>
* */
defineTag('x-router',class extends HTMLElement {
	constructor(){
		super()
		this.routes=this.getRoutes()
		window.onhashchange=this.onRouteChange.bind(this)
		this.onRouteChange()
	}

	getRoutes(){
		let routes={}
		if(!this.hasChildNodes()) {
			return routes
		}
		const xRouteTag  ='x-route'.toUpperCase()
		const xProtectedTag  ='protected'.toUpperCase()

		const appendRouteIfNeeded = (child,isProtected)=>{
			if(child.tagName !== xRouteTag){
				return
			}
			let page=child.getAttribute('page')
			if(!customElements.get(page)){
				throw new Error(page + " not found")
			}
			let route={
				'path':child.getAttribute('path'),
				'page':page,
				'default':child.hasAttribute('default'),
				'protected':isProtected
			}
			routes[route['path']] = route
			return route;
		}

		for (let child of this.children){
			if(child.tagName === xProtectedTag){
				let author=child.getAttribute('author')
				if(!author){
					throw new Error("author required")
				}
				let returnPath=child.getAttribute('return-path')
				if(!returnPath){
					throw new Error('return-path required')
				}
				let protectedRoute={
					'author':document.createElement(author),
					'return-path':returnPath,
					'routes':[]
				}
				routes['protected'] = protectedRoute

				for(let subChild of child.children){
					let route = appendRouteIfNeeded(subChild,true)
					protectedRoute['routes'].push(route['path'])
				}
				continue;
			}
			appendRouteIfNeeded(child)
		}
		return routes
	}

	onRouteChange(){
		let hash=window.location.hash
		let currentPath= hash?hash.split('#')[1].split("?")[0] : "/"

		if(!this.routes) {
			return
		}

		let route = this.findRouteByPath(currentPath)

		if(!route) {
			throw new Error('Page '+currentPath+" not found")
			return
		}
		this.handleRouteChange(route)
	}

	handleRouteChange(route){
		let routePath = route['path']
		let protectedRoute=this.routes['protected']
		let isRouteProtected = protectedRoute && route['protected']
		if(!isRouteProtected){
			this.setCurrentRoute(route)
			return
		}
		let author=protectedRoute['author']

		if(author.isAuthorized?.()){
			this.setCurrentRoute(route)
			return
		}
		window.location = '#'+protectedRoute['return-path']
	}

	setCurrentRoute(route){
		let pageName=route['page']
		this.innerHTML = `<${pageName}></${pageName}>`
	}

	findRouteByPath(path){
		if(!path) {
			return null
		}
		if(path =="/"){
			return Object.values(this.routes).find(it=>it['default'])
		}
		return this.routes[path]
	}
})

