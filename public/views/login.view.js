Vue.component('route-login', {
	data() {
		return {
			username: '',
			password: '',
			new_username: '',
			new_password: '',
			loggedIn: true,
		}
	},
	methods: {
		// Användaren trycker på "login".
		login() {
			fetch('/api/loginUser', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username: this.username, password: this.password})
			})
			.then(res => res.json())
			.then(data => {
				if (data.user) {
					alert("Inloggning lyckad. Klicka för att komma till din profil.");
					console.log(data.isAdmin);
					this.$router.push("/profile");
					this.$root.isAdmin = data.isAdmin;
				} else {
					alert("Fel användarnamn eller lösenord.");
					this.password = '';
				}
			})
		},
		// Registera en ny användare.
		register() {
			fetch('/api/addUser', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({new_username: this.new_username, new_password: this.new_password})
			})
			.then(res => res.json())
			.then(data => {
				if (data.newUser === true) {
					alert("Du har nu blivit registrerad i våra system. Klicka för att komma till din profil.");
					this.$router.push("/profile");
				} else if (data.newUser === "toLong") {
					alert("För långt användarnamn.");
					this.new_username = '';
					this.new_password = '';
				} else if (data.newUser === "toShortUsername") {
					alert("För kort användarnamn. Ange minst 8 tecken.");
					this.new_username = '';
					this.new_password = '';
				} else if (data.newUser === "toShortPassword") {
					alert("För kort lösenord. Ange minst 8 tecken.");
					this.new_username = '';
					this.new_password = '';
				} else {
					alert("Användaren finns redan. Välj annat användarnamn.");
					this.new_username = '';
					this.new_password = '';
				}
			})
		},
	},
	created() {

		// Kollar om användaren är inloggad, då skickas denna direkt till mitt-konto.
		fetch('api/isLoggedIn')
		.then(res => res.json())
		.then(data => {
			if (data.loggedIn) {
				this.$router.push(`/profile`);
			} else {
				this.loggedIn = false;
			}
		})
	},
	template:`
	<div class="container" v-if="loggedIn===false" >
		<div class="row">
			<div class="col-sm-6">
				<div class="card text-white bg-dark">
					<div class="card-body">
						<h5 class="card-title">Logga in</h5>
						<form v-on:submit.prevent="login()">
							<div class="form-group">
								<label for="exampleInputEmail1">Användarnamn eller e-postadress</label>
								<input type="text" class="form-control" v-model="username" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Användarnamn eller e-postadress" required maxlength="30">							</div>
							<div class="form-group">
								<label for="exampleInputPassword1">Lösenord</label>
								<input type="password" class="form-control" v-model="password" id="exampleInputPassword1" placeholder="Lösenord" required maxlength="30">
							</div>
							<button type="submit" class="btn btn-primary">Logga in</button>
						</form>						
					</div>
				</div>
			</div>
			<div class="col-sm-6">
				<div class="card text-white bg-dark">
					<div class="card-body">
						<h5 class="card-title">Registrera</h5>
						<form v-on:submit.prevent="register()">
							<div class="form-group">
								<label for="exampleInputEmail2">Användarnamn eller e-postadress</label>
								<input type="text" class="form-control" v-model="new_username" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Användarnamn eller e-postadress" required>							</div>
							<div class="form-group">
								<label for="exampleInputPassword2">Lösenord</label>
								<input type="password" class="form-control" v-model="new_password" id="exampleInputPassword2" placeholder="Lösenord" required>
							</div>
							<button type="submit" class="btn btn-primary">Logga in</button>
						</form>	
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});
