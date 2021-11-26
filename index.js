window.onload = () => {

	const fetchTabela = async () => {
		const data = await fetch("http://localhost:8000/infos/tabela")
		const dataJson = await data.json()
		let list = `
		<table>
		<tr>
			<th>Clube</th>
			<th>Vitórias</th>
			<th>Empates</th>
			<th>Derrotas</th>
  	</tr>`
		dataJson.data.map(item => {
			list += `<tr> <td>${item.clube.charAt(0).toUpperCase() + item.clube.slice(1).toLowerCase()}</td><td>${item.Vitorias}</td> <td>${item.Empates}</td> <td>${item.Derrotas}</td> </tr>`
		})
		document.querySelector('#table').innerHTML = list + '</table>'
	}

	document.getElementById('btn-altura').addEventListener("click", async () => {
		const altura = document.getElementById('altura').value
		if (!altura) {
			return
		}
		const data = await fetch("http://localhost:8000/infos/altura", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ altura })
		})
		const dataJson = await data.json()
		let list = `
		<table>
		<tr>
			<th>Nome</th>
			<th>Clube</th>
			<th>Altura</th>
			<th>Gols Sofridos</th>
			<th>Defesas</th>
			<th>Lançamentos</th>
		</tr>`
		if (dataJson.data.length) {
			dataJson.data.map(item => {
				list += `<tr> <td>${item.nome.charAt(0).toUpperCase() + item.nome.slice(1).toLowerCase()}</td><td>${item.clube}</td> <td>${item.altura}</td> <td>${item.gols_sofridos}</td><td>${item.Defesas}</td><td>${item.Lançamentos}</td> </tr>`
			})
			document.querySelector('#goleiros').innerHTML = list + '</table>'
			document.querySelector('#goleiros').style.display = "block"
			document.querySelector('#error-altura').style.opacity = 0
		} else {
			document.querySelector('#error-altura').style.opacity = 1
			document.querySelector('#goleiros').style.display = "none"
		}
	})

	document.getElementById('btn-time').addEventListener("click", async () => {
		const time = document.getElementById('time').value
		if (!time) {
			return
		}
		const data = await fetch("http://localhost:8000/infos/perdedores", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ time })
		})
		const dataJson = await data.json()
		let list = ``
		if (dataJson.data.length) {
			dataJson.data.map(item => {
				list += `<p><span style="font-weight:bold; color:green">${time.charAt(0).toUpperCase() + time.slice(1).toLowerCase()}</span> x ${item.Perdedor.charAt(0).toUpperCase() + item.Perdedor.slice(1).toLowerCase()} </p>`
			})
			console.log(list)
			document.querySelector('#partidas').innerHTML = list
			document.querySelector('#partidas').style.display = "block"
			document.querySelector('#error-time').style.opacity = 0
		} else {
			document.querySelector('#error-time').style.opacity = 1
			document.querySelector('#partidas').style.display = "none"
		}
	})

	document.getElementById('btn-restante').addEventListener("click", async () => {
		const time = document.getElementById('time-restante').value
		if (!time) {
			return
		}
		const data = await fetch("http://localhost:8000/infos/partidas-restantes", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ time })
		})
		const dataJson = await data.json()
		let list = ``
		if (dataJson.data.length) {
			dataJson.data.map(item => {
				list += `<p><span style="font-weight:bold;">${time.charAt(0).toUpperCase() + time.slice(1).toLowerCase()}</span> x ${item.nome.charAt(0).toUpperCase() + item.nome.slice(1).toLowerCase()} </p>`
			})
			console.log(list)
			document.querySelector('#partidas-restantes').innerHTML = list
			document.querySelector('#partidas-restantes').style.display = "block"
			document.querySelector('#error-time-restantes').style.opacity = 0
		} else {
			document.querySelector('#error-time-restantes').style.opacity = 1
			document.querySelector('#partidas-restantes').style.display = "none"
		}
	})

	document.getElementById('btn-estadio').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/estadios", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#Estadios').innerHTML = list + '</table>'
			document.querySelector('#Estadios').style.display = "block"
		} else {
			document.querySelector('#Estadios').style.display = "none"
		}
	})

	document.getElementById('btn-vencedores').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/vencedores", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#Vencedores').innerHTML = list + '</table>'
			document.querySelector('#Vencedores').style.display = "block"
		} else {
			document.querySelector('#Vencedores').style.display = "none"
		}
	})

	document.getElementById('btn-arbitros').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/arbitro", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#Arbitros').innerHTML = list + '</table>'
			document.querySelector('#Arbitros').style.display = "block"
		} else {
			document.querySelector('#Arbitros').style.display = "none"
		}
	})

	document.getElementById('btn-jogadores_wins').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/jogadores_wins", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#Jogadores_wins').innerHTML = list + '</table>'
			document.querySelector('#Jogadores_wins').style.display = "block"
		} else {
			document.querySelector('#Jogadores_wins').style.display = "none"
		}
	})

	document.getElementById('btn-tecnicos').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/tecnicos", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#Tecnicos').innerHTML = list + '</table>'
			document.querySelector('#Tecnicos').style.display = "block"
		} else {
			document.querySelector('#Tecnicos').style.display = "none"
		}
	})

	document.getElementById('btn-time_campeonato').addEventListener("click", async () => {

		const data = await fetch("http://localhost:8000/infos/times_wins", {
		})
		console.log(data);
		const dataJson = await data.json()
		console.log(dataJson);
		let list = `
		<table>
		<tr>`
		for(var key in dataJson["data"][0]){
			console.log(key);
			list += "<th>"+key+"</th>"
		}
		
		list += "</tr>"
		console.log(list);
		if (dataJson.data.length) {
			for(var item in dataJson["data"]){
				list += "<tr>"
				for(var key in dataJson["data"][item]){
					list += "<td>"+dataJson["data"][item][key]+"</th>"
				}
				list += "</tr>"
			}
			document.querySelector('#time_campeonato').innerHTML = list + '</table>'
			document.querySelector('#time_campeonato').style.display = "block"
		} else {
			document.querySelector('#time_campeonato').style.display = "none"
		}
	})




	fetchTabela()
}