import {BaseHTMLElement} from  "../core.js"

customElements.define('register-page',class extends BaseHTMLElement{
	build(){
		const style = `
		<style>
		.container{
			height:100%;
			display :flex;
			justify-content:center;
			align-items:center;
		}
		.content{
			border:1px solid #ddd;
			width:300px;
			display :flex;
			gap:10px;
			padding:20px;
			flex-direction:column;
		}
		button,input{
			height:35px;
		}
		input{
			padding:0 10px;
		}
		button{
			cursor:pointer;
		}
		p.error{
			color:red;
		}
		</style>
		`
		const registerSection = `
		<h1>Register</h1>
		<label>Input your name</label>
		<input type='text'/>
		<p id='error' class='error'></p>
		<button id='register'>Submit</button>
		`
		const codeSection = `
		<label>Your code</label>
		<p>${this.code}</p>
		<button id='gotologin'>Go to login</button>
		`
		return `
		${style}
		<div class='container'>
		<div class='content'>
		${this.code ? codeSection : registerSection}
		</div>
		</div>
		`
	}
	onRendered(){
		let btnRegister = this.$('#register')
		let btnGotoLogin = this.$('#gotologin')
		let edtError = this.$('#error')
		let edtValue = this.$('input')
		
		btnRegister?.addEventListener('click', ()=> {
			if(edtValue.value.length <= 0){
				edtError.innerHTML = 'Name should not be blank'
			}else{
				this.code = "1234"
				this.render()
			}
		})
		btnGotoLogin?.addEventListener('click',()=>{
			window.location.href='#/login?code='+this.code
		})

	}
})