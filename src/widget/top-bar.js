import {defineTag,BaseHTMLElement} from  "../core.js"

defineTag('top-bar',class extends BaseHTMLElement{

	build(){
		const style=`
		<style>
		.section{
			display:flex;
			align-items:center;
			justify-content:start;
			gap:20px;
		}
		h1 {
			font-size:18px;
			font-weight:bold;
		}
		button {
			background: transparent;
			border:none;
			cursor:pointer;
			color:blue;
		}
		.action{
			margin-left:auto;
			display:flex;
			gap:10px;
		}
		input{
			width:300px;
			height:35px;
			border:none;
			background:whitesmoke;
			padding:0px 10px;
			border-radius:5px;
			border:1px solid #ddd;
		}
		input:focus{
			outline:none;
		}
		</style>
		`
		return `
		${style}
		<div class="section">
		<h1> Television </h1>
		<input type='search' placeholder='Search channel'/>
		<div class='action'>
		<button id='logout'>Logout</button>
		<button id='refresh'>Refresh</button>
		</div>
		</div>
		`
	}

	onRendered(){
		this.$('#logout').onclick=()=>this.findCallback('logout-click')?.()
		this.$('#refresh').onclick=()=>this.findCallback('refresh-click')?.()
		this.$('h1').onclick=()=>this.findCallback('title-click')?.()
		this.$('input').onkeyup=(e)=>this.findCallback('search')?.(e.currentTarget.value)
	}
})