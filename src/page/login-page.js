import {BaseHTMLElement} from  "../core.js"

customElements.define('login-page',class extends BaseHTMLElement {

	build(){
		let code= new URLSearchParams(window.location.hash?.split('?')?.[1]).get('code')

		const style=`
		<style>
		.container{
			display:flex;
			height:100%;
			justify-content:center;
			align-items:center;
		}
		.content{
			width:300px;
			display:flex;
			flex-direction:column;
			gap:10px;
			padding:20px;
			border-radius:5px;
			border:1px solid #DDD;
		}
		h1 {
			align-self:center;
			font-size:18px;
		}
		label{
			font-size:14px;
		}
		p{
			color:red;
			font-size:13px;
		}
		input{
			border:none;
			outline:none;
			background:whitesmoke;
			height:35px;
			padding:0 10px;
			border-radius:5px;
		}
		input:focus{
			border:none;
			outline:none;
		}
		button{
			height:35px;
			cursor:pointer;
		}
		</style>
		`
		return `
		${style}
		<div class='container'>
		<div class='content'>
		<h1>Signin</h1>
		<label>Code</label>
		<input type='number' ${code?`value='${code}'` : ""} />
		<p id='error'></p>
		<button id='login'>Login</button>
		<button id='register'>Register</button>
		</div>
		</div>
		`
	}

	onRendered(){
		let txtError=this.$('#error')
		let edtValue=this.$('input')
		let btnLogin=this.$('#login')
		let btnRegister=this.$('#register')

		const showError = (text)=>{
			if(text.length > 0){
				txtError.style.display="block"
				txtError.innerHTML = text
				return
			}
			txtError.innerHTML = ""
			txtError.style.display="none"
		}
		showError("")

		btnLogin.onclick=()=>{
			if(edtValue.value == "1234"){
				window.location="#/home"
				localStorage.setItem('token','logged-in')
			}else{
				showError("Code is invalid")
			}
		}

		btnRegister.onclick=()=>{
			window.location="#/register"
		}

		edtValue.onkeydown = (e)=>{
			if(txtError.innerHTML.length > 0) {
				showError("")
			}
		}
	}
})