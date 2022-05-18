import {BaseHTMLElement} from  "./core.js"

import "./page/home-page.js"
import "./page/login-page.js"
import "./page/register-page.js"

customElements.define('x-author',class extends HTMLElement{
	isAuthorized(){
		return localStorage.getItem('token') != null
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
		</protected>
		</x-router>
		`
	}
})




