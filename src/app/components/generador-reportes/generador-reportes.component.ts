import { Component, OnInit } from '@angular/core';

declare const gapi: any;

@Component({
  selector: 'app-generador-reportes',
  templateUrl: './generador-reportes.component.html',
  styleUrls: ['./generador-reportes.component.css']
})
export class GeneradorReportesComponent implements OnInit {

  dangerousVideoUrl: any;
  videoUrl: any;
  scriptViewSelector: any;
  scriptViewSeguro: any;

  // VIEW_ID = '230218277';
  VIEW_ID = '210355580';

  constructor() {
    // const _self = this;
    // window['onSignIn'] = function (user) { _self.onSignIn(user); };

    // window['onSignIn'] = (user) => this.ngZone.run(() => this.onSignIn(user))
  }


  ngOnInit(): void {
    // this.queryReports();
    // (window as any).googleLogin = this.googleLogin
  }//Fin ngoninit

  ngAfterViewInit() {
    gapi.signin2.render('google-signin2', {
      'scope': 'profile email',
      'width': 800,
      'height': 50,
      'longtitle': true,
      'onsuccess': param => this.onSignIn(param),
      'onfailure': this.onFailure()
    });
  }

  onSignIn(googleUser) {

    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    this.queryReports()
  }

  onFailure() {
    console.log("Fallo Conexión");
  }


  // Query the API and print the results to the page.
  queryReports() {

    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:date"
              },
              {
                name: "ga:segment"
              },
              {
                name: "ga:keyword"
              },
              {
                name: "ga:medium"
              },
              {
                name: "ga:source"
              }
            ],
            segments: [{ "segmentId": "gaid::-5" }, { "segmentId": "gaid::-7" }],
            orderBys: [
              {
                fieldName: "ga:date", sortOrder: "ASCENDING"
              }
            ]
          }
        ]
      }
    }).then(this.displayResults, console.error.bind(console))
      .catch(console.log("Erick")
      )


    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:date"
              }
            ],
            orderBys: [
              {
                fieldName: "ga:date", sortOrder: "ASCENDING"
              }
            ]
          }
        ]
      }
    }).then(this.displayResults, console.error.bind(console))
      .catch(console.log("Erick")
      )


    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: this.VIEW_ID,
            dateRanges: [
              {
                startDate: "2021-07-01",
                endDate: "2021-07-31"
              }
            ],
            metrics: [
              {
                expression: 'ga:users',
                alias: 'Usuarios'
              }
            ],
            dimensions: [
              {
                name: "ga:pagePath"
              }
            ],
            orderBys: [
              {
                fieldName: "ga:users", sortOrder: "DESCENDING"
              }
            ],
          }
        ]
      }
    }).then(this.displayResults, console.error.bind(console))
      .catch(console.log("Erick")
      )


  }//Termina metodo de queryreports

  displayResults(response) {
    var formattedJson = JSON.stringify(response.result, null, 2);
    console.log(response.result);

    // console.log(formattedJson);
  }





}//Fin export

