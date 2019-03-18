Vue.component('route-profile', {
	data() {
		return {
			name: '',
			phoneNo: '',
			adress: '',
			bookings: '',
			bookingColumns: ''
		}
	},
	methods: {
		// Hämta kontouppgifter.
		getProfile() {
			fetch('/api/getProfile')
			.then(res => res.json())
			.then(data => {
				this.name = data.profile[0].name;
				this.phoneNo = data.profile[0].phoneNo;
				this.adress = data.profile[0].adress;
			})
		},
		// Uppdaterar kontouppgifter.
		updateProfile() {
			fetch('/api/updateProfile', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({name: this.name, phoneNo: this.phoneNo, adress: this.adress})
			})
			.then(function(response){
				if (response.status === 200) {
					alert("Dina kontouppgifter är nu uppdaterade");
					this.updateProfile();
				} else if (response.status === 406) {
					alert("Får många tecken i dina uppgifter.")
				} else {
					alert("Ops... Ett fel har uppstått... Försök igen");
				}
			});
		},
		// Hämta lista med bokningar till användaren.
		getBookingsByUser() {
			fetch('/api/getBookingsByUser')
				.then(res => res.json())
				.then(data => {
					this.bookings = data.bookings;
					this.bookingColumns = data.columns;
			})
		},
		// Logga ut användaren.
		logOut() {
			fetch('/api/logOut')
			.then(function(response){
				if (response.status === 200) {
					alert("Du är nu utloggad! Välkommen åter.");
					router.push('/start');
					app.$data.isAdmin = false;
				} else {
					alert("Ops... Ett fel har uppstått... Försök igen");
				}
			})
		}
	},
	created() {
		this.getProfile();
		this.getBookingsByUser();
	},
	template:  `
<div class="container">
	<div class="row">
		<div class="col-sm-12">
			<div class="card text-white bg-dark">
				<div class="card-header d-flex justify-content-between w-100">
					Mitt konto
					<a class="btn btn-sm btn-danger" v-on:click="logOut()" href="#">Logga ut</a>
				</div>
				<div class="card-body">
					<ul class="nav nav-tabs" id="myTab" role="tablist">
						<li class="nav-item">
							<a class="nav-link active" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">Mina uppgifter</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" id="bookings-tab" data-toggle="tab" href="#bookings" role="tab" aria-controls="contact" aria-selected="false">Bokningar</a>
						</li>
					</ul>
					<div class="tab-content" id="myTabContent">		
						<div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
							<h5> </h5>
							<form v-on:submit.prevent="updateProfile()">
								<div class="form-group row">
									<label for="name" class="col-sm-1 col-form-label">Namn:</label>
									<div class="col-sm-3">
										<input type="text" class="form-control" id="name" v-model="name" placeholder="Ditt namn" required>
									</div>
									<label for="adress" class="col-sm-1 col-form-label">Adress:</label>
									<div class="col-sm-3">
										<input type="text" class="form-control" id="adress" v-model="adress" required placeholder="Din adress">
									</div>
								</div>
								<div class="form-group row">
									<label for="phoneNo" class="col-sm-1 col-form-label">Tfn.nr:</label>
									<div class="col-sm-3">
										<input type="text" class="form-control" id="phoneNo" v-model="phoneNo" required placeholder="Ditt telefonnummer">
									</div>
								</div>
								<div class="form-group row">
									<div class="col-sm-3">
											<input class="btn btn-primary" type="submit" value="Uppdatera kontouppgifter">
										</div>
								</div>
							</form>
						</div>
						<div class="tab-pane fade" id="bookings" role="tabpanel" aria-labelledby="bookings-tab">
							<table class="table table-dark">
								<thead>
									<tr>
										<th scope="col" v-for="column in bookingColumns">{{ column }}</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="booking in bookings">
										<td v-for="value in booking">{{ value }}</td>
										</tr>
								</tbody>
							</table>
						</div>			
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`
});
