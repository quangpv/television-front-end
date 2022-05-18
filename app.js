import {BaseHTMLElement} from  "./core.js"

import "./home-page.js"
import "./login-page.js"
import "./register-page.js"

customElements.define('x-author',class extends HTMLElement{
	isAuthorized(){
		return localStorage.getItem('token') != null
	}
})

customElements.define('home1-page',class extends BaseHTMLElement{
	build(){

		return `
			<div>
				This is home page 1
			</div>
		`
	}
})

customElements.define('my-app', class extends BaseHTMLElement {

	build(){
		return `
		<x-router>

		<x-route path='/login' page='login-page'></x-route>
		<x-route path='/register' page='register-page'></x-route>

		<protected author='x-author' return-path='/login'>
		<x-route path='/home' page='home-page' default></x-route>
		<x-route path='/home1' page='home1-page' default></x-route>
		</protected>
		</x-router>
		`
	}
})




